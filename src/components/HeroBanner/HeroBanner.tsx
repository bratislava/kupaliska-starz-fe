import './HeroBanner.css'

import cx from 'classnames'
import { Button, Icon, Typography } from 'components'
import { ANCHORS } from 'helpers/constants'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Link } from 'react-router'
import { fetchGeneralSettings } from 'store/global/api'

const HeroBanner = () => {
  const { t } = useTranslation()
  const { data: generalSettings } = useQuery({
    queryKey: ['generalSettings'],
    queryFn: fetchGeneralSettings,
  })

  return (
    <div className="relative mb-8">
      <div className="hero-image relative w-full">
        <div className="wave absolute bottom-0 h-full w-full"></div>
      </div>
      <div
        className={cx('content container relative z-10 mx-auto', {
          // Hacky solution for the preseason version to not hide "Ako funguje nákup lístkov?"
          // TODO: change isOffSeason boolean to selectable?
          'xl:min-h-[228px]': generalSettings?.data.isOffSeason,
        })}
      >
        <div className="
          max-w-xs
          2xl:max-w-md
        ">
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
              mb-16 mt-8 flex w-full flex-col space-x-0 space-y-4
              lg:flex-row lg:space-x-4 lg:space-y-0
              xl:w-3/5
            "
          >
            <Link to={ANCHORS.TICKET_BUY}>
              <Button thin>
                <span className="p-1 pl-5 pr-4">{t('landing.buy-ticket')}</span>
                <Icon name="tickets" className="no-fill pr-5" />
              </Button>
            </Link>
            <Link to={ANCHORS.SWIMMING_POOLS} className="block">
              <Button className="" color="outlined" thin>
                <span className="p-1 pl-5 pr-4">{t('landing.swimming-pools-starz')}</span>
                <Icon name="swimming-man" className="
                  no-fill hidden pr-5
                  xs:block
                " />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default HeroBanner
