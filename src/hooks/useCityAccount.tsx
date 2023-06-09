import { checkTokenValid, getAccessTokenFromIFrame } from 'helpers/cityAccountToken'
import React, { useCallback, useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
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
    () =>
      getAccessTokenFromIFrame()
        .then((token) => {
          setAccessTokenState({ accessToken: checkTokenValid(token) })
          return token
        })
        .catch((error) => {
          logger.error('getAccessTokenFromIFrame error', error)
        }),
    [setAccessTokenState],
  )

  // could be 'useEffectOnce' without the extra init logic, but regular useEffect listening on refreshToken ensures we unsubscribe correct eventListener, even if refreshToken implementation changes in the future
  useEffect(() => {
    if (initializationState !== 'idle') {
      // keep the refocus event listener with newest refreshToken
      window.addEventListener('focus', refreshToken)
      return () => window.removeEventListener('focus', refreshToken)
    }
    setInitializationState('initializing')
    // if we have token that looks valid in local storage, allow immediate interaction
    if (checkTokenValid(accessToken)) {
      setInitializationState('ready')
    } else {
      // clear invalid token, as a sanity check & to prevent any in-between states
      setAccessTokenState({ accessToken: null })
    }
    // look for token in query params - this is fallback for browsers which have trouble with iframe
    // TODO passing tokens in query params is not really recommended, rewrite once we do the amplify fix in city-account
    // get access token from query params, failure for any reason continues with iframe approach as usual
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const tokenFromQuery = urlParams.get('access_token')
      if (checkTokenValid(tokenFromQuery)) {
        setAccessTokenState({ accessToken: tokenFromQuery })
        // remove token from query params
        urlParams.delete('access_token')
        const urlWithoutToken =
          urlParams.size === 0
            ? window.location.pathname
            : `${window.location.pathname}?${urlParams}`
        window.history.replaceState({}, '', urlWithoutToken)
        setInitializationState('ready')
      }
    } catch (error) {
      logger.error('Error token from query', error)
    }

    // alway try refreshing from iframe - if one of previous approaches worked this happens in the background
    refreshToken().finally(() => setInitializationState('ready'))
    // alway refresh on page refocus
    window.addEventListener('focus', refreshToken)
    return () => window.removeEventListener('focus', refreshToken)
  }, [accessToken, initializationState, refreshToken, setAccessTokenState])
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
