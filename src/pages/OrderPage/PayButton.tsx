import React from 'react'

import { Button } from 'components'

interface PayButtonProps {
  disabled: boolean
  icon: JSX.Element
  onSubmit: () => void
  text: string
}

const PayButton = ({ disabled, text, onSubmit, icon }: PayButtonProps) => {
  return (
    <Button className="w-3/4" htmlType="button" disabled={disabled} onClick={onSubmit}>
      {text}
      {icon}
    </Button>
  )
}

export default PayButton
