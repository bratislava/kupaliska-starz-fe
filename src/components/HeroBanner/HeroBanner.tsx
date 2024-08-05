import React from 'react'

import { Button, Icon, Typography } from 'components'

import './HeroBanner.css'
import { HashLink } from 'react-router-hash-link'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { usePreseason } from 'hooks/usePreseason'
import { ANCHORS } from 'helpers/constants'
import { useGeneralDataContext } from 'hooks/GeneralDataContext'

const HeroBanner = () => {
  const { t } = useTranslation()
  const preseason = usePreseason()
  const generalData = useGeneralDataContext()

  const getTitle = () => {
    if (generalData?.data?.data) {
      const data = generalData.data.data
      if (data.isOffSeason) {
        if (data.offSeasonTitle) {
          return data.offSeasonTitle
        } else {
          return t('landing.title-offseason')
        }
      } else if (!data.isOffSeason) {
        if (data.seasonTitle) {
          return data.seasonTitle
        } else {
          return t(`landing.title`)
        }
      }
    } else {
      if (preseason) {
        t('landing.title-preseason')
      } else {
        t(`landing.title`)
      }
    }
  }

  const getSubtitle = () => {
    if (generalData?.data?.data) {
      const data = generalData.data.data
      if (data.isOffSeason) {
        if (data.offSeasonSubtitle) {
          return data.offSeasonSubtitle
        } else {
          return t('landing.subtitle-offseason')
        }
      } else if (!data.isOffSeason) {
        if (data.seasonSubtitle) {
          return data.seasonSubtitle
        } else {
          return t(`landing.subtitle`)
        }
      }
    } else {
      if (preseason) {
        t('landing.subtitle-preseason')
      } else {
        t(`landing.subtitle`)
      }
    }
  }

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
            {getTitle()}
          </Typography>
          <Typography type="subtitle">{getSubtitle()}</Typography>
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
            <HashLink to={ANCHORS.TICKET_BUY}>
              <Button thin>
                <span className="p-1 pl-5 pr-4">{t('landing.buy-ticket')}</span>
                <Icon name="tickets" className="no-fill pr-5" />
              </Button>
            </HashLink>
            <HashLink to={ANCHORS.SWIMMING_POOLS} className="block">
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
