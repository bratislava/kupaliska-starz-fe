import React, { useState } from 'react'

import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link } from 'react-router-dom'

import { Icon, InputField, Button } from 'components'
import { useAppDispatch } from 'hooks'
import { sendContactFormActions } from 'store/global'
import Turnstile from 'react-turnstile'
import { Trans, useTranslation } from 'react-i18next'

const formRules = yup.object().shape({
  email: yup.string().email('Prosím zadajte platný email').required('Toto pole je povinné'),
  name: yup.string().required('Toto pole je povinné'),
  message: yup.string().required('Toto pole je povinné'),
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
    <form className="grid gap-4 grid-cols-2">
      <InputField
        className="col-span-2 lg:col-span-1"
        name="name"
        register={register}
        leftExtra={<Icon name="user" className="mr-4" />}
        label={t('landing.name')}
        error={errors.name?.message}
      />
      <InputField
        className="col-span-2 lg:col-span-1"
        name="email"
        register={register}
        leftExtra={<Icon name="mail" className="mr-4" />}
        label={t('landing.email')}
        error={errors.email?.message}
      />
      <InputField
        className="col-span-2"
        name="message"
        register={register}
        placeholder={t('landing.message')}
        error={errors.message?.message}
        element="textarea"
      />
      <span className="text-sm text-gray-400 col-span-full">
        <Trans i18nKey="landing.recaptcha" components={{ a: <a /> }} />
      </span>
      <span className="col-span-full font-medium">
        <Trans i18nKey="landing.gdpr-info" components={{ Link: <Link to="/gdpr" /> }} />
      </span>

      <Controller
        name="recaptchaToken"
        control={control}
        render={({ field: { onChange } }) => (
          <>
            <Turnstile
              theme="light"
              sitekey={import.meta.env.VITE_RECAPTCHA_CLIENT_SECRET ?? ''}
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
            {captchaWarning === 'show' && <p className="text-p3 italic">{t('captchaWarning')}</p>}
          </>
        )}
      />
      <Button
        disabled={sending}
        className="col-span-full lg:col-span-1"
        htmlType="button"
        onClick={handleSubmit(onSubmit)}
      >
        {t('landing.send-message')} <Icon className="ml-4" name="paper-plane" />
      </Button>
    </form>
  )
}

export default ContactForm
