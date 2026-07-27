import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Icon, InputField } from 'components'
import { useAppDispatch } from 'hooks'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import Turnstile from 'react-turnstile'
import { sendContactFormActions } from 'store/global'
import { useCounter, useIsClient, useTimeout } from 'usehooks-ts'
import * as yup from 'yup'

import { environment } from '../../environment'

const formRules = yup.object().shape({
  email: yup.string().email('Prosím zadajte platný email').required('Toto pole je povinné'),
  name: yup.string().required('Toto pole je povinné'),
  message: yup.string().required('Toto pole je povinné'),
  recaptchaToken: yup.string().required('landing.captcha-warning-required'),
})

export interface ContactFormValues {
  name: string
  email: string
  message: string
  recaptchaToken: string
}

const ContactForm = () => {
  const dispatch = useAppDispatch()
  const [sending, setSending] = useState<boolean>(false)
  const { t } = useTranslation()
  const isClient = useIsClient()

  const [captchaWarning, setCaptchaWarning] = useState<'loading' | 'show' | 'hide'>('loading')
  const { count: captchaKey, increment: incrementCaptchaKey } = useCounter(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<ContactFormValues>({
    mode: 'onChange',
    resolver: yupResolver(formRules),
  })

  useTimeout(() => {
    if (!isClient || captchaWarning === 'hide') {
      return
    }
    setCaptchaWarning('show')
  }, 3000)

  const onSubmit = (values: ContactFormValues) => {
    setSending(true)
    incrementCaptchaKey()
    dispatch(
      sendContactFormActions({
        formData: values,
      }),
    ).then((resp) => {
      if (resp.meta.requestStatus === 'fulfilled') {
        reset()
      }
      setSending(false)
    })
  }

  return (
    <form className="flex flex-col gap-4">
      <InputField
        name="name"
        register={register}
        label={t('landing.name')}
        newLabel
        error={errors.name?.message}
      />
      <InputField
        name="email"
        register={register}
        label={t('landing.email')}
        newLabel
        error={errors.email?.message}
      />
      <InputField
        name="message"
        register={register}
        label={t('landing.message')}
        error={errors.message?.message}
        newLabel
        element="textarea"
      />
      <span>
        <Trans
          i18nKey="landing.gdpr-info"
          components={{ Link: <Link to="/gdpr" className="underline" /> }}
        />
      </span>
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
              className="mb-2 empty:hidden"
            />
            {captchaWarning === 'show' && (
              <p className="text-p3 italic">{t('landing.captcha-not-verified')}</p>
            )}
            {errors.recaptchaToken && (
              <p className="text-p3 mt-1 text-error">{t('landing.captcha-warning-required')}</p>
            )}
          </>
        )}
      />
      <Button disabled={sending} htmlType="button" onClick={handleSubmit(onSubmit)}>
        {t('landing.send-message')} <Icon className="no-fill ml-4" name="send" />
      </Button>
    </form>
  )
}

export default ContactForm
