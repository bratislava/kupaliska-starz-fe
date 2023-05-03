import React, { ChangeEvent, PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react'
import { Button, CheckboxField, Icon, InputField, Tooltip } from '../../components'
import { useWindowSize } from '../../hooks'
import cx from 'classnames'
import { AssociatedSwimmer, fetchAssociatedSwimmers } from '../../store/associatedSwimmers/api'
import { QueryObserverResult, useQuery, useQueryClient } from 'react-query'
import { ErrorWithMessages, useErrorToast } from '../../hooks/useErrorToast'
import { useOrderTicket } from './useOrderTicket'
import { Trans, useTranslation } from 'react-i18next'
import { useAccount } from '@azure/msal-react'
import { CheckPriceResponse, Ticket } from '../../models'
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
import { NumberSchema, StringSchema } from 'yup'
import { useIsMounted } from 'usehooks-ts'
import { fetchUser } from '../../store/user/api'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import './OrderPage.css'
import { Link, useHistory } from 'react-router-dom'
import { useOrder } from './useOrder'
import { orderFormToRequests } from './formDataToRequests'
import { UseFormRegister } from 'react-hook-form/dist/types/form'
import { environment } from '../../environment'
import { useValidationSchemaTranslationIfPresent } from 'helpers/general'
import { Button as AriaButton, Checkbox } from 'react-aria-components'
import AssociatedSwimmerEditAddModal from '../../components/AssociatedSwimmerEditAddModal/AssociatedSwimmerEditAddModal'
import Turnstile from 'react-turnstile'

const NumberedLayoutIndexCounter = ({ index }: { index: number }) => {
  return (
    <div className="bg-blueish rounded-full text-primary font-semibold text-4xl w-12 shrink-0 h-12 grid place-content-center">
      {index}
    </div>
  )
}

const NumberedLayoutLine = ({ className }: { className?: string }) => (
  <div className={cx('border border-fontBlack opacity-10 grow h-0 w-full', className)}></div>
)

/* Creates this effect https://imgur.com/TLn9kOW */
const NumberedLayout = ({
  children,
  index,
  first = false,
}: PropsWithChildren<{ index: number; first?: boolean }>) => {
  const { width } = useWindowSize()
  const absoluteDiv = useRef<any>()
  const [showIndexOutside, setShowIndexOutside] = useState<boolean>(true)
  useEffect(() => {
    const left = absoluteDiv.current.getBoundingClientRect().left
    setShowIndexOutside(left >= 20)
  }, [width])

  return (
    <>
      {!first && showIndexOutside && <NumberedLayoutLine className="my-5"></NumberedLayoutLine>}
      <div className="relative">
        <div
          style={{ left: '-88px' }}
          ref={absoluteDiv}
          className={cx('absolute', { invisible: !showIndexOutside })}
        >
          <NumberedLayoutIndexCounter index={index}></NumberedLayoutIndexCounter>
        </div>

        <div
          className={cx('flex items-center', {
            hidden: showIndexOutside,
            'mt-4': !first,
          })}
        >
          <div>
            <NumberedLayoutIndexCounter index={index}></NumberedLayoutIndexCounter>
          </div>
          <NumberedLayoutLine className="ml-4"></NumberedLayoutLine>
        </div>
        <div className="p-3">{children}</div>
      </div>
    </>
  )
}

const OrderPageEmail = ({
  requireEmail,
  register,
  errors,
}: {
  requireEmail: boolean
  register: UseFormRegister<OrderFormData>
  errors: FieldErrors<OrderFormData>
}) => {
  const { t } = useTranslation()
  const account = useAccount()

  let errorInterpreted = useValidationSchemaTranslationIfPresent(errors.email?.message)

  return requireEmail ? (
    <InputField
      className="mt-6 max-w-formMax"
      name="email"
      register={register}
      label={<span className="text-base">{t('common.email')}</span>}
      error={errorInterpreted}
    />
  ) : (
    <Trans
      i18nKey={'buy-page.email-send-to'}
      components={{ span: <span /> }}
      values={{ username: account?.username }}
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
      <label className="font-medium text-fontBlack text-base flex items-center mt-6">
        {t('buy-page.optional')}
        <div data-for="tooltip-customer-form" data-tip={t('buy-page.help-us')}>
          <Icon className="ml-4" name="question-mark" color="blueish" />
        </div>
      </label>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <InputField
          className="col-span-2 lg:col-span-1 mt-6 max-w-formMax"
          name="age"
          register={register}
          placeholder={t('buy-page.age')}
          error={errors.age?.message}
          type="number"
          valueAsNumber={true}
        />
        <InputField
          className="col-span-2 lg:col-span-1 mt-6 max-w-formMax"
          name="zip"
          register={register}
          placeholder={t('buy-page.zip')}
          error={errors.zip?.message}
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
  const [addSwimmerModalOpen, setAddSwimmerModalOpen] = useState(false)
  const selectedSwimmerIds = watch('selectedSwimmerIds') as (string | null)[]

  const associatedSwimmersQuery = useQuery('associatedSwimmers', fetchAssociatedSwimmers)
  const userQuery = useQuery('user', fetchUser)
  const account = useAccount()
  const { dispatchErrorToast } = useErrorToast()

  /* Merges the list of associated swimmers with the logged-in user. */
  const mergedSwimmers = useMemo(() => {
    return (
      associatedSwimmersQuery.data &&
      userQuery.data && [
        {
          id: null,
          age: userQuery.data.data.age,
          zip: userQuery.data.data.zip,
          image: userQuery.data.data.image,
          firstname: account?.idTokenClaims?.given_name as string,
          lastname: account?.idTokenClaims?.family_name as string,
        },
        ...associatedSwimmersQuery.data.data.associatedSwimmers,
      ]
    )
  }, [associatedSwimmersQuery.data, userQuery.data, account?.idTokenClaims])

  const error = associatedSwimmersQuery.error || userQuery.error

  useEffect(() => {
    if (error) {
      dispatchErrorToast()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  const handleSelectSwimmer = (swimmerToSelect: Partial<AssociatedSwimmer>) => {
    // `null` is current user, therefore we don't check for it
    if (swimmerToSelect.id === undefined) {
      return
    }
    if (selectedSwimmerIds.includes(swimmerToSelect.id)) {
      setValue(
        'selectedSwimmerIds',
        selectedSwimmerIds.filter((p) => p !== swimmerToSelect.id),
      )
    } else {
      setValue('selectedSwimmerIds', [...selectedSwimmerIds, swimmerToSelect.id])
    }
  }

  return (
    <>
      {addSwimmerModalOpen && (
        <AssociatedSwimmerEditAddModal
          onClose={() => setAddSwimmerModalOpen(false)}
          onSaveSuccess={handleSelectSwimmer}
        ></AssociatedSwimmerEditAddModal>
      )}

      {mergedSwimmers && (
        <div className="gap-3 flex flex-col pt-3">
          {mergedSwimmers.map((swimmer) => (
            <Checkbox
              className="px-4 py-3 gap-4 flex items-center rounded-lg bg-white cursor-pointer"
              key={swimmer.id}
              isSelected={selectedSwimmerIds?.includes(swimmer.id)}
              onChange={() => handleSelectSwimmer(swimmer)}
            >
              <div
                className="h-14 w-12 bg-cover bg-center rounded-lg bg-backgroundGray shrink-0"
                style={{
                  backgroundImage: swimmer.image ? `url(${swimmer.image})` : undefined,
                }}
              ></div>
              <div className="flex flex-col flex-grow">
                <p className="font-semibold">
                  {swimmer.firstname} {swimmer.lastname}
                </p>
                <p className="text-sm">{swimmer.age}</p>
              </div>
              <div className="xyz" />
            </Checkbox>
          ))}
          <AriaButton
            onPress={() => setAddSwimmerModalOpen(true)}
            className="flex items-center font-semibold px-3 py-2 self-start"
          >
            <Icon name="plus" className="mr-2 no-fill text-gray-700"></Icon>
            Pridať osobu
          </AriaButton>
        </div>
      )}

      <div className="text-error px-2 text-sm">
        {errors.selectedSwimmerIds?.map((field) => field.message).join('/n')}
      </div>
    </>
  )
}

const OrderPageDiscountCode = ({
  ticket,
  setValue,
  getValues,
}: {
  ticket: Ticket
  setValue: UseFormSetValue<OrderFormData>
  getValues: UseFormGetValues<OrderFormData>
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
    <>
      <CheckboxField
        valueOfInput={useDiscountCode}
        onChange={handleUseDiscountCodeChange}
        label={<span className="text-xl">{t('buy-page.claim-code')}</span>}
      />
      {useDiscountCode && (
        <OrderPageDiscountCodeInput
          ticket={ticket}
          setValue={setValue}
          getValues={getValues}
        ></OrderPageDiscountCodeInput>
      )}
    </>
  )
}

enum OrderPageDiscountCodeInputStatus {
  None,
  Success,
  Error,
}

const OrderPageDiscountCodeInput = ({
  ticket,
  setValue,
  getValues,
}: {
  ticket: Ticket
  setValue: UseFormSetValue<OrderFormData>
  getValues: UseFormGetValues<OrderFormData>
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
    setStatus(OrderPageDiscountCodeInputStatus.None)

    const [error, response] = await to<AxiosResponse<DiscountCodeResponse>, AxiosError>(
      checkDiscountCode(ticket.id, discountCode),
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
    <>
      <InputField
        value={discountCode}
        onChange={(event) => setDiscountCode(event.target.value)}
        error={
          status === OrderPageDiscountCodeInputStatus.Error ? t('buy-page.error-code') : undefined
        }
        label={<span className="text-base">{t('buy-page.enter-code')}</span>}
        rightExtra={
          status === OrderPageDiscountCodeInputStatus.Success ? (
            <Icon name="checkmark" className="text-success" />
          ) : null
        }
        inputWrapperClassName="max-w-xs"
        className="mt-8"
      />
      <Button color="outlined" onClick={handleApply} className="mt-4">
        {t('buy-page.claim')}
      </Button>
    </>
  )
}

const validationSchema = yup.object({
  email: yup.string().when('$requireEmail', (requireEmail: boolean, schema: StringSchema) => {
    if (requireEmail) {
      return schema.email('buy-page.email-required').required('buy-page.email-required')
    }
    return schema
  }),
  ticketAmount: yup
    .number()
    .when('$hasTicketAmount', (hasTicketAmount: boolean, schema: NumberSchema) => {
      if (hasTicketAmount) {
        return schema.min(1).max(environment.maxTicketPurchaseLimit).required()
      }
      return schema
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
  age: yup
    .number()
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
})

const OrderPageSummary = ({
  ticket,
  hasTicketAmount,
  setValue,
  watch,
  priceQuery,
}: {
  ticket: Ticket
  hasTicketAmount: boolean
  setValue: UseFormSetValue<OrderFormData>
  watch: UseFormWatch<OrderFormData>
  priceQuery: QueryObserverResult<AxiosResponse<CheckPriceResponse, any>, unknown>
}) => {
  const { t } = useTranslation()

  const watchTicketAmount = watch('ticketAmount')

  const handleMinusClick = () => {
    if (watchTicketAmount! > 1) {
      setValue('ticketAmount', watchTicketAmount! - 1)
    }
  }
  const handlePlusClick = () => {
    if (watchTicketAmount! < environment.maxTicketPurchaseLimit) {
      setValue('ticketAmount', watchTicketAmount! + 1)
    }
  }

  return (
    <div className="rounded-lg bg-white shadow-lg max-w-lg my-6 md:mt-8 md:mb-12 ">
      <div className="p-8">
        <div className="font-semibold text-2xl">
          {hasTicketAmount && `${watchTicketAmount}× `}
          {ticket.name}
        </div>
        {ticket.childrenAllowed && (
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
        )}
        <p className="mt-4">{ticket.description}</p>

        {ticket.childrenAllowed && (
          <>
            <br />
            <p className="font-semibold">
              {/* TODO pluralizacia */}
              {t('buy-page.children-discount-children-count-and-price', {
                childrenMaxNumber: ticket.childrenMaxNumber,
                childrenPrice: ticket.childrenPrice,
              })}
            </p>
          </>
        )}
      </div>
      <div className="flex bg-blueish px-8 py-4 rounded-b-lg items-center">
        {hasTicketAmount && (
          <div className="border-primary border-solid rounded-lg border-2 px-6 py-3 mr-8 text-primary shrink-0">
            <button
              className="mr-6 leading-5	text-3xl align-top"
              onClick={handleMinusClick}
              type="button"
            >
              -
            </button>
            <span className="font-bold">{watchTicketAmount}</span>
            <button
              className="ml-6 leading-5 text-3xl align-top"
              onClick={handlePlusClick}
              type="button"
            >
              +
            </button>
          </div>
        )}
        <span className="text-xl text-primary font-bold">
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
                <OrderPagePrice pricing={priceQuery.data?.data.data.pricing}></OrderPagePrice>
              )
            )}
          </SkeletonTheme>
        </span>
      </div>
    </div>
  )
}

const OrderPageAdultChildrenCount = ({
  pricing,
  watch,
}: {
  pricing: CheckPriceResponse['data']['pricing']
  watch: UseFormWatch<OrderFormData>
}) => {
  const watchSelectedSwimmerIds = watch('selectedSwimmerIds') as (string | null)[]
  const { t } = useTranslation()

  const adultCount = watchSelectedSwimmerIds.length - pricing.numberOfChildren
  const childrenCount = pricing.numberOfChildren

  const adult = adultCount > 0 ? t('buy-page.adult-count', { count: adultCount }) : null
  const children = childrenCount > 0 ? t('buy-page.children-count', { count: childrenCount }) : null

  return <>({[adult, children].filter(Boolean).join(' + ')})</>
}

const OrderPagePrice = ({ pricing }: { pricing: CheckPriceResponse['data']['pricing'] }) => {
  const fullPrice =
    pricing.discount > 0 ? (
      <div className="inline-block strikethrough-diagonal mr-2">
        {pricing.orderPrice + pricing.discount} €
      </div>
    ) : null
  const orderPrice = <div className="inline-block">{pricing.orderPrice} €</div>
  return (
    <>
      {fullPrice}
      {orderPrice}
    </>
  )
}

const OrderPage = () => {
  const { ticket, requireEmail, hasOptionalFields, hasSwimmers, hasTicketAmount } = useOrderTicket()
  const order = useOrder()
  const { dispatchErrorToastForHttpRequest } = useErrorToast()
  const [captchaWarning, setCaptchaWarning] = useState<'loading' | 'show' | 'hide'>('loading')

  const { t } = useTranslation()

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
      ...(hasSwimmers ? { selectedSwimmerIds: [null] } : {}),
      ...(hasTicketAmount ? { ticketAmount: 1 } : {}),
    },
    context: {
      requireEmail,
      hasOptionalFields,
      hasSwimmers,
      hasTicketAmount,
    },
  })

  const userQuery = useQuery('user', fetchUser)
  const history = useHistory()

  let errorInterpreted = useValidationSchemaTranslationIfPresent(errors.agreement?.message)

  useEffect(() => {
    if (!userQuery.data) {
      return
    }

    if (
      userQuery.data &&
      hasSwimmers &&
      (userQuery.data.data.age == null || userQuery.data.data.image == null)
    ) {
      // If the ticket requires swimmers ("requireName") and the user has no age or image profile he/she has to fill it
      // in, so he/she is redirected.
      history.push('/profile/edit')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userQuery.data])

  // Must be any, otherwise type checking fails.
  //
  // Failed to compile.
  //
  // fork-ts-checker-webpack-plugin error in undefined(undefined,undefined):
  // Maximum call stack size exceeded  TSINTERNAL
  const watchPriceChange = useWatch<any>({
    // Those properties are those who trigger possible change of the price.
    name: ['ticketAmount', 'discountCode', 'selectedSwimmerIds', 'ticketAmount'],
    control,
  })

  const getRequestsFromFormData = () =>
    orderFormToRequests(getValues(), ticket!, {
      requireEmail: requireEmail!,
      hasOptionalFields: hasOptionalFields!,
      hasSwimmers: hasSwimmers!,
      hasTicketAmount: hasTicketAmount!,
    })

  const priceQuery = useQuery(
    'orderPrice',
    ({ signal }) => {
      const { getPriceRequest } = getRequestsFromFormData()

      return getPrice(getPriceRequest, signal)
    },
    {
      onError: (err) => {
        dispatchErrorToastForHttpRequest(err as AxiosError<ErrorWithMessages>)
      },
    },
  )

  const queryClient = useQueryClient()

  useEffect(() => {
    // If the price should change, cancel current queries and fetch a new price.
    queryClient.cancelQueries('orderPrice')
    queryClient.refetchQueries('orderPrice')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchPriceChange])

  const onSubmit = async () => {
    const { orderRequest } = getRequestsFromFormData()
    await order(orderRequest)
  }

  const buyButton = (
    <Button
      className="mt-14 md:mt-16"
      htmlType="button"
      disabled={priceQuery.isFetching || priceQuery.isError}
      onClick={handleSubmit(onSubmit, (err) => {
        console.log(err)
      })}
    >
      {priceQuery.isSuccess && !priceQuery.isFetching
        ? t('buy-page.pay-with-price', {
            price: priceQuery.data.data.data.pricing.orderPrice,
          })
        : t('buy-page.pay')}
      <Icon className="ml-4" name="credit-card" />
    </Button>
  )

  return ticket ? (
    <>
      <form className="container mx-auto py-8 grid grid-cols-1 md:grid-cols-2 md:gap-x-12">
        <div>
          <div className="text-2xl md:text-3xl font-semibold mb-4">
            {t('buy-page.personal-info')}
          </div>

          <NumberedLayout index={1} first={true}>
            <div className="font-semibold text-xl mb-7">{t('buy-page.buyer')}</div>
            <OrderPageEmail
              requireEmail={requireEmail!}
              register={register}
              errors={errors}
            ></OrderPageEmail>
            {hasOptionalFields && (
              <OrderPageOptionalFields
                register={register}
                errors={errors}
              ></OrderPageOptionalFields>
            )}
            {hasSwimmers && (
              <>
                <div className="mt-2">
                  {ticket.type === 'SEASONAL' && (
                    <Trans
                      i18nKey={'buy-page.select-people-reminder-seasonal'}
                      components={{ span: <span /> }}
                    />
                  )}
                  {ticket.type === 'ENTRIES' && (
                    <Trans
                      i18nKey={'buy-page.select-people-reminder-entries'}
                      components={{ span: <span /> }}
                    />
                  )}
                </div>
                <OrderPagePeopleList
                  watch={watch}
                  setValue={setValue}
                  errors={errors}
                ></OrderPagePeopleList>
              </>
            )}
          </NumberedLayout>

          <NumberedLayout index={2} first={false}>
            <OrderPageDiscountCode
              ticket={ticket}
              setValue={setValue}
              getValues={getValues}
            ></OrderPageDiscountCode>
          </NumberedLayout>

          <NumberedLayout index={3} first={false}>
            <Controller
              name="recaptchaToken"
              control={control}
              render={({ field: { onChange } }) => (
                <>
                  <Turnstile
                    theme="light"
                    sitekey={import.meta.env.VITE_RECAPTCHA_TURNSTILE_SITE_KEY ?? ''}
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
                    className="mb-2 self-center"
                  />
                  {captchaWarning === 'show' && (
                    <p className="text-p3 italic">{t('captcha_warning')}</p>
                  )}
                </>
              )}
            />
            <CheckboxField
              register={register}
              name="agreement"
              error={errorInterpreted}
              label={
                <span className="text-xl">
                  {t('buy-page.vop')}
                  <Link to="/vop" target="_blank" className="link text-primary">
                    {t('buy-page.vop-link')}
                  </Link>
                  .
                </span>
              }
            />
          </NumberedLayout>
          <div className="hidden md:block">{buyButton}</div>
        </div>
        <div className="mt-14 md:mt-0">
          <span className="text-2xl md:text-3xl font-semibold">{t('buy-page.summary')}</span>
          <OrderPageSummary
            ticket={ticket}
            hasTicketAmount={hasTicketAmount!}
            setValue={setValue}
            watch={watch}
            priceQuery={priceQuery}
          ></OrderPageSummary>
          <div className="text-gray color-fontBlack">
            {!ticket.childrenAllowed && <p className="mb-2">{t('common.additional-info-age')}</p>}
            <p className="mb-2">{t('common.additional-info-student-senior')}</p>
            <p>{t('common.additional-info-toddlers')}</p>
          </div>
        </div>
        <div className="block md:hidden flex justify-center">{buyButton}</div>
      </form>
    </>
  ) : (
    <></>
  )
}

export interface OrderFormData {
  email?: string
  ticketAmount?: number
  discountCode?: DiscountCodeResponse['discountCode'] | null
  selectedSwimmerIds?: (string | null)[]
  agreement?: boolean
  age?: number
  zip?: string
  recaptchaToken: string
}

export default OrderPage
