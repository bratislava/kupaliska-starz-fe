import React from 'react'

import { Button } from 'components'

interface PayButtonProps {
  disabled: boolean
  icon: JSX.Element
  handleSubmit: () => Promise<void>
  text: string
}

const PayButton = ({ disabled, handleSubmit, text, icon }: PayButtonProps) => {
  return (
    <Button className="w-3/4" htmlType="button" disabled={disabled} onClick={handleSubmit}>
      {text}
      {icon}
    </Button>
  )
}

export default PayButton
