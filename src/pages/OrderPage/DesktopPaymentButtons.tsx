import { PaymentMethod } from 'helpers/types'
import PayButton from 'pages/OrderPage/PayButton'

interface DesktopPaymentButtonsProps {
  isDisabled: boolean
  onSubmit: (paymentMethod: PaymentMethod) => Promise<void>
  price?: number
}
const DesktopPaymentButtons = ({ isDisabled, onSubmit, price }: DesktopPaymentButtonsProps) => (
  <>
    <div className="flex flex-row gap-x-3">
      <div className="w-full">
        <PayButton
          isDisabled={isDisabled}
          paymentMethod={PaymentMethod.APAY}
          onSubmit={onSubmit}
          price={price}
        />
      </div>
      <div className="w-full">
        <PayButton
          isDisabled={isDisabled}
          paymentMethod={PaymentMethod.GPAY}
          onSubmit={onSubmit}
          price={price}
        />
      </div>
    </div>
    <div className="w-full">
      <PayButton
        isDisabled={isDisabled}
        paymentMethod={PaymentMethod.CARD}
        onSubmit={onSubmit}
        price={price}
      />
    </div>
  </>
)

export default DesktopPaymentButtons
