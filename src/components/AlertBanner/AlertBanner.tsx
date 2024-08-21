import React from 'react'
import cx from 'classnames'
import { Icon } from 'components'
import { useGeneralDataContext } from 'hooks/GeneralDataContext'

const AlertBanner = () => {
  const generalData = useGeneralDataContext()
  let text = ''
  let textColor = 'white'
  let backgroundColor = 'black'
  const data = generalData?.data?.data

  if (data) {
    text = data.alertText
    // i'm sure there is better way to do this but i can't think of any
    if (data.alertTextColor === 'black' || data.alertTextColor === 'white') {
      textColor = data.alertTextColor
    }
    textColor = data.alertTextColor
    // i'm sure there is better way to do this but i can't think of any
    if (data.alertColor === 'black' || data.alertColor === 'white') {
      backgroundColor = data.alertColor
    }
  }
  if (!text) return null

  return (
    <div
      className={cx('flex', {
        // i'm sure there is better way to do this but i can't think of any
        'text-white': textColor === 'white',
        'bg-black': backgroundColor === 'black',
      })}
    >
      <div className="container flex gap-3 py-3 lg:items-center lg:py-4 mx-auto">
        <Icon className="flex items-center" name="alert" />
        <div className="grow">{text}</div>
      </div>
    </div>
  )
}

export default AlertBanner
