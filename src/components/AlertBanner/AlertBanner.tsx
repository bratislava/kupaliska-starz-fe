import React from 'react'
import { Icon } from 'components'

interface AlertBannerProps {
  text: string
}

const AlertBanner = ({ text }: AlertBannerProps) => {
  if (text === '') return null

  return (
    <div className="bg-[#E07B04] text-white flex">
      <div className="container flex gap-3 py-3 lg:items-center lg:py-4 mx-auto">
        <Icon className="flex items-center" name="alert" />
        <div className="grow">{text}</div>
      </div>
    </div>
  )
}

export default AlertBanner
