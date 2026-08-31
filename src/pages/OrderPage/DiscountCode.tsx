import { CheckboxField } from 'components'
import DiscountCodeInput, { DiscountCodeInputProps } from 'pages/OrderPage/DiscountCodeInput'
import { OrderFormData } from 'pages/OrderPage/OrderPage'
import { ChangeEvent, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DiscountCode as DiscountCodeInt } from 'store/order/api'

interface DiscountCodeProps extends DiscountCodeInputProps {
  setValue: UseFormSetValue<OrderFormData>
  discountCodeValue?: DiscountCodeInt | null
}

const DiscountCode = ({ setValue, discountCodeValue, ...rest }: DiscountCodeProps) => {
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
      {useDiscountCode && <DiscountCodeInput {...rest} setValue={setValue} />}
    </div>
  )
}

export default DiscountCode
