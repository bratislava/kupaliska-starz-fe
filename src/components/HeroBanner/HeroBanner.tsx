import './HeroBanner.css'

import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Link } from 'react-router'

import ButtonComponentLibraryWrapper from '@/components/Button/ButtonComponentLibraryWrapper'
import Icon from '@/components/Icon/Icon'
import Typography from '@/components/Typography/Typography'
import { ANCHORS } from '@/helpers/constants'
import { fetchGeneralSettings } from '@/store/global/api'
import cn from '@/utils/cn'

const HeroBanner = () => {
  const { t } = useTranslation()
  const { data: generalSettings } = useQuery({
    queryKey: ['generalSettings'],
    queryFn: fetchGeneralSettings,
  })

  return (
    <div className="relative mb-8">
      <div className="hero-image relative h-[100vw] w-full bg-[url(assets/images/hero_mobile.png)] sm:h-[65vh] sm:bg-[url(assets/images/hero.png)] lg:h-[50vw] xl:h-[35vw]">
        <div className="wave absolute bottom-0 size-full bg-[url(assets/images/hero_overlay_mobile.png)] sm:bg-[url(assets/images/hero_overlay.png)]"></div>
      </div>
      <div
        // fix mt being one-time in "vw" eg. "mt-[-16vw]"" and other times in "rem" eg. "lg:-mt-60"
        className={cn(
          'relative z-10 container mx-auto mt-[-25vw] mb-16 sm:mt-[-15vw] md:mt-[-16vw] md:mb-32 lg:-mt-60 xl:-mt-72',
          {
            // Hacky solution for the preseason version to not hide "Ako funguje nákup lístkov?"
            // TODO: change isSeasonActive boolean to selectable?
            'xl:min-h-[228px]': !generalSettings?.data.isSeasonActive,
          },
        )}
      >
        <div className="max-w-xs 2xl:max-w-md">
          <Typography type="title" fontWeight="bold" className="mb-4">
            {/* TODO implement better logic offseason/preseason/season texts */}
            {/* {preseason ? t('landing.title-preseason') : t(`landing.title`)} */}
            {generalSettings?.data.isSeasonActive
              ? t(`landing.title`)
              : t('landing.title-offseason')}
          </Typography>
          <Typography type="subtitle">
            {/* TODO implement better logic offseason/preseason/season texts */}
            {/* {preseason ? t('landing.subtitle-preseason') : t('landing.subtitle')} */}
            {generalSettings?.data.isSeasonActive
              ? t('landing.subtitle')
              : t('landing.subtitle-offseason')}
          </Typography>
        </div>

        {generalSettings?.data.isSeasonActive && (
          <div className="mt-8 mb-16 flex w-full flex-col space-y-4 space-x-0 lg:flex-row lg:space-y-0 lg:space-x-4 xl:w-3/5">
            {/* TODO don't nest button in link */}
            <Link to={ANCHORS.TICKET_BUY}>
              <ButtonComponentLibraryWrapper
                variant="solid"
                endIcon={<Icon name="tickets" className="no-fill" />}
              >
                {t('landing.buy-ticket')}
              </ButtonComponentLibraryWrapper>
            </Link>
            {/* TODO don't nest button in link */}
            <Link to={ANCHORS.SWIMMING_POOLS} className="block">
              <ButtonComponentLibraryWrapper
                variant="outline"
                endIcon={<Icon name="swimming-man" className="hidden xs:block" />}
              >
                {t('landing.swimming-pools-starz')}
              </ButtonComponentLibraryWrapper>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default HeroBanner
