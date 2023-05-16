import React, { PropsWithChildren, useEffect, useState } from 'react'
import useCityAccountAccessToken from './useCityAccount'
import { registerUser } from '../store/global/api'

/**
 * User must be registered on Kupaliska BE after City account registration, this component assures that.
 */
const RegisterUserGuard = ({ children }: PropsWithChildren<{}>) => {
  const [showChildren, setShowChildren] = useState(false)
  const { accessToken, status } = useCityAccountAccessToken()

  useEffect(() => {
    if (showChildren) {
      return
    }
    if (status === 'authenticated') {
      registerUser(accessToken as string)
        // If register user fails, it usually means that the user is already registered.
        // TODO: Improve check
        .catch(() => {})
        .finally(() => setShowChildren(true))
    }
    if (status === 'unauthenticated') {
      setShowChildren(true)
    }
  }, [showChildren, accessToken, status])
  return <>{showChildren ? children : null}</>
}

export default RegisterUserGuard
