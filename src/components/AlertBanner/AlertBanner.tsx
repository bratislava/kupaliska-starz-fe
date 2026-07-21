import { Icon } from 'components'

interface AlertBannerProps {
  text: string
}

const AlertBanner = ({ text }: AlertBannerProps) => {
  if (text === '') {return null}

  return (
    <div className="flex bg-[#1F1F1F] text-white">
      <div className="
        container mx-auto flex gap-3 py-3
        lg:items-center lg:py-4
      ">
        <Icon className="flex items-center" name="alert" />
        <div className="grow">{text}</div>
      </div>
    </div>
  )
}

export default AlertBanner
