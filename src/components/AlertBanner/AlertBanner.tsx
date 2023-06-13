import React, { useEffect, useState } from 'react'
import { Icon } from 'components'
import { Button } from 'react-aria-components'
import { useTranslation } from 'react-i18next'
import { useLocalStorage } from 'usehooks-ts'

const AlertBanner = () => {
  const { t } = useTranslation()
  const text = t('landing.alert-text')

  const storageKey = `kupaliska-dismissible-alert-timestamp`

  const [showAlert, setShowAlert] = useState(false)
  const [alertText, setAlertText] = useLocalStorage<null | string>(storageKey, null)

  useEffect(() => {
    if (alertText !== text) {
      setShowAlert(true)
    }
  }, [alertText, text])

  if (!showAlert || !text?.length) {
    return null
  }

  const handleClose = () => {
    setAlertText(text)
    setShowAlert(false)
  }

  return (
    <div className="bg-[#E07B04] text-white flex">
      <div className="container flex gap-3 py-3 lg:items-center lg:py-4 mx-auto">
        <Icon className="flex items-center" name="alert" />
        <div className="grow">{text}</div>
        <Button
          className="-m-3 shrink-0 p-3 lg:-m-4 lg:p-4 flex items-center"
          aria-label={t('landing.alert-text-close')}
          onPress={() => handleClose()}
        >
          <Icon name="close" />
        </Button>
      </div>
    </div>
  )
}

export default AlertBanner
