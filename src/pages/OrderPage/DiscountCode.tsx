import { CheckboxField } from 'components'
import DiscountCodeInput from 'pages/OrderPage/DiscountCodeInput'
import { CaptchaWarningStatus, OrderFormData } from 'pages/OrderPage/OrderPage'
import { ChangeEvent, useState } from 'react'
import { FieldErrors, UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DiscountCode as DiscountCodeInt } from 'store/order/api'

interface DiscountCodeProps {
  setValue: UseFormSetValue<OrderFormData>
  incrementCaptchaKey: () => void
  setCaptchaWarning: (captchaWarning: CaptchaWarningStatus) => void
  captchaWarning: CaptchaWarningStatus
  recaptchaTokenError?: FieldErrors
  discountCodeValue?: DiscountCodeInt | null
}

const DiscountCode = ({
  setValue,
  incrementCaptchaKey,
  recaptchaTokenError,
  setCaptchaWarning,
  captchaWarning,
  discountCodeValue,
}: DiscountCodeProps) => {
  const [useDiscountCode, setUseDiscountCode] = useState(false)

  const { t } = useTranslation()

  const handleUseDiscountCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    setUseDiscountCode(checked)
    if (!checked && discountCodeValue != null) {
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
        <DiscountCodeInput
          captchaWarning={captchaWarning}
          setCaptchaWarning={setCaptchaWarning}
          setValue={setValue}
          incrementCaptchaKey={incrementCaptchaKey}
          recaptchaTokenError={recaptchaTokenError}
        />
      )}
    </div>
  )
}

export default DiscountCode
