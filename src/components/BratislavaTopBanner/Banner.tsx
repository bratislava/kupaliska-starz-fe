import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

import { Icon } from 'components'
import SignInSignOutLink from '../SignInSignOutLink/SignInSignOutLink'
import AlertBanner from 'components/AlertBanner/AlertBanner'
import { fetchGeneralSettings } from 'store/global/api'
import { useQuery } from 'react-query'

const SocialMediaButton = ({
  children,
  paddingR = true,
}: PropsWithChildren<{ paddingR?: boolean }>) => (
  <button className={`bg-transparent ${paddingR ? 'p-2' : 'pl-2 py-2'} focus:outline-none`}>
    {children}
  </button>
)

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
      <aside className="flex bg-backgroundGray items-center" style={{ height: '50px' }}>
        <div className="container mx-auto flex justify-between">
          <div className="flex items-center">
            <img className="pr-3" alt="" src="/logo-bratislava.svg" />
            <span className="hidden md:block text-sm">
              Hlavné mesto SR <strong>Bratislava</strong>
            </span>
          </div>
          <div className="items-center flex">
            <SignInSignOutLink></SignInSignOutLink>
            <a
              href="https://www.facebook.com/STaRZ.Bratislava.official"
              target="_blank"
              rel="noreferrer"
              className="hidden md:block ml-10"
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
