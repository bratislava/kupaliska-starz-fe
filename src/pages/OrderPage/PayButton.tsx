import { Button } from 'components'

interface PayButtonProps {
  disabled: boolean
  icon: JSX.Element
  onSubmit: () => void
  text: string
  color: 'black' | 'white-outlined' | 'primary'
}

const PayButton = ({ disabled, text, onSubmit, icon, color }: PayButtonProps) => {
  return (
    <Button
      className="w-full gap-x-3 p-3"
      color={color}
      htmlType="button"
      disabled={disabled}
      onClick={onSubmit}
    >
      {icon}
      {text}
    </Button>
  )
}

export default PayButton
