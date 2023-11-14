import { checkTokenValid, getAccessTokenFromRefreshToken } from 'helpers/cityAccountToken'
import React, { useCallback, useEffect, useState } from 'react'
import jwtDecode, { JwtPayload } from 'jwt-decode'
import logger from 'helpers/logger'
import Cookies from 'universal-cookie'
import { useEffectOnce } from 'usehooks-ts'
import { environment } from '../environment'

export type CityAccountAccessTokenAuthenticationStatus =
  | 'initializing'
  | 'authenticated'
  | 'unauthenticated'

interface CityAccountAccessTokenState {
  status: CityAccountAccessTokenAuthenticationStatus
  accessToken: string | null
  sub: string | undefined
  refreshToken: () => Promise<null | undefined>
}

const cookies = new Cookies()

export const ACCESS_TOKEN_COOKIE_KEY = 'accessToken'
export const REFRESH_TOKEN_COOKIE_KEY = 'refreshToken'

const CityAccountAccessTokenContext = React.createContext<CityAccountAccessTokenState>(
  {} as CityAccountAccessTokenState,
)

export const CityAccountAccessTokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [initializationState, setInitializationState] = useState<
    'initializing' | 'ready' | 'refetched'
  >('initializing')

  // unfortunately useLocalStorage expects JSON-serializable object, therefore not storing as simple string
  const [accessToken, setAccessToken] = useState<string | null>(
    cookies.get(ACCESS_TOKEN_COOKIE_KEY),
  )

  const removeAccessToken = useCallback(() => {
    setAccessToken(null)
    cookies.remove(ACCESS_TOKEN_COOKIE_KEY, {
      domain: environment.cognitoCookieStorageDomain,
    })
  }, [])

  let jwtAccessToken = null
  try {
    jwtAccessToken = accessToken ? jwtDecode<JwtPayload>(accessToken) : null
  } catch (error) {
    // since the token is validated every time before our code stores it this shouldn't happen
    logger.error('Invalid accessToken found:', accessToken, error)
  }
  let status: CityAccountAccessTokenAuthenticationStatus = 'initializing'
  if (initializationState === 'ready') {
    status = !!jwtAccessToken ? 'authenticated' : 'unauthenticated'
  }

  const onRefreshToken = useCallback(async () => {
    const refreshToken = cookies.get(REFRESH_TOKEN_COOKIE_KEY)

    if (!refreshToken) {
      removeAccessToken()
      setInitializationState('ready')
      cookies.remove(ACCESS_TOKEN_COOKIE_KEY, {
        domain: environment.cognitoCookieStorageDomain,
      })
      return null
    }

    let newAccessToken = null

    try {
      newAccessToken = await getAccessTokenFromRefreshToken(refreshToken)
    } catch (error) {
      logger.error('getAccessTokenFromRefreshToken error', error)
      removeAccessToken()
      setInitializationState('ready')
      cookies.remove(REFRESH_TOKEN_COOKIE_KEY, {
        domain: environment.cognitoCookieStorageDomain,
      })
      return null
    }

    cookies.set(ACCESS_TOKEN_COOKIE_KEY, newAccessToken, {
      domain: environment.cognitoCookieStorageDomain,
      path: '/',
      secure: environment.cognitoCookieStorageDomain !== 'localhost',
      sameSite: true,
    })

    setInitializationState('ready')
    setAccessToken(newAccessToken)
  }, [])

  const validateTokenInStorage = useCallback(() => {
    if (!checkTokenValid(accessToken)) {
      removeAccessToken()
      return null
    } else {
      setInitializationState('ready')
      return accessToken
    }
  }, [accessToken, setAccessToken])

  useEffect(() => {
    // prevent stale token in storage, in case iframe refresh does not work
    window.addEventListener('focus', validateTokenInStorage)
    return () => {
      window.removeEventListener('focus', validateTokenInStorage)
    }
  }, [validateTokenInStorage])

  useEffectOnce(() => {
    const token = validateTokenInStorage()

    if (!token) onRefreshToken()
  })

  // mimicking previous behavior of not rendering children until initialized - if it doesn't break anything major this should be changed
  return (
    <CityAccountAccessTokenContext.Provider
      value={{
        sub: jwtAccessToken?.sub,
        accessToken: accessToken,
        status,
        refreshToken: onRefreshToken,
      }}
    >
      {initializationState === 'ready' ? children : null}
    </CityAccountAccessTokenContext.Provider>
  )
}

export default function useCityAccountAccessToken() {
  const context = React.useContext(CityAccountAccessTokenContext)
  if (context === undefined) {
    throw new Error(
      'useCityAccountAccessToken must be used within a CityAccountAccessTokenProvider',
    )
  }
  return context
}
