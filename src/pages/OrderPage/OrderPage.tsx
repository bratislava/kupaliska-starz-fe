import './OrderPage.css'

import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'
import { ErrorWithMessages, useValidationSchemaTranslationIfPresent } from 'helpers/general'
import logger from 'helpers/logger'
import { PaymentMethod } from 'helpers/types'
import { useAccount } from 'hooks/useAccount'
import useCityAccount from 'hooks/useCityAccount'
import Agreements from 'pages/OrderPage/Agreements'
import DesktopPaymentButtons from 'pages/OrderPage/DesktopPaymentButtons'
import DiscountCode from 'pages/OrderPage/DiscountCode'
import EmailField from 'pages/OrderPage/EmailField'
import MobilePaymentButtons from 'pages/OrderPage/MobilePaymentButtons'
import OptionalFields from 'pages/OrderPage/OptionalFields'
import Price from 'pages/OrderPage/Price'
import SwimmersSelection from 'pages/OrderPage/SwimmersSelection'
import TicketTypesDetail from 'pages/OrderPage/TicketTypesDetail'
import { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useQuery } from 'react-query'
import Turnstile from 'react-turnstile'
import { useCounter, useIsClient, useTimeout } from 'usehooks-ts'
import * as yup from 'yup'
import { BooleanSchema, NumberSchema, StringSchema } from 'yup'

import { Icon } from '../../components'
import ChildrenConfirmationModal from '../../components/ChildrenConfirmationModal/ChildrenConfirmationModal'
import { environment } from '../../environment'
import { useErrorToast } from '../../hooks/useErrorToast'
import { CartItem } from '../../models'
import { DiscountCodeResponse, getPrice } from '../../store/order/api'
import { orderFormToRequests } from './formDataToRequests'
import { useOrder } from './useOrder'
import { useOrderPageTicket } from './useOrderPageTicket'

export type CaptchaWarningStatus = 'loading' | 'show' | 'hide'

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

  // TODO this should go into schema
  const withinMaxTicketAmountLimit =
    getRequestsFromFormData().getPriceRequest.tickets.length <= environment.maxTicketPurchaseLimit

  // TODO this should go into schema
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
              <SwimmersSelection
                setValue={setValue}
                ticketTypesData={ticketTypesData}
                getRequestsFromFormData={getRequestsFromFormData}
                ticketTypesWithAdditionalProperties={ticketTypesWithAdditionalProperties}
                errorsPriceQuery={priceQuery.error}
                displayMissingInformationWarning={displayMissingInformationWarning}
                errorsTicketTypeData={errors.ticketTypesData}
              />
            )}

            <Divider />

            <Agreements
              isSeniorOrDisabledTicket={ticketTypesWithAdditionalProperties.some(
                (ticketType) => ticketType.isSeniorOrDisabledTicket,
              )}
              register={register}
              errorAgreementInterpreted={errorAgreementInterpreted}
              errorSeniorAgreementInterpreted={errorSeniorAgreementInterpreted}
            />

            <Divider />

            <DiscountCode
              setValue={setValue}
              incrementCaptchaKey={incrementCaptchaKey}
              setCaptchaWarning={setCaptchaWarning}
              captchaWarning={captchaWarning}
              recaptchaTokenError={errors.recaptchaToken}
              discountCodeValue={getValues('discountCode')}
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
                    priceQuery.isSuccess && <Price pricing={priceQuery.data.data.data.pricing} />
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
