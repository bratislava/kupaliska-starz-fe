import React from 'react'

import { Button, Icon, Typography } from 'components'

import './HeroBanner.css'
import { HashLink } from 'react-router-hash-link'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { usePreseason } from 'hooks/usePreseason'

const HeroBanner = () => {
  const { t } = useTranslation()
  const preseason = usePreseason()

  return (
    <div className="relative mb-8">
      <div className="relative hero-image w-full">
        <div className="wave w-full h-full absolute bottom-0"></div>
      </div>
      <div
        className={cx('container mx-auto content relative z-10 ', {
          // Hacky solution for the preseason version to not hide "Ako funguje nákup lístkov?"
          'xl:min-h-[228px]': preseason,
        })}
      >
        <div className="max-w-xs 2xl:max-w-md">
          <Typography type="title" fontWeight="bold" className="mb-4">
            {preseason ? t('landing.title-preseason') : t(`landing.title`)}
          </Typography>
          <Typography type="subtitle">
            {preseason ? t('landing.subtitle-preseason') : t('landing.subtitle')}
          </Typography>
        </div>

        {!preseason && (
          <div
            className="
            flex
            w-full
            mt-8
            mb-16

            flex-col
            space-y-4
            space-x-0

            lg:flex-row
            lg:space-y-0
            lg:space-x-4

            xl:w-3/5
          "
          >
            <HashLink to="/#ticket-buy">
              <Button thin>
                <span className="p-1 pl-5 pr-4">{t('landing.buy-ticket')}</span>
                <Icon name="tickets" className="no-fill pr-5" />
              </Button>
            </HashLink>
            <HashLink to="/#swimming-pools" className="block">
              <Button className="" color="outlined" thin>
                <span className="p-1 pl-5 pr-4">{t('landing.swimming-pools-starz')}</span>
                <Icon name="swimming-man" className="hidden xs:block no-fill pr-5" />
              </Button>
            </HashLink>
          </div>
        )}
      </div>
    </div>
  )
}

export default HeroBanner
