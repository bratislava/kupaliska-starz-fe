import React from 'react'

import { Button, Icon, Typography } from 'components'

import './HeroBanner.css'
import { HashLink } from 'react-router-hash-link'
import { useTranslation } from 'react-i18next'
import { environment } from '../../environment'

const preseason = environment.featureFlag.preseasonHomepage

const HeroBanner = () => {
  const { t } = useTranslation()

  return (
    <div className="relative mb-8">
      <div className="relative hero-image w-full">
        <div className="wave w-full h-full absolute bottom-0"></div>
      </div>
      <div className="container mx-auto content relative z-10">
        <Typography type="title" fontWeight="bold" className="mb-4 max-w-xs">
          {preseason ? t('landing.title-preseason') : t(`landing.title`)}
        </Typography>
        {!preseason && (
          <Typography type="subtitle" className="max-w-xs">
            {t('landing.subtitle')}
          </Typography>
        )}

        {!preseason && (
          <div
            className="
            flex
            space-x-4
            w-full
            mt-8
            mb-16

            md:flex-col
            md:space-y-4
            md:space-x-0
            md:w-1/2

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
            <HashLink to="/#swimming-pools" className="hidden sm:block">
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
