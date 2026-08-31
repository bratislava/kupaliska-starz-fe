import { Button, Icon } from 'components'
import { useCurrencyFromCentsFormatter } from 'helpers/currencyFormatter'
import { PaymentMethod } from 'helpers/types'
import { useTranslation } from 'react-i18next'

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
  let icon = (
    <Icon className="flex size-6 items-center justify-center rounded-sm p-1" name="credit-card" />
  )
  let color: 'black' | 'white-outlined' | 'primary' = 'primary'

  switch (paymentMethod) {
    case PaymentMethod.APAY:
      color = 'black'
      icon = (
        <Icon
          name="apple-pay"
          className="no-fill flex size-6 items-center justify-center rounded-sm bg-black p-1"
        ></Icon>
      )
      text = t('buy-page.pay-with-apple-pay')
      break
    case PaymentMethod.GPAY:
      color = 'white-outlined'
      icon = (
        <Icon
          name="google-pay"
          className="no-fill flex size-6 items-center justify-center rounded-sm bg-white p-1"
        ></Icon>
      )
      text = t('buy-page.pay-with-google-pay')
      break
    case PaymentMethod.CARD:
      break
    default:
      break
  }

  return (
    <Button
      className="w-full gap-x-3 p-3"
      color={color}
      htmlType="button"
      disabled={isDisabled}
      onClick={async () => await onSubmit(paymentMethod)}
    >
      {icon}
      {text}
    </Button>
  )
}

export default PayButton
