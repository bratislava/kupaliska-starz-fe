import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { Button, CheckboxField, Icon, InputField, Tooltip } from '../../components'
import { Button as AriaButton } from 'react-aria-components'
import { AssociatedSwimmer, fetchAssociatedSwimmers } from '../../store/associatedSwimmers/api'
import { useQuery, useQueryClient } from 'react-query'
import { useErrorToast } from '../../hooks/useErrorToast'
import { Trans, useTranslation } from 'react-i18next'
import { CheckPriceResponse, TicketType } from '../../models'
import { checkDiscountCode, DiscountCodeResponse, getPrice } from '../../store/order/api'
import to from 'await-to-js'
import { AxiosError, AxiosResponse } from 'axios'
import {
  Controller,
  FieldErrors,
  useForm,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
  useWatch,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { BooleanSchema, NumberSchema, StringSchema } from 'yup'
import { useCounter, useIsClient, useIsMounted, useTimeout } from 'usehooks-ts'
import { fetchUser } from '../../store/user/api'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import './OrderPage.css'
import { Link } from 'react-router'
import { useOrder } from './useOrder'
import { orderFormToRequests } from './formDataToRequests'
import { UseFormRegister } from 'react-hook-form/dist/types/form'
import { environment } from '../../environment'
import {
  ErrorWithMessages,
  getErrorMessagesFromHttpRequest,
  useValidationSchemaTranslationIfPresent,
} from 'helpers/general'
import AssociatedSwimmerEditAddModal from '../../components/AssociatedSwimmerEditAddModal/AssociatedSwimmerEditAddModal'
import Turnstile from 'react-turnstile'
import OrderPageSwimmersList from '../../components/OrderPage/OrderPageSwimmersList'
import ChildrenConfirmationModal from '../../components/ChildrenConfirmationModal/ChildrenConfirmationModal'
import { useAccount } from 'hooks/useAccount'
import useCityAccount from 'hooks/useCityAccount'
import OrderMissingInformationProfileModal from '../../components/OrderMissingInformationProfileModal/OrderMissingInformationProfileModal'
import {
  FormatCurrencyFromCents,
  useCurrencyFromCentsFormatter,
} from '../../helpers/currencyFormatter'
import { useOrderPageTicket } from './useOrderPageTicket'
import logger from 'helpers/logger'
import { AccountType } from 'helpers/cityAccountDto'
import { ROUTES } from 'helpers/constants'
import { PaymentMethod } from 'helpers/types'
import PayButton from './PayButton'
import { isDefined } from 'helpers/helper'

type CaptchaWarningStatus = 'loading' | 'show' | 'hide'

/**
 * Figma: https://www.figma.com/design/7ZleKHCPWbiQKjCV9nU7PW/Starz---Dizajn-2024?node-id=2008-14092
 */

const OrderPageEmail = ({
  register,
  errors,
}: {
  register: UseFormRegister<OrderFormData>
  errors: FieldErrors<OrderFormData>
}) => {
  const { ticketTypesWithAdditionalProperties } = useOrderPageTicket()
  const { t } = useTranslation()
  const { data: account } = useAccount()

  let errorInterpreted = useValidationSchemaTranslationIfPresent(errors.email?.message)

  return ticketTypesWithAdditionalProperties.some((ticketType) => ticketType.requireEmail) ? (
    <InputField
      className="flex-col gap-y-2 flex"
      name="email"
      register={register}
      // TODO redo InputField styles
      label={<span className="font-semibold text-base">{t('common.email')}</span>}
      error={errorInterpreted}
    />
  ) : (
    <Trans
      i18nKey={'buy-page.email-send-to'}
      components={{ span: <span /> }}
      values={{ username: account?.email }}
    />
  )
}

const OrderPageOptionalFields = ({
  register,
  errors,
}: {
  register: UseFormRegister<OrderFormData>
  errors: FieldErrors<OrderFormData>
}) => {
  const { t } = useTranslation()

  return (
    <>
      <Tooltip multiline={true} id="tooltip-customer-form" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <InputField
          className="col-span-2 lg:col-span-1 mt-6 max-w-formMax flex-col gap-y-2 flex"
          name="age"
          register={register}
          error={errors.age?.message ? t(`${errors.age?.message}`) : undefined}
          type="number"
          valueAsNumber={true}
          label={
            <>
              <span className="font-semibold text-base">{t('buy-page.age')}</span>
              <span className="text-base">{t('buy-page.optional')}</span>
            </>
          }
        />
        <InputField
          className="col-span-2 lg:col-span-1 mt-6 max-w-formMax flex-col gap-y-2 flex"
          name="zip"
          register={register}
          error={errors.zip?.message}
          label={
            <>
              <span className="font-semibold text-base">{t('buy-page.zip')}</span>
              <span className="text-base">{t('buy-page.optional')}</span>
            </>
          }
        />
      </div>
    </>
  )
}

const OrderPagePeopleList = ({
  errors,
  watch,
  setValue,
}: {
  errors: FieldErrors<OrderFormData>
  watch: UseFormWatch<OrderFormData>
  setValue: UseFormSetValue<OrderFormData>
}) => {
  const { ticketTypesWithAdditionalProperties } = useOrderPageTicket()
  const displayMissingInformationWarning = ticketTypesWithAdditionalProperties.some(
    (ticketType) => ticketType.displayMissingInformationWarning,
  )
  const [addSwimmerModalOpen, setAddSwimmerModalOpen] = useState(false)
  const [missingInformationModalOpen, setMissingInformationModalOpen] = useState(false)
  // each time new swimmer is added we want to preselect them, this tracks the length for which the preselection was done
  const [swimmerListSizePrefillDone, setSwimmerListSizePrefillDone] = useState(false)

  const associatedSwimmersQuery = useQuery('associatedSwimmers', fetchAssociatedSwimmers)
  const userQuery = useQuery('user', fetchUser)
  const { data: account } = useAccount()
  const { dispatchErrorToast } = useErrorToast()
  const { t } = useTranslation()

  /* Merges the list of associated swimmers with the logged-in user. */
  const mergedSwimmers = useMemo(() => {
    const swimmersWithOwner = []
    if (userQuery.data && account?.['custom:account_type'] === AccountType.FO) {
      swimmersWithOwner.push({
        id: null,
        age: userQuery.data.data.age,
        zip: userQuery.data.data.zip,
        image: userQuery.data.data.image,
        firstname: account?.given_name as string,
        lastname: account?.family_name as string,
        isPhysicalEntity: account?.['custom:account_type'] === AccountType.FO,
      })
    }
    if (associatedSwimmersQuery.data) {
      swimmersWithOwner.push(...associatedSwimmersQuery.data.data.associatedSwimmers)
    }

    return swimmersWithOwner
  }, [
    account?.family_name,
    account?.given_name,
    account?.['custom:account_type'],
    associatedSwimmersQuery.data,
    userQuery.data,
  ])

  // useEffect(() => {
  //   // initial prefill when we get the list of associated swimmers
  //   if (!mergedSwimmers?.length || swimmerListSizePrefillDone) return
  //   setValue(
  //     'selectedSwimmerIds',
  //     mergedSwimmers
  //       .filter(
  //         (swimmer) =>
  //           !('isPhysicalEntity' in swimmer) ||
  //           ('isPhysicalEntity' in swimmer && swimmer.isPhysicalEntity),
  //       )
  //       .map((swimmer) => swimmer.id),
  //   )
  //   setSwimmerListSizePrefillDone(true)
  // }, [mergedSwimmers,
  //   // selectedSwimmerIds,
  //   setValue,
  //   swimmerListSizePrefillDone])

  const error = associatedSwimmersQuery.error || userQuery.error

  useEffect(() => {
    if (error) {
      dispatchErrorToast()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])
  const ticketTypesData = watch('ticketTypesData')

  const handleSelectSwimmer = (
    swimmerToSelect: Partial<AssociatedSwimmer>,
    ticketTypeId: string,
  ) => {
    // `null` is current user, therefore we don't check for it
    if (swimmerToSelect.id === undefined) {
      return
    }
    const ticketTypeIndex = ticketTypesData.findIndex(
      (ticketTypeData) => ticketTypeData.ticketType.id === ticketTypeId,
    )
    if (ticketTypeIndex !== -1) {
      if (ticketTypesData[ticketTypeIndex].selectedSwimmerIds?.includes(swimmerToSelect.id)) {
        const newTicketTypesData = ticketTypesData.map((ticketTypeData, index) =>
          index === ticketTypeIndex
            ? {
                ...ticketTypeData,
                selectedSwimmerIds: ticketTypeData.selectedSwimmerIds?.filter(
                  (p) => p !== swimmerToSelect.id,
                ),
              }
            : ticketTypeData,
        )

        setValue('ticketTypesData', newTicketTypesData)
      } else {
        const newSelectedSwimmerIds = [
          ...(ticketTypesData[ticketTypeIndex].selectedSwimmerIds || []),
          swimmerToSelect.id,
        ]
        const newTicketTypesData = ticketTypesData.map((ticketTypeData, index) =>
          index === ticketTypeIndex
            ? {
                ...ticketTypeData,
                selectedSwimmerIds: newSelectedSwimmerIds,
              }
            : ticketTypeData,
        )

        setValue('ticketTypesData', newTicketTypesData)
      }
    }
  }

  const shouldDisplayMissingInformationWarning =
    displayMissingInformationWarning &&
    ticketTypesData.some((ticketTypeData) => ticketTypeData.selectedSwimmerIds?.includes(null))

  return (
    <>
      {missingInformationModalOpen && userQuery.data?.data && (
        <OrderMissingInformationProfileModal
          user={userQuery.data.data}
          onClose={() => setMissingInformationModalOpen(false)}
        ></OrderMissingInformationProfileModal>
      )}
      {addSwimmerModalOpen && (
        <AssociatedSwimmerEditAddModal
          onClose={() => setAddSwimmerModalOpen(false)}
          // good enough for now, we don't allow multiple order with multiple ticketTypes where name is requeired
          onSaveSuccess={(savedSwimmer) => {
            ticketTypesWithAdditionalProperties.length > 0 &&
              handleSelectSwimmer(
                savedSwimmer,
                ticketTypesWithAdditionalProperties[0].ticketType.id,
              )
          }}
        ></AssociatedSwimmerEditAddModal>
      )}
      {/* TODO errors everywhere, refactor */}
      {shouldDisplayMissingInformationWarning && (
        <div className="flex py-4 px-5 bg-error rounded-lg gap-x-3 my-6 text-white">
          <Icon name="warning" className="no-fill text-white"></Icon>
          <div>
            Pre kúpu permanentky je potrebné doplniť fotografiu a dátum narodenia.{' '}
            <AriaButton
              onPress={() => setMissingInformationModalOpen(true)}
              className="underline font-semibold"
            >
              Doplniť povinné údaje
            </AriaButton>
          </div>
        </div>
      )}
      {ticketTypesData.map(
        (ticketTypeData) =>
          ticketTypeData.selectedSwimmerIds &&
          mergedSwimmers && (
            <OrderPageSwimmersList
              key={ticketTypeData.ticketType.id}
              selectedSwimmerIds={ticketTypeData.selectedSwimmerIds}
              swimmers={mergedSwimmers}
              onSelectSwimmer={(swimmer) =>
                handleSelectSwimmer(swimmer, ticketTypeData.ticketType.id)
              }
              onAddSwimmer={() => setAddSwimmerModalOpen(true)}
            />
          ),
      )}

      <div className="text-error px-2 text-sm">
        {errors.ticketTypesData
          ?.map((field) => field.selectedSwimmerIds?.map((field) => field.message))
          .join('/n')}
      </div>
    </>
  )
}

const OrderPageDiscountCode = ({
  setValue,
  getValues,
  incrementCaptchaKey,
  errors,
  setCaptchaWarning,
  captchaWarning,
}: {
  setValue: UseFormSetValue<OrderFormData>
  getValues: UseFormGetValues<OrderFormData>
  incrementCaptchaKey: () => void
  errors: FieldErrors<OrderFormData>
  setCaptchaWarning: (captchaWarning: CaptchaWarningStatus) => void
  captchaWarning: CaptchaWarningStatus
}) => {
  const [useDiscountCode, setUseDiscountCode] = useState(false)

  const { t } = useTranslation()

  const handleUseDiscountCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    setUseDiscountCode(checked)
    if (!checked && getValues('discountCode') != null) {
      setValue('discountCode', null)
    }
  }

  return (
    <div className="flex-col gap-y-6 flex">
      <CheckboxField
        valueOfInput={useDiscountCode}
        onChange={handleUseDiscountCodeChange}
        label={t('buy-page.claim-code')}
      />
      {useDiscountCode && (
        <>
          <OrderPageDiscountCodeInput
            captchaWarning={captchaWarning}
            setCaptchaWarning={setCaptchaWarning}
            setValue={setValue}
            getValues={getValues}
            incrementCaptchaKey={incrementCaptchaKey}
            errors={errors}
          />
        </>
      )}
    </div>
  )
}

enum OrderPageDiscountCodeInputStatus {
  None,
  Success,
  Error,
}

const OrderPageDiscountCodeInput = ({
  setValue,
  getValues,
  incrementCaptchaKey,
  errors,
  captchaWarning,
  setCaptchaWarning,
}: {
  setValue: UseFormSetValue<OrderFormData>
  getValues: UseFormGetValues<OrderFormData>
  incrementCaptchaKey: () => void
  errors: FieldErrors<OrderFormData>
  captchaWarning: CaptchaWarningStatus
  setCaptchaWarning: (captchaWarning: CaptchaWarningStatus) => void
}) => {
  const { t } = useTranslation()

  const { dispatchErrorToast } = useErrorToast()
  const isMounted = useIsMounted()

  const [discountCode, setDiscountCode] = useState('')
  const [status, setStatus] = useState(OrderPageDiscountCodeInputStatus.None)

  const handleApply = async () => {
    if (getValues('discountCode') != null) {
      setValue('discountCode', null)
    }
    if (!getValues('recaptchaToken')) {
      setCaptchaWarning('show')
      return
    }
    setStatus(OrderPageDiscountCodeInputStatus.None)

    incrementCaptchaKey()
    const [error, response] = await to<AxiosResponse<DiscountCodeResponse>, AxiosError>(
      checkDiscountCode(discountCode, getValues('recaptchaToken') ?? ''),
    )
    if (!isMounted()) {
      return
    }
    if (response) {
      setValue('discountCode', response.data.discountCode)
      setStatus(OrderPageDiscountCodeInputStatus.Success)
      return
    }
    const errorStatus = error?.response?.status
    if (errorStatus === 404 || errorStatus === 400) {
      setStatus(OrderPageDiscountCodeInputStatus.Error)
    } else {
      dispatchErrorToast()
    }
  }

  return (
    <div>
      <div className="flex-col lg:flex-row gap-x-4 flex gap-y-4 lg:gap-y-0 items-center">
        {/* TODO doesn't look good on desktop when error is present */}
        <InputField
          value={discountCode}
          onChange={(event) => setDiscountCode(event.target.value)}
          error={
            status === OrderPageDiscountCodeInputStatus.Error ? t('buy-page.error-code') : undefined
          }
          inputWrapperClassName="lg:w-full"
          placeholder={t('buy-page.enter-code')}
        />
        <Button className="px-5 py-3" color="outlined" onClick={handleApply} rounded>
          {t('buy-page.claim')}
        </Button>
        {status === OrderPageDiscountCodeInputStatus.Success ? (
          <Icon name="checkmark" className="text-success" />
        ) : null}
      </div>
      {(captchaWarning === 'show' || errors.recaptchaToken) && (
        <p className="text-p3 mt-1 text-error">
          {t('landing.captcha-warning-required-and-reapply')}
        </p>
      )}
    </div>
  )
}

const validationSchema = yup.object({
  email: yup.string().when('$requireEmail', (requireEmail: boolean, schema: StringSchema) => {
    if (requireEmail) {
      return schema.email('buy-page.email-required').required('buy-page.email-required')
    }
    return schema
  }),
  // TODO improve error message when max ticket purchase limit is exceeded
  ticketTypesData: yup
    .array()
    .required()
    .test({
      name: 'ticketTypesData',
      message: 'buy-page.max-ticket-purchase-limit-exceeded',
      // TODO investigate if we can have real type of value
      test: (value) => {
        const cumulativeTicketAmount = value?.reduce(
          (acc, curr) => acc + (curr.ticketAmount ?? 0),
          0,
        )

        return cumulativeTicketAmount <= environment.maxTicketPurchaseLimit
      },
    }),
  /* TODO: improve */
  discountCode: yup.object().nullable(true),
  /* TODO: improve */
  selectedSwimmerIds: yup.array(),
  // .when("$hasSwimmers", (hasSwimmers: boolean, schema: ArraySchema<any>) => {
  //   if (hasSwimmers) {
  //     return schema.min(1, "adasd");
  //     // .of(yup.mixed().oneOf([yup.string(), null]));
  //   }
  //   return schema;
  // }),
  agreement: yup.boolean().isTrue('buy-page.vop-required'),
  seniorOrDisabledAgreement: yup
    .boolean()
    .when(
      '$isSeniorOrDisabledTicket',
      (isSeniorOrDisabledTicket: boolean, schema: BooleanSchema) => {
        if (isSeniorOrDisabledTicket) {
          return schema.isTrue('buy-page.senior-agreement-required')
        }
        return schema
      },
    ),
  age: yup
    .number()
    .integer('common.age-integer')
    .when('$hasOptionalFields', (hasOptionalFields: boolean, schema: NumberSchema) => {
      if (hasOptionalFields) {
        return schema
          .optional()
          .nullable(true)
          .min(3, 'common.additional-info-toddlers')
          .max(150, 'common.additional-info-tutanchamon')
          .transform((val) => (isNaN(val) ? null : val))
      }
      return schema
    }),
  zip: yup
    .string()
    .when('$hasOptionalFields', (hasOptionalFields: boolean, schema: StringSchema) => {
      if (hasOptionalFields) {
        return schema.optional().nullable(true)
      }
      return schema
    }),
  recaptchaToken: yup.string().required('landing.captcha-warning-required'),
})

const OrderPageSummary = ({
  ticketType,
  hasTicketAmount,
  ticketAmount,
  handleTicketTypeRemove,
  handleMinusClick,
  handlePlusClick,
  setTicketAmount,
}: {
  ticketType: TicketType
  hasTicketAmount: boolean
  ticketAmount?: number
  handleTicketTypeRemove?: () => void
  handleMinusClick: () => void
  handlePlusClick: () => void
  setTicketAmount: (ticketAmount: number) => void
}) => {
  const { t } = useTranslation()
  const currencyFromCentsFormatter = useCurrencyFromCentsFormatter()

  return (
    <div className="rounded-lg bg-sunscreen">
      <div className="p-8">
        <div className="flex flex-row justify-between">
          <div className="font-semibold text-2xl">
            {hasTicketAmount && `${ticketAmount}× `}
            {ticketType.name}
          </div>
          {handleTicketTypeRemove && (
            <button onClick={handleTicketTypeRemove}>
              <Icon name="close" />
            </button>
          )}
        </div>
        {/* {ticketType.childrenAllowed && (
          <p className="mt-2 font-bold">
            {priceQuery.isFetching ? (
              <div style={{ maxWidth: '200px' }}>
                <Skeleton />
              </div>
            ) : (
              priceQuery.isSuccess && (
                <OrderPageAdultChildrenCount
                  pricing={priceQuery.data?.data.data.pricing}
                  watch={watch}
                ></OrderPageAdultChildrenCount>
              )
            )}
          </p>
        )} */}
        <p className="mt-4">{ticketType.description}</p>
        {ticketType.childrenAllowed && (
          <>
            <br />
            <p className="font-semibold">
              {/* TODO pluralizacia */}
              {t('buy-page.children-discount-children-count-and-price', {
                childrenMaxNumber: ticketType.childrenMaxNumber,
                childrenPrice: isDefined(ticketType.childrenPriceWithVat)
                  ? currencyFromCentsFormatter.format(ticketType.childrenPriceWithVat)
                  : null,
              })}
            </p>
            <p className="font-semibold">{t('buy-page.children-alert-last-chance')}</p>
          </>
        )}
      </div>
      <div className="flex bg-blueish px-4 lg:px-8 py-4 rounded-b-lg items-center flex justify-between">
        {hasTicketAmount && (
          <div className="border-primary border-solid rounded-lg border px-6 py-2 mr-8 text-primary shrink-0 flex items-center gap-x-2">
            <button
              className="leading-5 text-3xl align-top"
              onClick={handleMinusClick}
              type="button"
            >
              <Icon name={'minus'} />
            </button>
            {/* TODO this should be input field and use should be able to input the amount also add error as stated in figma */}
            <InputField
              value={ticketAmount}
              // TODO use onBlur instead of onChange to be able to remove input value entirely
              // now when using onBlur the value is not changed when the user clicks on the plus/minus button
              onChange={(event) => setTicketAmount(Number(event.target.value))}
              className="inline-flex w-18"
              textCenter
              inputWrapperClassName="lg:w-full"
            />
            <button
              className="leading-5 text-3xl align-top"
              onClick={handlePlusClick}
              type="button"
            >
              <Icon name={'plus'} />
            </button>
          </div>
        )}
        <div className="flex flex-nowrap">
          <span className="lg:text-xl text-fontBlack font-bold">
            <FormatCurrencyFromCents value={ticketType.priceWithVat} />
          </span>
          <span>{t('common.per-ticket')}</span>
        </div>
      </div>
    </div>
  )
}

// pricing.numberOfChildren is not available in response, keeping code for later when available

// const OrderPageAdultChildrenCount = ({
//   pricing,
//   watch,
// }: {
//   pricing: CheckPriceResponse['data']['pricing']
//   watch: UseFormWatch<OrderFormData>
// }) => {
//   const watchSelectedSwimmerIds = watch('selectedSwimmerIds') as (string | null)[]
//   const { t } = useTranslation()

//   // const adultCount = watchSelectedSwimmerIds.length - pricing.numberOfChildren
//   // const childrenCount = pricing.numberOfChildren

//   // const adult = adultCount > 0 ? t('buy-page.adult-count', { count: adultCount }) : null
//   // const children = childrenCount > 0 ? t('buy-page.children-count', { count: childrenCount }) : null

//   return <>({[adult, children].filter(Boolean).join(' + ')})</>
// }

const OrderPagePrice = ({ pricing }: { pricing: CheckPriceResponse['data']['pricing'] }) => {
  const fullPrice =
    pricing.discount > 0 ? (
      <div className="inline-block strikethrough-diagonal mr-2">
        <FormatCurrencyFromCents value={pricing.orderPriceWithVat + pricing.discount} />
      </div>
    ) : null
  const orderPrice = (
    <div className="inline-block">
      <FormatCurrencyFromCents value={pricing.orderPriceWithVat} />
    </div>
  )
  return (
    <>
      {fullPrice}
      {orderPrice}
    </>
  )
}

const OrderPage = () => {
  const { ticketTypesWithAdditionalProperties, orderData } = useOrderPageTicket()
  const [childrenConfirmationModalOpen, setChildrenConfirmationModalOpen] = useState(false)
  const [paymentMethodFunction, setPaymentMethodFunction] = useState<() => Promise<void>>()
  const [orderRequestPending, setOrderRequestPending] = useState(false)
  const order = useOrder()
  const { dispatchErrorToastForHttpRequest } = useErrorToast()
  const [captchaWarning, setCaptchaWarning] = useState<CaptchaWarningStatus>('loading')
  const { count: captchaKey, increment: incrementCaptchaKey } = useCounter(0)
  const { status } = useCityAccount()
  const { t } = useTranslation()
  const isClient = useIsClient()
  const currencyFromCentsFormatter = useCurrencyFromCentsFormatter()
  const { data: account } = useAccount()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<OrderFormData>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ticketTypesData: ticketTypesWithAdditionalProperties.map((ticketType) => ({
        ticketType: ticketType.ticketType,
        ...(ticketType.hasSwimmers ? { selectedSwimmerIds: [] } : {}),
        ...(ticketType.hasTicketAmount
          ? {
              ticketAmount:
                orderData.find(
                  (orderTicketType) => orderTicketType.ticketTypeId === ticketType.ticketType.id,
                )?.ticketAmount ?? 1,
            }
          : {}),
      })),
    },
    context: {
      requireEmail: ticketTypesWithAdditionalProperties.some(
        (ticketType) => ticketType.requireEmail,
      ),
      hasOptionalFields: ticketTypesWithAdditionalProperties.some(
        (ticketType) => ticketType.hasOptionalFields,
      ),
      hasSwimmers: ticketTypesWithAdditionalProperties.some((ticketType) => ticketType.hasSwimmers),
      hasTicketAmount: ticketTypesWithAdditionalProperties.some(
        (ticketType) => ticketType.hasTicketAmount,
      ),
      isSeniorOrDisabledTicket: ticketTypesWithAdditionalProperties.some(
        (ticketType) => ticketType.isSeniorOrDisabledTicket,
      ),
    },
  })
  const ticketTypesData = watch('ticketTypesData')

  const selectedSwimmerIds = watch('ticketTypesData')
    .map((ticketTypeData) => ticketTypeData.selectedSwimmerIds)
    .flat()

  const errorAgreementInterpreted = useValidationSchemaTranslationIfPresent(
    errors.agreement?.message,
  )
  const errorSeniorAgreementInterpreted = useValidationSchemaTranslationIfPresent(
    errors.seniorOrDisabledAgreement?.message,
  )

  const watchPriceChange = useWatch({
    // Those properties are those who trigger possible change of the price.
    name: ['ticketTypesData', 'discountCode'],
    control,
  })

  const getRequestsFromFormData = useCallback(
    () =>
      orderFormToRequests({
        ...getValues(),
        ticketTypesData: getValues().ticketTypesData.map((ticketTypeData) => {
          const { requireEmail, hasOptionalFields, hasSwimmers, hasTicketAmount } =
            ticketTypesWithAdditionalProperties.find(
              (ticketType) => ticketType.ticketType.id === ticketTypeData.ticketType.id,
            )!
          return {
            ...ticketTypeData,
            requireEmail,
            hasOptionalFields,
            hasSwimmers,
            hasTicketAmount,
          }
        }),
      }),
    [getValues, ticketTypesWithAdditionalProperties],
  )

  const priceQuery = useQuery(
    ['orderPrice', ticketTypesData],
    ({ signal }) => {
      const { getPriceRequest } = getRequestsFromFormData()

      return getPrice(getPriceRequest, status, signal)
    },
    {
      onError: (err) => {
        // TODO errors everywhere, refactor
        dispatchErrorToastForHttpRequest(err as AxiosError<ErrorWithMessages>)
      },
      enabled: getRequestsFromFormData().getPriceRequest.tickets.length > 0,
      retry: false,
    },
  )

  const queryClient = useQueryClient()

  useEffect(() => {
    // same as enabled condition of price query
    if (getRequestsFromFormData().getPriceRequest.tickets.length > 0) {
      // If the price should change, cancel current queries and fetch a new price.
      queryClient.refetchQueries([['orderPrice', ticketTypesData]])
    }
  }, [watchPriceChange, account, ticketTypesData])

  useTimeout(() => {
    if (!isClient || captchaWarning === 'hide') return
    setCaptchaWarning('show')
  }, 10000)

  const onSubmit = async (paymentMethod: PaymentMethod) => {
    incrementCaptchaKey()
    const { orderRequest } = getRequestsFromFormData()
    setOrderRequestPending(true)
    await order(orderRequest, paymentMethod)
    setOrderRequestPending(false)
  }

  // photo and age is required for every selected swimmer, so when main swimmer isn't selected we should not prompt user to fill those attributes and
  // we should not block the form when main swimmer, marked as 'null', isn't selected and those attributes is missing
  const shouldSendDisabled =
    ticketTypesWithAdditionalProperties.some((ticketType) => ticketType.sendDisabled) &&
    selectedSwimmerIds.includes(null)

  const renderPayButton = (paymentMethod: PaymentMethod) => {
    let text
    let icon
    let color: 'black' | 'white-outlined' | 'primary' = 'primary'

    switch (paymentMethod) {
      case PaymentMethod.APAY:
        color = 'black'
        break
      case PaymentMethod.GPAY:
        color = 'white-outlined'
        break
      case PaymentMethod.CARD:
        color = 'primary'
        break
    }
    switch (paymentMethod) {
      case PaymentMethod.APAY:
        icon = (
          <Icon
            name="apple-pay"
            className="no-fill flex items-center justify-center rounded p-1 bg-black h-6 w-6"
          ></Icon>
        )
        break
      case PaymentMethod.GPAY:
        icon = (
          <Icon
            name="google-pay"
            className="no-fill flex items-center justify-center rounded p-1 bg-white h-6 w-6"
          ></Icon>
        )
        break
      case PaymentMethod.CARD:
        icon = (
          <Icon
            className="flex items-center justify-center rounded p-1 h-6 w-6"
            name="credit-card"
          />
        )
        break
      default:
        icon = (
          <Icon
            className="flex items-center justify-center rounded p-1 h-6 w-6"
            name="credit-card"
          />
        )
        break
    }
    switch (paymentMethod) {
      case PaymentMethod.APAY:
        text = t('buy-page.pay-with-apple-pay')
        break
      case PaymentMethod.GPAY:
        text = t('buy-page.pay-with-google-pay')
        break
      case PaymentMethod.CARD:
        text = priceQuery.data?.data.data.pricing.orderPriceWithVat
          ? t('buy-page.pay-with-price', {
              price: currencyFromCentsFormatter.format(
                priceQuery.data.data.data.pricing.orderPriceWithVat,
              ),
            })
          : t('buy-page.pay')
        break
      default:
        text = priceQuery.data?.data.data.pricing.orderPriceWithVat
          ? t('buy-page.pay-with-price', {
              price: currencyFromCentsFormatter.format(
                priceQuery.data.data.data.pricing.orderPriceWithVat,
              ),
            })
          : t('buy-page.pay')
        break
    }

    const handleSubmitWithErrorHandling = handleSubmit(
      () => onSubmit(paymentMethod),
      (err) => {
        logger.error(err)
      },
    )

    return (
      <PayButton
        onSubmit={() => {
          if (
            ticketTypesData.some(
              (ticketTypeData) =>
                ticketTypeData.ticketType.type === 'SEASONAL' &&
                ticketTypeData.ticketType.childrenAllowed,
            )
          ) {
            setChildrenConfirmationModalOpen(true)
            setPaymentMethodFunction(() => handleSubmitWithErrorHandling)
          } else {
            handleSubmitWithErrorHandling()
          }
        }}
        color={color}
        icon={icon}
        text={text}
        disabled={
          priceQuery.isFetching ||
          priceQuery.isError ||
          shouldSendDisabled ||
          orderRequestPending ||
          getRequestsFromFormData().orderRequest.tickets.length === 0
        }
      />
    )
  }

  const setTicketAmountOfTicketType = (ticketAmount: number, cartItem: CartItem) => {
    const cumulativeTicketAmount = ticketTypesData
      .filter((ticketTypeData) => ticketTypeData.ticketType.id !== cartItem.ticketType.id)
      .reduce((acc, curr) => acc + (curr.ticketAmount ?? 0), 0)
    if (cumulativeTicketAmount + ticketAmount > environment.maxTicketPurchaseLimit) {
      return
    }
    // TODO this "ticketAmount > 0" prevents it from going to 0 when manually inputing value
    if (ticketAmount > 0) {
      setValue(
        'ticketTypesData',
        ticketTypesData.map((ticketTypeDataInner) =>
          ticketTypeDataInner.ticketType.id === cartItem.ticketType.id
            ? { ...ticketTypeDataInner, ticketAmount }
            : ticketTypeDataInner,
        ),
      )
    }
  }

  const Divider = () => {
    return <div className="border-b-solid border-b-2 my-6" />
  }

  return (
    <>
      {childrenConfirmationModalOpen && (
        <ChildrenConfirmationModal
          onClose={() => {
            setChildrenConfirmationModalOpen(false)
          }}
          onSaveSuccess={() => {
            setChildrenConfirmationModalOpen(false)
            if (paymentMethodFunction) {
              paymentMethodFunction()
            }
          }}
        />
      )}
      <form className="container mx-auto py-6 grid grid-cols-1 md:grid-cols-2 md:gap-x-12">
        <div className="gap-y-6 flex flex-col">
          <div className="text-2xl md:text-3xl font-semibold">{t('buy-page.personal-info')}</div>
          <div className="p-6 border border-gray rounded-lg">
            <OrderPageEmail register={register} errors={errors} />
            {ticketTypesWithAdditionalProperties.some(
              (ticketType) => ticketType.hasOptionalFields,
            ) && <OrderPageOptionalFields register={register} errors={errors} />}
            {ticketTypesWithAdditionalProperties.some((ticketType) => ticketType.hasSwimmers) && (
              <>
                <div className="mt-2">
                  {ticketTypesData.some(
                    (ticketTypeData) => ticketTypeData.ticketType.type === 'SEASONAL',
                  ) && (
                    <Trans
                      i18nKey={'buy-page.select-people-reminder-seasonal'}
                      components={{ span: <span /> }}
                    />
                  )}
                  {ticketTypesData.some(
                    (ticketTypeData) => ticketTypeData.ticketType.type === 'ENTRIES',
                  ) && (
                    <Trans
                      i18nKey={'buy-page.select-people-reminder-entries'}
                      components={{ span: <span /> }}
                    />
                  )}
                </div>
                {/* TODO errors everywhere, refactor */}
                {priceQuery.error && (
                  <div className="flex py-4 px-5 bg-[#FCF2E6] rounded-lg gap-x-3 my-6">
                    <Icon name="warning" className="no-fill text-[#E07B04]"></Icon>
                    <div>
                      {getErrorMessagesFromHttpRequest(
                        // TODO check if we show correct errors in all cases
                        // (zod schema error - probably not, joi schema error, manually thrown error)
                        priceQuery.error as AxiosError<ErrorWithMessages>,
                      )}
                    </div>
                  </div>
                )}
                {ticketTypesData.some((ticketTypeData) => ticketTypeData.ticketType.nameRequired) &&
                  getRequestsFromFormData().getPriceRequest.tickets.length < 1 && (
                    <div className="flex py-4 px-5 bg-[#FCF2E6] rounded-lg gap-x-3 my-6">
                      <Icon name="warning" className="no-fill text-[#E07B04]"></Icon>
                      <div>{t('buy-page.min-one-person')}</div>
                    </div>
                  )}
                <OrderPagePeopleList
                  watch={watch}
                  setValue={setValue}
                  errors={errors}
                ></OrderPagePeopleList>
              </>
            )}

            <Divider />

            <CheckboxField
              register={register}
              name="agreement"
              error={errorAgreementInterpreted}
              label={
                <span>
                  {t('buy-page.vop')}
                  <Link to={ROUTES.VOP} target="_blank" className="link text-primary">
                    {t('buy-page.vop-link')}
                  </Link>
                  {/* TODO: hardcoded text will be will be fixed in other PR */}. Kúpou lístka alebo
                  permanentky výslovne potvrdzujem, že som sa oboznámil s{' '}
                  <Link to={ROUTES.GDPR} target="_blank" className="link text-primary ">
                    podmienkami spracúvania osobných údajov
                  </Link>
                  .
                </span>
              }
            />
            {ticketTypesWithAdditionalProperties.some(
              (ticketType) => ticketType.isSeniorOrDisabledTicket,
            ) && (
              <>
                <CheckboxField
                  className="my-4"
                  register={register}
                  name="seniorOrDisabledAgreement"
                  error={errorSeniorAgreementInterpreted}
                  label={
                    <span>
                      Potvrdzujem, že všetky dospelé osoby v nákupnom košíku majú 65 a viac rokov
                      alebo sú držitelia ŤZP / ŤZP-S preukazu.
                    </span>
                  }
                />
                <div className="flex flex-col gap-2 italic">
                  <span>
                    Kúpou lístka súhlasíte s podmienkou preukázania sa preukazom ŤZP / ŤZP-S alebo
                    dokladom totožnosti pri vstupe na kúpalisko.
                  </span>
                </div>
              </>
            )}

            <Divider />

            <OrderPageDiscountCode
              setCaptchaWarning={setCaptchaWarning}
              setValue={setValue}
              getValues={getValues}
              incrementCaptchaKey={incrementCaptchaKey}
              errors={errors}
              captchaWarning={captchaWarning}
            />
          </div>
          <div>
            <Controller
              name="recaptchaToken"
              control={control}
              render={({ field: { onChange } }) => (
                <>
                  <Turnstile
                    theme="light"
                    key={captchaKey}
                    refreshExpired={'auto'}
                    sitekey={environment.turnstileSiteKey ?? ''}
                    onVerify={(token) => {
                      setCaptchaWarning('hide')
                      onChange(token)
                    }}
                    onError={(error) => {
                      // logger.error("Turnstile error:", error);
                      setCaptchaWarning('show')
                      return onChange(null)
                    }}
                    onTimeout={() => {
                      // logger.error("Turnstile timeout");
                      setCaptchaWarning('show')
                      onChange(null)
                    }}
                    onExpire={() => {
                      // logger.warn("Turnstile expire - should refresh automatically");
                      onChange(null)
                    }}
                    className="self-center flex justify-center"
                  />
                  {errors.recaptchaToken && (
                    <p className="text-p3 mt-1 text-error">
                      {t('landing.captcha-warning-required')}
                    </p>
                  )}
                  {captchaWarning === 'show' && (
                    <p className="text-p3 mt-1 text-error">{t('landing.captcha-not-verified')}</p>
                  )}
                </>
              )}
            />
          </div>
          <div>
            {/* Desktop */}
            <div className="hidden lg:flex flex-col gap-y-3">
              <div className="flex flex-row gap-x-3">
                <div className="w-full">{renderPayButton(PaymentMethod.APAY)}</div>
                <div className="w-full">{renderPayButton(PaymentMethod.GPAY)}</div>
              </div>
              <div className="w-full">{renderPayButton(PaymentMethod.CARD)}</div>
            </div>
            {/* Mobile */}
            <div className="lg:hidden">
              <div className="hidden md:block w-3/4">{renderPayButton(PaymentMethod.APAY)}</div>
              <div className="hidden md:block mt-3 w-3/4">
                {renderPayButton(PaymentMethod.GPAY)}
              </div>
              <div className="hidden md:block mt-3 w-3/4">
                {renderPayButton(PaymentMethod.CARD)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-4 lg:gap-y-6">
          <span className="text-2xl md:text-3xl font-semibold">{t('buy-page.summary')}</span>
          {ticketTypesData.map((ticketTypeData) => {
            const ticketAmount = ticketTypeData.ticketAmount

            const handleMinusClick = () => {
              if (!ticketAmount) {
                return
              }
              setTicketAmountOfTicketType(ticketAmount - 1, ticketTypeData)
            }
            const handlePlusClick = () => {
              if (!ticketAmount) {
                return
              }
              setTicketAmountOfTicketType(ticketAmount + 1, ticketTypeData)
            }

            const handleTicketTypeRemove =
              ticketTypesData.length > 1
                ? () => {
                    // this will remove the ticket type from the form data
                    // but it will reappear after reloading the page because it ultimately comes from location state
                    // TODO fix this when cart is implemented using redux
                    setValue(
                      'ticketTypesData',
                      ticketTypesData.filter(
                        (ticketTypeDataInner) =>
                          ticketTypeDataInner.ticketType.id !== ticketTypeData.ticketType.id,
                      ),
                    )
                  }
                : undefined

            return (
              // TODO rename to TicketTypeSummary
              <OrderPageSummary
                key={ticketTypeData.ticketType.id}
                ticketAmount={ticketAmount}
                ticketType={ticketTypeData.ticketType}
                hasTicketAmount={
                  ticketTypesWithAdditionalProperties.find(
                    (ticketType) => ticketType.ticketType.id === ticketTypeData.ticketType.id,
                  )?.hasTicketAmount ?? false
                }
                handleMinusClick={handleMinusClick}
                handlePlusClick={handlePlusClick}
                handleTicketTypeRemove={handleTicketTypeRemove}
                setTicketAmount={(ticketAmount: number) =>
                  setTicketAmountOfTicketType(ticketAmount, ticketTypeData)
                }
              />
            )
          })}
          <div className="px-4 lg:px-8 py-4 bg-blueish flex flex-row lg:items-center rounded-lg border-divider text-fontBlack">
            <span className="grow font-semibold">{t('price-total')}</span>
            <div className="flex items-center justify-between gap-x-6">
              <span className="lg:w-[115px] lg:text-right grow font-semibold lg:text-xl">
                <SkeletonTheme
                  baseColor="#a8dbf2"
                  highlightColor="#58bbe6"
                  duration={1}
                  width={40}
                  height={28}
                >
                  {priceQuery.isFetching ? (
                    <Skeleton />
                  ) : (
                    priceQuery.isSuccess && (
                      <OrderPagePrice pricing={priceQuery.data?.data.data.pricing} />
                    )
                  )}
                </SkeletonTheme>
              </span>
            </div>
          </div>
          <div className="text-gray color-fontBlack">
            {!ticketTypesWithAdditionalProperties.some((ticketType) => ticketType.hasSwimmers) && (
              <p className="mb-2">
                {t('common.max-ticket-purchase-limit', {
                  maxTicketPurchaseLimit: environment.maxTicketPurchaseLimit,
                })}
              </p>
            )}
            <p>{t('common.additional-info-toddlers')}</p>
          </div>
        </div>
        <div className="mt-6 md:mt-8">
          <div className="block md:hidden flex justify-center">
            {renderPayButton(PaymentMethod.APAY)}
          </div>
          <div className="block md:hidden flex justify-center mt-3">
            {renderPayButton(PaymentMethod.GPAY)}
          </div>
          <div className="block md:hidden flex justify-center mt-3">
            {renderPayButton(PaymentMethod.CARD)}
          </div>
        </div>
      </form>
    </>
  )
}

export interface OrderFormData {
  email?: string
  ticketTypesData: {
    ticketType: TicketType
    ticketAmount?: number
    selectedSwimmerIds?: (string | null)[]
  }[]
  discountCode?: DiscountCodeResponse['discountCode'] | null
  agreement?: string
  seniorOrDisabledAgreement?: boolean
  age?: number
  zip?: string
  recaptchaToken?: string
}

type CartItem = {
  ticketType: TicketType
  ticketAmount?: number
  selectedSwimmerIds?: (string | null)[]
}

export default OrderPage
