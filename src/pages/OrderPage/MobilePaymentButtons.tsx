import { PaymentMethod } from 'helpers/types'
import PayButton from 'pages/OrderPage/PayButton'

interface MobilePaymentButtonsProps {
  isDisabled: boolean
  onSubmit: (paymentMethod: PaymentMethod) => Promise<void>
  price?: number
}
const MobilePaymentButtons = ({ isDisabled, onSubmit, price }: MobilePaymentButtonsProps) => (
  <>
    <div>
      <PayButton
        isDisabled={isDisabled}
        paymentMethod={PaymentMethod.APAY}
        onSubmit={onSubmit}
        price={price}
      />
    </div>
    <div className="mt-3">
      <PayButton
        isDisabled={isDisabled}
        paymentMethod={PaymentMethod.GPAY}
        onSubmit={onSubmit}
        price={price}
      />
    </div>
    <div className="mt-3">
      <PayButton
        isDisabled={isDisabled}
        paymentMethod={PaymentMethod.CARD}
        onSubmit={onSubmit}
        price={price}
      />
    </div>
  </>
)

export default MobilePaymentButtons
