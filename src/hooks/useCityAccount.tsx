import { checkTokenValid, getAccessTokenFromIFrame } from 'helpers/cityAccountToken'
import React, { useCallback, useEffect, useState } from 'react'
import { useEffectOnce, useLocalStorage } from 'usehooks-ts'
import jwtDecode, { JwtPayload } from 'jwt-decode'
import logger from 'helpers/logger'

export type CityAccountAccessTokenAuthenticationStatus =
  | 'initializing'
  | 'authenticated'
  | 'unauthenticated'

interface CityAccountAccessTokenState {
  status: CityAccountAccessTokenAuthenticationStatus
  accessToken: string | null
  sub: string | undefined
  refreshToken: () => void
}

export const ACCESS_TOKEN_STORAGE_KEY = 'cognitoAccessToken'

const CityAccountAccessTokenContext = React.createContext<CityAccountAccessTokenState>(
  {} as CityAccountAccessTokenState,
)

export const CityAccountAccessTokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [initializationState, setInitializationState] = useState<'idle' | 'initializing' | 'ready'>(
    'idle',
  )
  // unfortunately useLocalStorage expects JSON-serializable object, therefore not storing as simple string
  const [accessTokenState, setAccessTokenState] = useLocalStorage<{ accessToken: string | null }>(
    ACCESS_TOKEN_STORAGE_KEY,
    { accessToken: null },
  )

  const accessToken = accessTokenState.accessToken
  let jwtAccessToken = null
  try {
    jwtAccessToken = accessToken ? jwtDecode<JwtPayload>(accessToken) : null
  } catch (error) {
    // since the token is validated every time before our code stores it this shouldn't happen
    logger.error('Invalid token found in local storage:', accessToken, error)
  }
  let status: CityAccountAccessTokenAuthenticationStatus = 'initializing'
  if (initializationState === 'ready') {
    status = !!jwtAccessToken ? 'authenticated' : 'unauthenticated'
  }

  const refreshToken = useCallback(
    (isInitialRefresh: boolean) =>
      getAccessTokenFromIFrame()
        .then((token) => {
          if (token) {
            setAccessTokenState({ accessToken: token })
          } else if (!isInitialRefresh) {
            setAccessTokenState({ accessToken: null })
          }
          return token
        })
        .catch((error) => {
          logger.error('getAccessTokenFromIFrame error', error)
          return null
        }),
    [setAccessTokenState],
  )

  const validateTokenInLocalStorage = useCallback(() => {
    if (!checkTokenValid(accessToken)) {
      setAccessTokenState({ accessToken: null })
      return null
    } else {
      return accessToken
    }
  }, [accessToken, setAccessTokenState])

  useEffect(() => {
    // prevent stale token in storage, in case iframe refresh does not work
    window.addEventListener('focus', validateTokenInLocalStorage)
    return () => {
      window.removeEventListener('focus', validateTokenInLocalStorage)
    }
  }, [validateTokenInLocalStorage])

  const getTokenFromUrl = useCallback(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      logger.info('Looking for CityAccountAccessToken in query params')
      const tokenFromQuery = urlParams.get('access_token')
      if (checkTokenValid(tokenFromQuery)) {
        logger.info('CityAccountAccessToken found in query params')
        setAccessTokenState({ accessToken: tokenFromQuery })
        // remove token from query params
        const urlWithoutToken = new URL(window.location.href)
        urlWithoutToken.searchParams.delete('access_token')
        window.history.replaceState({}, '', urlWithoutToken.href)
        return tokenFromQuery
      }
    } catch (error) {
      logger.error('Error token from query', error)
    }
    return null
  }, [setAccessTokenState])

  useEffectOnce(() => {
    setInitializationState('initializing')
    validateTokenInLocalStorage()
    // try getting token from iframe - this tends to fail randomly
    refreshToken(true)
      .then((token) => {
        // fallback token in url if coming from login - also clears it from url
        // getTokenFromUrl()
        if (token) {
          // iframe works, refresh from it on refocus
          window.addEventListener('focus', () => refreshToken(false))
        }
      })
      .catch((error) => {
        logger.error('refreshToken error', error)
        // fallback token in url if coming from login
        // getTokenFromUrl()
      })
      .finally(() => {
        setInitializationState('ready')
      })
  })
  // mimicking previous behavior of not rendering children until initialized - if it doesn't break anything major this should be changed
  return (
    <CityAccountAccessTokenContext.Provider
      value={{ sub: jwtAccessToken?.sub, accessToken: accessToken, status, refreshToken }}
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
