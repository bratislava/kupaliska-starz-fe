import { getAccessToken } from 'helpers/amplify'
import { useQuery } from 'react-query'
import { getAccount, redirectToLogin, redirectToLogout } from 'helpers/cityAccountApi'
import { PropsWithChildren, useState, useEffect } from 'react'
import { useEffectOnce } from 'usehooks-ts'
import { useHistory } from 'react-router'

// hooks are mimicking the functionality previously provided for msal
// if everything works, some of this usage can be simplified

export const useIsAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'))
  useEffectOnce(() => {
    getAccessToken().then((result) => setIsAuthenticated(!!result))
  })
  return isAuthenticated
}

export const useAccount = () => {
  const isAuthenticated = useIsAuthenticated()
  const { data } = useQuery('city-account', getAccount, {
    enabled: isAuthenticated,
  })
  return data
}

export const useLogout = () => async () => {
  localStorage.removeItem('accessToken')
  return redirectToLogout()
}

export const useLogin = () => async () => redirectToLogin()

/**
 * Waits for login status, if successful render the content (the page).
 */
export const PostLoginHandlerWrapper = ({ children }: PropsWithChildren<{}>) => {
  const [showContent, setShowContent] = useState(false)
  // TODO msal version did much more, verify how much of that is needed for same behaviour
  useEffectOnce(() => {
    getAccessToken().finally(() => {
      setShowContent(true)
    })
  })

  const account = useAccount()

  useEffect(() => {
    console.log('account changed', account)
  }, [account])

  return showContent ? <>{children}</> : <></>
}
