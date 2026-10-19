import { Trans } from 'react-i18next'
import { useQuery } from 'react-query'

import AlertBanner from '@/components/AlertBanner/AlertBanner'
import Icon from '@/components/Icon/Icon'
import { fetchGeneralSettings } from '@/store/global/api'

import SignInSignOutLink from '../SignInSignOutLink/SignInSignOutLink'

const Banner = () => {
  const { data: generalSettings } = useQuery({
    queryKey: ['generalSettings'],
    queryFn: fetchGeneralSettings,
  })

  return (
    <>
      {generalSettings?.data.showAlert && (
        <AlertBanner text={generalSettings?.data.alertText ?? ''} />
      )}
      <aside className="flex items-center bg-backgroundGray" style={{ height: '50px' }}>
        <div className="container mx-auto flex justify-between">
          <div className="flex items-center">
            <img className="pr-3" alt="" src="/logo-bratislava.svg" />
            <span className="hidden text-sm md:block">
              <Trans i18nKey="header.logo-html" components={{ strong: <strong /> }} />
            </span>
          </div>
          <div className="flex items-center">
            <SignInSignOutLink></SignInSignOutLink>
            <a
              href="https://www.facebook.com/STaRZ.Bratislava.official"
              target="_blank"
              rel="noreferrer"
              className="ml-10 hidden md:block"
            >
              <Icon name="facebook-logo" />
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Banner
