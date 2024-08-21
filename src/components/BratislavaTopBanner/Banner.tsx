import React from 'react'

import { Icon } from 'components'
import SignInSignOutLink from '../SignInSignOutLink/SignInSignOutLink'
import AlertBanner from 'components/AlertBanner/AlertBanner'

const Banner = () => {
  return (
    <>
      <AlertBanner />
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
