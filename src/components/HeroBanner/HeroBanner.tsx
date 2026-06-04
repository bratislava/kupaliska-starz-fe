import { Button, Icon, Typography } from 'components'

import './HeroBanner.css'
import { HashLink } from 'react-router-hash-link'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { ANCHORS } from 'helpers/constants'
import { useQuery } from 'react-query'
import { fetchGeneralSettings } from 'store/global/api'

const HeroBanner = () => {
  const { t } = useTranslation()
  const { data: generalSettings } = useQuery({
    queryKey: ['generalSettings'],
    queryFn: fetchGeneralSettings,
  })

  return (
    <div className="relative mb-8">
      <div className="relative hero-image w-full">
        <div className="wave w-full h-full absolute bottom-0"></div>
      </div>
      <div
        className={cx('container mx-auto content relative z-10 ', {
          // Hacky solution for the preseason version to not hide "Ako funguje nákup lístkov?"
          // TODO: change isOffSeason boolean to selectable?
          'xl:min-h-[228px]': generalSettings?.data.isOffSeason,
        })}
      >
        <div className="max-w-xs 2xl:max-w-md">
          <Typography type="title" fontWeight="bold" className="mb-4">
            {/* TODO implement better logic offseason/preseason/season texts */}
            {/* {preseason ? t('landing.title-offseason') : t(`landing.title`)} */}
            {generalSettings?.data.isOffSeason ? t('landing.title-preseason') : t(`landing.title`)}
          </Typography>
          <Typography type="subtitle">
            {/* TODO implement better logic offseason/preseason/season texts */}
            {/* {preseason ? t('landing.subtitle-offseason') : t('landing.subtitle')} */}
            {generalSettings?.data.isOffSeason
              ? t('landing.subtitle-preseason')
              : t('landing.subtitle')}
          </Typography>
        </div>

        {!generalSettings?.data.isOffSeason && (
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
