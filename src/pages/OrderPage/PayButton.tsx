import { useTranslation } from 'react-i18next'

import ButtonComponentLibraryWrapper from '@/components/Button/ButtonComponentLibraryWrapper'
import Icon from '@/components/Icon/Icon'
import { useCurrencyFromCentsFormatter } from '@/helpers/currencyFormatter'
import { PaymentMethod } from '@/helpers/types'

interface PayButtonProps {
  isDisabled: boolean
  paymentMethod: PaymentMethod
  onSubmit: (paymentMethod: PaymentMethod) => Promise<void>
  price?: number
}

const PayButton = ({ onSubmit, paymentMethod, isDisabled, price }: PayButtonProps) => {
  const { t } = useTranslation()

  const currencyFromCentsFormatter = useCurrencyFromCentsFormatter()

  let text = price
    ? t('buy-page.pay-with-price', {
        price: currencyFromCentsFormatter.format(price),
      })
    : t('buy-page.pay')
  let icon = <Icon name="credit-card" className="no-fill" />
  let variant: 'plain' | 'outline-soft' | 'solid' = 'solid'
  let buttonClass = ''

  switch (paymentMethod) {
    case PaymentMethod.APAY:
      icon = <Icon name="apple-pay" className="no-fill bg-black" />
      text = t('buy-page.pay-with-apple-pay')
      buttonClass = 'bg-black'
      break
    case PaymentMethod.GPAY:
      variant = 'outline-soft'
      icon = <Icon name="google-pay" className="no-fill" />
      text = t('buy-page.pay-with-google-pay')
      break
    case PaymentMethod.CARD:
      break
    default:
      break
  }

  return (
    <ButtonComponentLibraryWrapper
      variant={variant}
      className={`w-full ${buttonClass}`}
      isDisabled={isDisabled}
      onClick={async () => await onSubmit(paymentMethod)}
      startIcon={icon}
    >
      {text}
    </ButtonComponentLibraryWrapper>
  )
}

export default PayButton
