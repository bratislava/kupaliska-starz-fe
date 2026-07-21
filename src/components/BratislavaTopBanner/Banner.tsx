import { Icon } from 'components'
import AlertBanner from 'components/AlertBanner/AlertBanner'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { fetchGeneralSettings } from 'store/global/api'

import SignInSignOutLink from '../SignInSignOutLink/SignInSignOutLink'

const SocialMediaButton = ({
  children,
  paddingR = true,
}: PropsWithChildren<{ paddingR?: boolean }>) => (
  <button className={`bg-transparent ${paddingR ? 'p-2' : 'py-2 pl-2'} focus:outline-none`}>
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
      <aside className="flex items-center bg-backgroundGray" style={{ height: '50px' }}>
        <div className="container mx-auto flex justify-between">
          <div className="flex items-center">
            <img className="pr-3" alt="" src="/logo-bratislava.svg" />
            <span className="hidden text-sm md:block">
              Hlavné mesto SR <strong>Bratislava</strong>
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
