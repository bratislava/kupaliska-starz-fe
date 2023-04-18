import { useMsal } from '@azure/msal-react'
import { msalLoginRequest } from '../msalAuthConfig'
import to from 'await-to-js'
import { AxiosError, AxiosResponse } from 'axios'
import { useLogout } from './useLogout'
import { useHistory } from 'react-router-dom'
import { registerUser, RegisterUserResponse } from '../store/global/api'
import { useErrorToast } from './useErrorToast'
import { LocationDescriptorObject } from 'history'
import React, { PropsWithChildren, useEffect, useState } from 'react'

export const useLogin = () => {
  const { instance } = useMsal()
  const { dispatchErrorToast } = useErrorToast()
  const history = useHistory()

  return async (afterLoginLocation?: LocationDescriptorObject<any>) => {
    // If the user is on order page we want him to redirect there and preserve ticket id.
    if (history.location.pathname === '/order' && !afterLoginLocation) {
      afterLoginLocation = history.location
    }

    const [loginError] = await to(
      instance.loginRedirect({
        ...msalLoginRequest,
        state: afterLoginLocation ? JSON.stringify(afterLoginLocation) : undefined,
      }),
    )

    if (loginError) {
      dispatchErrorToast()
    }
  }
}

const useLoginHandleRedirect = () => {
  const { instance } = useMsal()
  const logout = useLogout()
  const { dispatchErrorToast } = useErrorToast()
  const history = useHistory()

  return async () => {
    const [authError, authResult] = await to(instance.handleRedirectPromise())

    if (authError) {
      // In case of log in failure we want to log user out to prevent semi logged in state.
      await logout()
      console.error(authError)
      throw Error('Auth error: logging out.')
    }

    // `authResult` is `null` when user is not coming from B2C login, aka normal page load.
    if (authResult == null) {
      return true
    }

    const [registrationError, registrationResponse] = await to<
      AxiosResponse<RegisterUserResponse>,
      AxiosError
    >(registerUser(authResult.idToken))

    if (registrationError) {
      console.error(registrationError)
      dispatchErrorToast()
      // If registration fails we want to log out the user from MSAL to make him to do the request again and not interact
      // with the app in semi-authorized state
      logout()
      return true
    }

    // Copied from https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/1b38e9582ae23bde40fe4bef77f3d838e838e08b/samples/msal-react-samples/react-18-sample/src/index.js
    // Default to using the first account if no account is active on page load
    if (!instance.getActiveAccount() && instance.getAllAccounts().length > 0) {
      // Account selection logic is app dependent. Adjust as needed for different use cases.
      instance.setActiveAccount(instance.getAllAccounts()[0])
    }

    const newUser = registrationResponse?.data !== 'Používateľ už existuje'

    if (newUser) {
      // Redirect new user to profile edit to fill photo and age.
      history.push('/profile/edit')
      return true
    }

    const redirectToTickets = () => {
      history.push('tickets')
    }

    // Reparse redirect location provided in `useLogin` and redirect, otherwise redirect to tickets.
    if (authResult?.state) {
      try {
        const parsedState = JSON.parse(authResult.state) as LocationDescriptorObject
        history.push(parsedState)
        return true
      } catch (e) {
        redirectToTickets()
        return true
      }
    }

    redirectToTickets()
    return true
  }
}

/**
 * Waits for login status, if successful render the content (the page).
 */
export const PostLoginHandlerWrapper = ({ children }: PropsWithChildren<{}>) => {
  const [showContent, setShowContent] = useState(false)
  const handleLoginRedirect = useLoginHandleRedirect()

  useEffect(() => {
    handleLoginRedirect()
      .then(() => setShowContent(true))
      .catch((err) => console.error(err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return showContent ? <>{children}</> : <></>
}
