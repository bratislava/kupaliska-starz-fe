import React, { useEffect, useState } from 'react'
import { useAccount, useIsAuthenticated, useMsal } from '@azure/msal-react'
import { InteractionStatus } from '@azure/msal-browser'
import { Link } from 'react-router-dom'
import { useLogin } from '../../hooks/useLogin'
import { useLogout } from '../../hooks/useLogout'
import { useTranslation } from 'react-i18next'

/* Inspired by https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/1b38e9582ae23bde40fe4bef77f3d838e838e08b/samples/msal-react-samples/react-18-sample/src/ui-components/SignInSignOutButton.jsx */
const SignInSignOutLink = () => {
  const { t } = useTranslation()

  const { inProgress } = useMsal()
  const account = useAccount()
  const isAuthenticated = useIsAuthenticated()
  const login = useLogin()
  const logout = useLogout()

  const [name, setName] = useState<string>()

  useEffect(() => {
    console.log(account)
    if (account) {
      setName(`${account.idTokenClaims?.given_name} ${account.idTokenClaims?.family_name}`)
    } else {
      setName(undefined)
    }
  }, [account])

  if (isAuthenticated) {
    return (
      <>
        {Boolean(name) && (
          <Link to="/tickets" className="font-bold mr-10">
            {name}
          </Link>
        )}
        {/* TODO: fix eslint */
        /* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a role="button" onClick={() => logout()}>
          {t('common.logout')}
        </a>
      </>
    )
  } else if (
    inProgress !== InteractionStatus.Startup &&
    inProgress !== InteractionStatus.HandleRedirect
  ) {
    // inProgress check prevents sign-in button from being displayed briefly after returning from a redirect sign-in. Processing the server response takes a render cycle or two
    return (
      // TODO: fix eslint
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a role="button" onClick={() => login()}>
        {t('common.login')}
      </a>
    )
  } else {
    return null
  }
}

export default SignInSignOutLink
