import React, { useState } from 'react'

import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link } from 'react-router-dom'

import { Button, CheckboxField, Icon, InputField } from 'components'
import { useAppDispatch } from 'hooks'
import { sendContactFormActions } from 'store/global'
import Turnstile from 'react-turnstile'
import { Trans, useTranslation } from 'react-i18next'

const formRules = yup.object().shape({
  email: yup.string().email('Prosím zadajte platný email').required('Toto pole je povinné'),
  name: yup.string().required('Toto pole je povinné'),
  message: yup.string().required('Toto pole je povinné'),
  agreement: yup.boolean().isTrue('Toto pole je povinné'),
})

export interface ContactFormValues {
  name: string
  email: string
  message: string
  recaptchaToken: string
  agreement: boolean
}

const ContactForm = () => {
  const dispatch = useAppDispatch()
  const [sending, setSending] = useState<boolean>(false)
  const { t } = useTranslation()
  const [captchaWarning, setCaptchaWarning] = useState<'loading' | 'show' | 'hide'>('loading')
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

  const onSubmit = (values: ContactFormValues) => {
    setSending(true)
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
    <form className="flex gap-4 flex-col">
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
      <CheckboxField
        register={register}
        name="agreement"
        label={
          <Trans
            i18nKey="landing.gdpr-info"
            components={{ Link: <Link to="/gdpr" className="underline" /> }}
          />
        }
        error={errors.agreement?.message}
      />
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
              className="mb-2 empty:hidden"
            />
            {captchaWarning === 'show' && <p className="text-p3 italic">{t('captchaWarning')}</p>}
          </>
        )}
      />
      <Button disabled={sending} htmlType="button" onClick={handleSubmit(onSubmit)}>
        {t('landing.send-message')} <Icon className="ml-4 no-fill" name="paper-plane" />
      </Button>
    </form>
  )
}

export default ContactForm
