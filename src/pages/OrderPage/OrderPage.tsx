import './OrderPage.css'

import { yupResolver } from '@hookform/resolvers/yup'
import to from 'await-to-js'
import { AxiosError, AxiosResponse } from 'axios'
import { ROUTES } from 'helpers/constants'
import {
  ErrorWithMessages,
  getErrorMessagesFromHttpRequest,
  useValidationSchemaTranslationIfPresent,
} from 'helpers/general'
import logger from 'helpers/logger'
import { PaymentMethod } from 'helpers/types'
import { useAccount } from 'hooks/useAccount'
import useCityAccount from 'hooks/useCityAccount'
import DesktopPaymentButtons from 'pages/OrderPage/DesktopPaymentButtons'
import EmailField from 'pages/OrderPage/EmailField'
import MobilePaymentButtons from 'pages/OrderPage/MobilePaymentButtons'
import OptionalFields from 'pages/OrderPage/OptionalFields'
import SwimmersList from 'pages/OrderPage/SwimmersList'
import TicketTypesDetail from 'pages/OrderPage/TicketTypesDetail'
import { ChangeEvent, useCallback, useState } from 'react'
import {
  Controller,
  FieldErrors,
  useForm,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useQuery } from 'react-query'
import { Link } from 'react-router'
import Turnstile from 'react-turnstile'
import { useCounter, useIsClient, useIsMounted, useTimeout } from 'usehooks-ts'
import * as yup from 'yup'
import { BooleanSchema, NumberSchema, StringSchema } from 'yup'

import { Button, CheckboxField, Icon, InputField } from '../../components'
import ChildrenConfirmationModal from '../../components/ChildrenConfirmationModal/ChildrenConfirmationModal'
import { environment } from '../../environment'
import { FormatCurrencyFromCents } from '../../helpers/currencyFormatter'
import { useErrorToast } from '../../hooks/useErrorToast'
import { CartItem, GetPriceResponse } from '../../models'
import { checkDiscountCode, DiscountCodeResponse, getPrice } from '../../store/order/api'
import { orderFormToRequests } from './formDataToRequests'
import { useOrder } from './useOrder'
import { useOrderPageTicket } from './useOrderPageTicket'

type CaptchaWarningStatus = 'loading' | 'show' | 'hide'

export interface OrderFormData {
  email?: string
  ticketTypesData: CartItem[]
  discountCode?: DiscountCodeResponse['discountCode'] | null
  agreement?: string
  seniorOrDisabledAgreement?: boolean
  age?: number
  zip?: string
  recaptchaToken?: string
}

/**
 * Figma: https://www.figma.com/design/7ZleKHCPWbiQKjCV9nU7PW/Starz---Dizajn-2024?node-id=2008-14092
 */

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
    <div className="flex flex-col gap-y-6">
      <CheckboxField
        valueOfInput={useDiscountCode}
        onChange={handleUseDiscountCodeChange}
        label={t('buy-page.claim-code')}
      />
      {useDiscountCode && (
        <OrderPageDiscountCodeInput
          captchaWarning={captchaWarning}
          setCaptchaWarning={setCaptchaWarning}
          setValue={setValue}
          getValues={getValues}
          incrementCaptchaKey={incrementCaptchaKey}
          errors={errors}
        />
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
      <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-y-0">
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

const OrderPagePrice = ({ pricing }: { pricing: GetPriceResponse['data']['pricing'] }) => {
  const fullPrice =
    pricing.discount > 0 ? (
      <div className="strikethrough-diagonal mr-2 inline-block">
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

  // TODO The t function should be used individually on each key
  const errorAgreementInterpreted = useValidationSchemaTranslationIfPresent(
    errors.agreement?.message,
  )
  // TODO The t function should be used individually on each key
  const errorSeniorAgreementInterpreted = useValidationSchemaTranslationIfPresent(
    errors.seniorOrDisabledAgreement?.message,
  )

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

  const withinMaxTicketAmountLimit =
    getRequestsFromFormData().getPriceRequest.tickets.length <= environment.maxTicketPurchaseLimit

  const purchaseAmountInLimit =
    getRequestsFromFormData().getPriceRequest.tickets.length > 0 && withinMaxTicketAmountLimit

  const priceQuery = useQuery(
    ['orderPrice', ticketTypesData, purchaseAmountInLimit],
    async ({ signal }) => {
      const { getPriceRequest } = getRequestsFromFormData()
      logger.info(getPriceRequest)

      return getPrice(getPriceRequest, status, signal)
    },
    {
      onError: (err) => {
        // TODO errors everywhere, refactor
        logger.error(`OrderPage "getPrice" Request error: ${err}`)

        dispatchErrorToastForHttpRequest(err as AxiosError<ErrorWithMessages>)
      },
      enabled: purchaseAmountInLimit,
      retry: false,
    },
  )

  useTimeout(() => {
    if (!isClient || captchaWarning === 'hide') {
      return
    }
    setCaptchaWarning('show')
  }, 10000)

  const onSubmit = async (paymentMethod: PaymentMethod) => {
    incrementCaptchaKey()
    const { orderRequest } = getRequestsFromFormData()
    setOrderRequestPending(true)
    logger.info(orderRequest)
    await order(orderRequest, paymentMethod)
    setOrderRequestPending(false)
  }

  // photo and age is required for every selected swimmer, so when main swimmer isn't selected we should not prompt user to fill those attributes and
  // we should not block the form when main swimmer, marked as 'null', isn't selected and those attributes is missing
  const shouldSendDisabled =
    ticketTypesWithAdditionalProperties.some((ticketType) => ticketType.sendDisabled) &&
    selectedSwimmerIds.includes(null)

  const watchSelectedSwimmerIds = watch('ticketTypesData')
    .map((formValueTicketTypeData) => formValueTicketTypeData.selectedSwimmerIds)
    .flat() as (string | null)[]

  const childrenCount = priceQuery.data?.data.data.pricing.numberOfChildren

  const handleSubmitWithErrorHandling = (paymentMethod: PaymentMethod) =>
    handleSubmit(
      async () => onSubmit(paymentMethod),
      (err) => {
        logger.error('OrderPage "order" validation failed', err)
      },
    )

  const onSubmitInner = async (paymentMethod: PaymentMethod) => {
    if (
      ticketTypesData.some(
        (ticketTypeData) =>
          ticketTypeData.ticketType.type === 'SEASONAL' &&
          ticketTypeData.ticketType.childrenAllowed,
      )
    ) {
      setChildrenConfirmationModalOpen(true)
      setPaymentMethodFunction(() => handleSubmitWithErrorHandling(paymentMethod))
    } else {
      await handleSubmitWithErrorHandling(paymentMethod)()
    }
  }

  const price = priceQuery.data?.data.data.pricing.orderPriceWithVat

  const isDisabled =
    priceQuery.isFetching ||
    priceQuery.isError ||
    shouldSendDisabled ||
    orderRequestPending ||
    !purchaseAmountInLimit

  const setTicketAmountOfTicketType = (ticketAmount: number, cartItem: CartItem) => {
    setValue(
      'ticketTypesData',
      ticketTypesData.map((ticketTypeDataInner) =>
        ticketTypeDataInner.ticketType.id === cartItem.ticketType.id
          ? { ...ticketTypeDataInner, ticketAmount }
          : ticketTypeDataInner,
      ),
    )
  }

  const displayMissingInformationWarning = ticketTypesWithAdditionalProperties.some(
    (ticketType) => ticketType.displayMissingInformationWarning,
  )

  const Divider = () => {
    return <div className="border-b-solid my-6 border-b-2" />
  }

  return (
    <>
      {childrenConfirmationModalOpen && (
        <ChildrenConfirmationModal
          onClose={() => {
            setChildrenConfirmationModalOpen(false)
          }}
          onSaveSuccess={async () => {
            setChildrenConfirmationModalOpen(false)
            if (paymentMethodFunction) {
              await paymentMethodFunction()
            }
          }}
        />
      )}
      <form className="container mx-auto grid grid-cols-1 py-6 md:grid-cols-2 md:gap-x-12">
        <div className="flex flex-col gap-y-6">
          <div className="text-2xl font-semibold md:text-3xl">{t('buy-page.personal-info')}</div>
          <div className="border-gray rounded-lg border p-6">
            <EmailField
              register={register}
              required={ticketTypesWithAdditionalProperties.some(
                (ticketType) => ticketType.requireEmail,
              )}
              email={account?.email}
              errorMessage={useValidationSchemaTranslationIfPresent(errors.email?.message)}
            />
            {ticketTypesWithAdditionalProperties.some(
              (ticketType) => ticketType.hasOptionalFields,
            ) && (
              <OptionalFields
                register={register}
                errorMessageZip={errors.zip?.message}
                errorMessageAge={errors.age?.message}
              />
            )}
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
                  <div className="my-6 flex gap-x-3 rounded-lg bg-[#FCF2E6] px-5 py-4">
                    <Icon name="warning" className="no-fill text-[#E07B04]" />
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
                    <div className="my-6 flex gap-x-3 rounded-lg bg-[#FCF2E6] px-5 py-4">
                      <Icon name="warning" className="no-fill text-[#E07B04]" />
                      <div>{t('buy-page.min-one-person')}</div>
                    </div>
                  )}
                <SwimmersList
                  setValue={setValue}
                  ticketTypesData={ticketTypesData}
                  displayMissingInformationWarning={displayMissingInformationWarning}
                  ticketTypesWithAdditionalProperties={ticketTypesWithAdditionalProperties}
                  errorsTicketTypeData={errors.ticketTypesData}
                />
              </>
            )}

            <Divider />

            <CheckboxField
              register={register}
              name="agreement"
              error={errorAgreementInterpreted}
              label={
                <span>
                  <Trans
                    i18nKey="buy-page.agreements"
                    components={{
                      VopLink: (
                        <Link to={ROUTES.VOP} target="_blank" className="link text-primary" />
                      ),
                      GdprLink: (
                        <Link to={ROUTES.GDPR} target="_blank" className="link text-primary" />
                      ),
                    }}
                  />
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
                  label={<span>{t('buy-page.senior-disabled-agreement')}</span>}
                />
                <div className="flex flex-col gap-2 italic">
                  <span>{t('buy-page.senior-disabled-note')}</span>
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
                    className="flex justify-center self-center"
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
            <div className="hidden flex-col gap-y-3 md:flex">
              <DesktopPaymentButtons
                isDisabled={isDisabled}
                onSubmit={onSubmitInner}
                price={price}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-4 lg:gap-y-6">
          <span className="text-2xl font-semibold md:text-3xl">{t('buy-page.summary')}</span>
          <TicketTypesDetail
            ticketTypesData={ticketTypesData}
            priceQuery={priceQuery}
            ticketTypesWithAdditionalProperties={ticketTypesWithAdditionalProperties}
            adultCount={childrenCount ? watchSelectedSwimmerIds.length - childrenCount : undefined}
            childrenCount={priceQuery.data?.data.data.pricing.numberOfChildren}
            setValue={setValue}
            setTicketAmountOfTicketType={setTicketAmountOfTicketType}
          />
          {!withinMaxTicketAmountLimit && (
            <div className="flex gap-x-3 rounded-lg bg-[#FAE5E5] px-5 py-4">
              <Icon name="alert" className="no-fill text-error" />
              {t('common.max-ticket-purchase-limit', {
                maxTicketPurchaseLimit: environment.maxTicketPurchaseLimit,
              })}
            </div>
          )}
          <div className="flex flex-row rounded-lg border-divider bg-blueish p-4 text-fontBlack lg:items-center lg:px-8">
            <span className="grow font-semibold">{t('price-total')}</span>
            <div className="flex items-center justify-between gap-x-6">
              <span className="grow font-semibold lg:w-[115px] lg:text-right lg:text-xl">
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
            <p>{t('common.additional-info-toddlers')}</p>
          </div>
        </div>
        {/* Mobile */}
        <div className="mt-6 md:mt-8 md:hidden">
          <MobilePaymentButtons isDisabled={isDisabled} onSubmit={onSubmitInner} price={price} />
        </div>
      </form>
    </>
  )
}

export default OrderPage
