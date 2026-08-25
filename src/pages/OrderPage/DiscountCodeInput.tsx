import to from 'await-to-js'
import { AxiosError, AxiosResponse } from 'axios'
import { Button, Icon, InputField } from 'components'
import { useErrorToast } from 'hooks/useErrorToast'
import { CaptchaWarningStatus, OrderFormData } from 'pages/OrderPage/OrderPage'
import { useState } from 'react'
import { FieldErrors, UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { checkDiscountCode, DiscountCode, DiscountCodeResponse } from 'store/order/api'
import { useIsMounted } from 'usehooks-ts'

interface DiscountCodeInputProps {
  setValue: UseFormSetValue<OrderFormData>
  incrementCaptchaKey: () => void
  captchaWarning: CaptchaWarningStatus
  setCaptchaWarning: (captchaWarning: CaptchaWarningStatus) => void
  discountCodeValue?: DiscountCode | null
  recaptchaTokenError?: FieldErrors
  recaptchaTokenValue?: string
}

enum DiscountCodeInputStatus {
  None = 'None',
  Success = 'Success',
  Error = 'Error',
}

const DiscountCodeInput = ({
  setValue,
  discountCodeValue,
  incrementCaptchaKey,
  captchaWarning,
  setCaptchaWarning,
  recaptchaTokenError,
  recaptchaTokenValue,
}: DiscountCodeInputProps) => {
  const { t } = useTranslation()

  const { dispatchErrorToast } = useErrorToast()
  const isMounted = useIsMounted()

  const [discountCode, setDiscountCode] = useState('')
  const [status, setStatus] = useState(DiscountCodeInputStatus.None)

  const handleApply = async () => {
    if (discountCodeValue != null) {
      setValue('discountCode', null)
    }
    if (!recaptchaTokenValue) {
      setCaptchaWarning('show')

      return
    }
    setStatus(DiscountCodeInputStatus.None)

    incrementCaptchaKey()
    // TODO this shouldn't live in Input component, refactor
    const [error, response] = await to<AxiosResponse<DiscountCodeResponse>, AxiosError>(
      checkDiscountCode(discountCode, recaptchaTokenValue),
    )
    if (!isMounted()) {
      return
    }
    if (response) {
      setValue('discountCode', response.data.discountCode)
      setStatus(DiscountCodeInputStatus.Success)

      return
    }
    const errorStatus = error.response?.status
    if (errorStatus === 404 || errorStatus === 400) {
      setStatus(DiscountCodeInputStatus.Error)
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
          error={status === DiscountCodeInputStatus.Error ? t('buy-page.error-code') : undefined}
          inputWrapperClassName="lg:w-full"
          placeholder={t('buy-page.enter-code')}
        />
        <Button className="px-5 py-3" color="outlined" onClick={handleApply} rounded>
          {t('buy-page.claim')}
        </Button>
        {status === DiscountCodeInputStatus.Success ? (
          <Icon name="checkmark" className="text-success" />
        ) : null}
      </div>
      {(captchaWarning === 'show' || recaptchaTokenError) && (
        <p className="text-p3 mt-1 text-error">
          {t('landing.captcha-warning-required-and-reapply')}
        </p>
      )}
    </div>
  )
}

export default DiscountCodeInput
