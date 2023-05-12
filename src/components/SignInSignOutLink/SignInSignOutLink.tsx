import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../../hooks/useLogin'
import { useLogout } from '../../hooks/useLogout'
import { useTranslation } from 'react-i18next'
import { useAccount } from '../../hooks/useAccount'

/* Inspired by https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/1b38e9582ae23bde40fe4bef77f3d838e838e08b/samples/msal-react-samples/react-18-sample/src/ui-components/SignInSignOutButton.jsx */
const SignInSignOutLink = () => {
  const { t } = useTranslation()

  const { data: account, isLoading } = useAccount()

  const isAuthenticated = !!account

  const login = useLogin()
  const logout = useLogout()

  const [name, setName] = useState<string>()

  useEffect(() => {
    if (account) {
      setName(`${account?.given_name} ${account?.family_name}`)
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
  } else if (isLoading) {
    // was here originally, might no longer be needed if we wait for auth before displaying the entire page, but will be useful when we stop doing that
    return null
  } else {
    return (
      // TODO: fix eslint
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a role="button" onClick={() => login()}>
        {t('common.login')}
      </a>
    )
  }
}

export default SignInSignOutLink
