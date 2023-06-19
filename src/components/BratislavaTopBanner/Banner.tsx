import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

import { Icon } from 'components'
import SignInSignOutLink from '../SignInSignOutLink/SignInSignOutLink'
import AlertBanner from 'components/AlertBanner/AlertBanner'

const SocialMediaButton = ({
  children,
  paddingR = true,
}: PropsWithChildren<{ paddingR?: boolean }>) => (
  <button className={`bg-transparent ${paddingR ? 'p-2' : 'pl-2 py-2'} focus:outline-none`}>
    {children}
  </button>
)

const Banner = () => {
  const { t } = useTranslation()

  return (
    <>
      <AlertBanner text={t('landing.alert-text')} />
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
              href="https://www.facebook.com/STaRZ-Spr%C3%A1va-telov%C3%BDchovn%C3%BDch-a-rekrea%C4%8Dn%C3%BDch-zariaden%C3%AD-hlavn%C3%A9ho-mesta-SR-513951915371509"
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
