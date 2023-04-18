import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'
import cx from 'classnames'

const Footer = () => {
  const { t } = useTranslation()
  const location = useLocation()

  // Don't show top margin on home page as it handles its own positioning and has a different background (white).
  // TODO: Find better solution.
  const showTopMargin = location.pathname !== '/'

  return (
    <div className={cx('w-full bg-blueish', { 'mt-4 md:mt-24': showTopMargin })}>
      <div className="w-full flex items-center justify-between py-4 grid grid-cols-1 lg:grid-cols-3 container mx-auto">
        <div className="flex flex-col text-primary order-1 my-2 lg:my-0 lg:order-1">
          <span className="font-semibold">{t('common.contact')}</span>
          <span>
            Správa telovýchovných a rekreačných zariadení hlavného mesta Slovenskej republiky
            Bratislavy
          </span>
          <span></span>
          <span>Junácka 4, 831 04 Bratislava 3</span>
          <span>IČO: 00179663</span>
          <span>DIČ: 2020801695</span>
        </div>
        <div className="text-primary flex items-center order-3 lg:order-2 justify-center col-span-1">
          STARZ |{' '}
          <a
            href="https://inovacie.bratislava.sk"
            rel="noopener noreferrer"
            target="_blank"
            className="link ml-1 mr-1"
          >
            Inovácie mesta Bratislava
          </a>
          | 2022
        </div>
        <div className="flex flex-col text-primary lg:items-end order-2 lg:order-3 my-2 lg:my-0">
          <span className="font-semibold">{t('common.important-info')}</span>
          <Link className="link" to="/vop">
            {t('common.vop')}
          </Link>
          <Link className="link" to="/gdpr">
            {t('common.privacy-conditions')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Footer
