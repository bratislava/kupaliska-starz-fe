import React, { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'
import { push } from 'connected-react-router'

import {
  Button,
  CheckboxField,
  ChildCustomerForm,
  CustomerForm,
  Icon,
  InputField,
  SectionHeader,
  TicketCard,
  Tooltip,
  Typography,
} from 'components'
import {
  changeCartItemAmount,
  checkDiscountCodeActions,
  resetDiscountCode,
  selectCart,
  selectCustomerInfoFormValues,
  selectCustomerInfoPhotos,
  selectOrderDiscountCode,
  setCartItemChildren,
  setCustomerInfo,
} from 'store/order'
import { useAppDispatch, useAppSelector } from 'hooks'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { CartItem, CustomerInfoFormValues } from 'models'
import { Link } from 'react-router-dom'

import './BuyPage.css'
import { Trans, useTranslation } from 'react-i18next'

const validationSchema = yup.object({
  name: yup.string().when('$cartItem', (cartItem: CartItem, schema: any) => {
    if (cartItem.ticket.nameRequired) {
      return schema.required('Toto pole je povinné')
    }
    return schema
  }),
  email: yup.string().email('Prosím zadajte validný email').required('Toto pole je povinné'),
  photo: yup.string().when('$cartItem', (cartItem: CartItem, schema: any) => {
    if (cartItem.ticket.photoRequired) {
      return schema.required('Toto pole je povinné')
    }
    return schema
  }),
  zip: yup.string(),
  age: yup
    .number()
    .nullable(true)
    .transform((val) => (isNaN(val) ? null : val)),
  children: yup.array().of(
    yup.object({
      name: yup.string().required('Toto pole je povinné'),
      photo: yup.string().when('$cartItem', (cartItem: CartItem, schema: any) => {
        if (cartItem.ticket.childrenPhotoRequired) {
          return schema.required('Toto pole je povinné')
        }
        return schema
      }),
      age: yup
        .number()
        .required('Toto pole je povinné')
        .nullable(true)
        .transform((val) => (isNaN(val) ? null : val))
        .when('$cartItem', (cartItem: CartItem, schema: any) => {
          let _schema = schema
          if (cartItem.ticket.childrenAgeFrom !== null) {
            _schema = _schema.min(
              cartItem.ticket.childrenAgeFrom,
              `Minimálny vek dieťaťa je ${cartItem.ticket.childrenAgeFrom}`,
            )
          }
          if (cartItem.ticket.childrenAgeTo !== null) {
            _schema = _schema.max(
              cartItem.ticket.childrenAgeTo,
              `Maximálny vek dieťaťa je ${cartItem.ticket.childrenAgeTo}`,
            )
          }
          return _schema
        }),
    }),
  ),
  agreement: yup.boolean().isTrue('Potvrďte prosím prečítanie Všeobecných obchodných podmienok'),
})

const BuyPage = () => {
  const dispatch = useAppDispatch()
  const cartItem = useAppSelector(selectCart)
  const formValues = useAppSelector(selectCustomerInfoFormValues)
  const formPhotos = useAppSelector(selectCustomerInfoPhotos)
  const discountCodeState = useAppSelector(selectOrderDiscountCode)
  const {
    register,
    unregister,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    context: { cartItem },
  })
  const discountCodeEnabled = watch('discountCodeEnabled')
  const agreement = watch('agreement')
  const enableChildren = watch('enableChildren')
  const children = watch('children')
  // because performance issues when base64 img is in form
  const [photo, setPhoto] = useState<string>()
  const [childrenPhotos, setChildrenPhotos] = useState<string[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    if (formValues) {
      Object.keys(formValues).forEach((key) => {
        setValue(`${key}` as const, formValues[key as keyof typeof formValues])
      })
    }
    if (formPhotos) {
      setPhoto(formPhotos.photo ? formPhotos.photo : '')
      setChildrenPhotos(formPhotos.childrenPhotos ? formPhotos.childrenPhotos : [])
    }
  }, [])

  useEffect(() => {
    if (cartItem === null) {
      dispatch(push('/'))
    }
  }, [cartItem, dispatch])

  const onCartItemAmountChange = (newAmount: number) => {
    dispatch(changeCartItemAmount(newAmount))
  }

  const onToggleAddons = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      dispatch(setCartItemChildren(1))
      setChildrenPhotos([''])
    } else {
      dispatch(setCartItemChildren(0))
      setChildrenPhotos([])
    }
  }

  const addChild = () => {
    cartItem && dispatch(setCartItemChildren(cartItem.childrenNumber + 1))
    const newChildrenPhotos = [...childrenPhotos]
    newChildrenPhotos.push('')
    setChildrenPhotos(newChildrenPhotos)
  }

  const onDeleteChild = (index: number) => {
    console.log(index)
    const deletedArray = children.filter((_el: any, _index: number) => index !== _index)
    const deletedPhotoArray = childrenPhotos.filter((_el: any, _index: number) => index !== _index)
    setChildrenPhotos(deletedPhotoArray)
    setValue('children', deletedArray)
    cartItem && dispatch(setCartItemChildren(cartItem.childrenNumber - 1))
  }

  const onSetChildPhoto = (photo: string, index: number) => {
    const newChildrenPhotos = [...childrenPhotos]
    newChildrenPhotos[index] = photo
    setChildrenPhotos(newChildrenPhotos)
  }

  const onSubmit = (form: CustomerInfoFormValues) => {
    dispatch(
      setCustomerInfo({
        form,
        photo,
        childrenPhotos,
      }),
    )
    dispatch(push('/order-review'))
  }

  const onDiscountCodeBlur = (
    event: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement>,
  ) => {
    if (cartItem && event.target.value) {
      dispatch(
        checkDiscountCodeActions({
          ticketTypeId: cartItem?.ticket.id,
          discountCode: event.target.value,
        }),
      )
    }
  }
  const onDiscountCodeChange = () => {
    if (discountCodeState) {
      dispatch(resetDiscountCode())
    }
  }

  return (
    <form
      className="
        container
        mx-auto
        py-8
        grid
        grid-cols-1
        md:grid-cols-2
        md:gap-x-8
      "
      onSubmit={handleSubmit(onSubmit as any, (err) => {
        console.log(err)
      })}
    >
      <Tooltip multiline={true} id="tooltip-buy-page" />

      <section className="w-full">
        <SectionHeader title={t('buy-page.personal-info')} />
        <div className="mb-4 relative">
          <div className="index-indicator absolute rounded-full text-primary flex items-center justify-center text-3xl xs:text-4xl 2xl:text-4xl font-bold bg-secondary">
            1
          </div>
          <Typography type="subtitle" fontWeight="bold">
            {cartItem && cartItem.ticket.type === 'SEASONAL'
              ? t('buy-page.season-ticket-owner')
              : t('buy-page.ticket-owner')}
          </Typography>
        </div>
        <CustomerForm
          register={register}
          setValue={setValue}
          setError={setError}
          clearErrors={clearErrors}
          photoRequired={cartItem?.ticket.photoRequired}
          nameRequired={cartItem?.ticket.nameRequired}
          errors={errors}
          onPhotoSet={setPhoto}
          image={photo}
        />
        {cartItem && cartItem.ticket.childrenAllowed && (
          <>
            <div className="divider" />
            <div className="flex items-center relative">
              <div className="index-indicator">2</div>
              <CheckboxField
                register={register}
                onChange={onToggleAddons}
                value={enableChildren}
                name="enableChildren"
                label={t('buy-page.add-kid', {
                  childrenAgeTo: cartItem.ticket.childrenAgeTo
                    ? cartItem.ticket.childrenAgeTo + 1
                    : '18',
                  childrenPrice: cartItem.ticket.childrenPrice,
                  childrenMaxNumber: cartItem.ticket.childrenMaxNumber
                    ? cartItem.ticket.childrenMaxNumber
                    : 5,
                })}
              />
              <div
                className="flex-1 flex"
                data-for="tooltip-buy-page"
                data-tip={t('buy-page.children-tooltip')}
              >
                <Icon className="ml-4" name="question-mark" color="primary" />
              </div>
            </div>
          </>
        )}
        {Array.from(
          { length: cartItem !== null ? cartItem.childrenNumber | 0 : 0 },
          (_val, index) => (
            <React.Fragment key={`childrenForm-${index}`}>
              <ChildCustomerForm
                className="my-4"
                register={register}
                unregister={unregister}
                fieldNamePrefix={`children.${index}`}
                setValue={setValue}
                setError={setError}
                clearErrors={clearErrors}
                errors={errors}
                onClear={index > 0 ? () => onDeleteChild(index) : undefined}
                onPhotoSet={(photo) => onSetChildPhoto(photo, index)}
                image={childrenPhotos[index]}
                childPhotoRequired={cartItem?.ticket.childrenPhotoRequired}
              />
              <div className="divider" />
            </React.Fragment>
          ),
        )}
        {cartItem &&
          cartItem.childrenNumber > 0 &&
          cartItem.childrenNumber <
            (cartItem.ticket.childrenMaxNumber ? cartItem.ticket.childrenMaxNumber : 5) && (
            <div
              role="button"
              onClick={addChild}
              className="flex items-center cursor-pointer font-medium text-opacity-50 text-fontBlack"
            >
              <div className="p-2 bg-primary rounded-full mr-2">
                <Icon className="text-xs" name="plus" color="white" />
              </div>
              {t('buy-page.add-kid', {
                childrenAgeTo: cartItem.ticket.childrenAgeTo
                  ? cartItem.ticket.childrenAgeTo + 1
                  : '18',
                childrenPrice: cartItem.ticket.childrenPrice,
                childrenMaxNumber: cartItem.ticket.childrenMaxNumber
                  ? cartItem.ticket.childrenMaxNumber
                  : 5,
              })}
            </div>
          )}
      </section>

      <section className="w-full md:row-span-2">
        <div className="divider md:hidden" />
        <SectionHeader className="hidden md:block" title={t('buy-page.summary')} />
        <div className="w-full lg:w-3/4">
          {cartItem && (
            <div key={cartItem.ticket.id} className="w-full flex flex-col">
              <TicketCard
                ticket={cartItem.ticket}
                initialAmount={cartItem.amount}
                onInputValueChange={onCartItemAmountChange}
                discount={discountCodeState?.amount}
              />
              {cartItem.childrenNumber > 0 && (
                <div className="w-full flex justify-between p-4 shadow-xs rounded-lg">
                  <span className="text-xl font-bold">
                    + {cartItem.childrenNumber}
                    {t('buy-page.kid-times')}
                  </span>
                  <div>
                    <span
                      className={`text-xl font-bold ${
                        discountCodeState && discountCodeState.status === 'OK' ? 'strikediag' : ''
                      }`}
                    >
                      {Math.floor(
                        cartItem.childrenNumber *
                          (cartItem.ticket.childrenPrice ? cartItem.ticket.childrenPrice : 0) *
                          100,
                      ) / 100}
                      €
                    </span>
                    {discountCodeState && discountCodeState.status === 'OK' && (
                      <span className="text-xl font-bold ml-2 text-primary">
                        {Math.floor(
                          cartItem.childrenNumber *
                            (cartItem.ticket.childrenPrice ? cartItem.ticket.childrenPrice : 0) *
                            (discountCodeState.amount
                              ? (100 - discountCodeState.amount) / 100
                              : 1) *
                            100,
                        ) / 100}
                        €
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden md:block text-fontBlack text-opacity-50 font-medium mx-3 xs:mx-6 md:mt-6">
          <Trans i18nKey={'order-review.review-muted'} components={{ p: <p /> }} />
        </div>
      </section>

      <section className="md:order-4">
        <div className="divider" />
        <div className="relative">
          <div className="index-indicator absolute rounded-full text-primary flex items-center justify-center text-3xl xs:text-4xl 2xl:text-4xl font-bold bg-secondary">
            {cartItem && cartItem.ticket.childrenAllowed ? '3' : '2'}
          </div>
          <CheckboxField
            value={discountCodeEnabled}
            name="discountCodeEnabled"
            register={register}
            label={t('buy-page.claim-code')}
          />
        </div>

        {discountCodeEnabled && (
          <div className="my-4">
            <InputField
              label={t('buy-page.enter-code')}
              className="w-full md:w-1/2"
              name="discountCode"
              onChange={onDiscountCodeChange}
              onBlur={onDiscountCodeBlur}
              register={register}
              rightExtra={
                discountCodeState ? (
                  discountCodeState.status === 'OK' ? (
                    <Icon name="checkmark" className="text-success" />
                  ) : null
                ) : undefined
              }
              error={
                discountCodeState && discountCodeState.status === 'NOK'
                  ? t('buy-page.code-fail')
                  : undefined
              }
            />
          </div>
        )}

        <div className="divider" />
        <div className="relative">
          <div className="index-indicator absolute rounded-full text-primary flex items-center justify-center text-3xl xs:text-4xl 2xl:text-4xl font-bold bg-secondary">
            {cartItem && cartItem.ticket.childrenAllowed ? '4' : '3'}
          </div>
          <CheckboxField
            value={agreement}
            name="agreement"
            register={register}
            error={errors.agreement?.message}
            label={
              <>
                {t('buy-page.vop')}
                <Link to="/vop" className="link text-primary">
                  {t('buy-page.vop-link')}
                </Link>
                .
              </>
            }
          />
          <span className="col-span-full font-medium block ml-9 mt-2">
            {t('buy-page.gdpr')}
            <Link to="/gdpr" className="link text-primary">
              {t('buy-page.gdpr-here')}
            </Link>
            .
          </span>
        </div>
        <Button className="w-full lg:w-1/2 my-8" htmlType="submit">
          {t('buy-page.continue')}
          <Icon className="ml-4" name="credit-card" />
        </Button>
      </section>

      <section className="md:hidden">
        <div className="text-fontBlack text-opacity-50 font-medium mx-3 xs:mx-6 md:mt-6">
          <Trans i18nKey={'order-review.review-muted'} components={{ p: <p /> }} />
        </div>
      </section>
    </form>
  )
}

export default BuyPage
