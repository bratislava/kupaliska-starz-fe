import { CaptchaWarningStatus, OrderFormData } from 'pages/OrderPage/OrderPage'
import { Dispatch, SetStateAction } from 'react'
import { Control, Controller, FieldError } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import Turnstile from 'react-turnstile'

import { environment } from '../../environment'

interface RecaptchaFieldProps {
  control: Control<OrderFormData>
  captchaKey: number
  captchaWarning: CaptchaWarningStatus
  setCaptchaWarning: Dispatch<SetStateAction<CaptchaWarningStatus>>
  recaptchaTokenError?: FieldError
}

const RecaptchaField = ({
  control,
  captchaKey,
  captchaWarning,
  setCaptchaWarning,
  recaptchaTokenError,
}: RecaptchaFieldProps) => {
  const { t } = useTranslation()

  return (
    <Controller
      name="recaptchaToken"
      control={control}
      render={({ field: { onChange } }) => (
        <>
          <Turnstile
            theme="light"
            key={captchaKey}
            refreshExpired={'auto'}
            sitekey={environment.turnstileSiteKey}
            onVerify={(token) => {
              setCaptchaWarning('hide')
              onChange(token)
            }}
            onError={() => {
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
          {recaptchaTokenError && (
            <p className="text-p3 mt-1 text-error">{t('landing.captcha-warning-required')}</p>
          )}
          {captchaWarning === 'show' && (
            <p className="text-p3 mt-1 text-error">{t('landing.captcha-not-verified')}</p>
          )}
        </>
      )}
    />
  )
}

export default RecaptchaField
