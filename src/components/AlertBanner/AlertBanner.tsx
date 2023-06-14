import React from 'react'
import { Icon } from 'components'
import { useTranslation } from 'react-i18next'

const AlertBanner = () => {
  const { t } = useTranslation()

  return (
    <div className="bg-[#E07B04] text-white flex">
      <div className="container flex gap-3 py-3 lg:items-center lg:py-4 mx-auto">
        <Icon className="flex items-center" name="alert" />
        <div className="grow">{t('landing.alert-text')}</div>
      </div>
    </div>
  )
}

export default AlertBanner
