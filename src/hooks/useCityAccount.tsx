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
  useEffectOnce(() => {
    logger.info('CityAccountAccessTokenProvider initializationState', initializationState)
    if (initializationState !== 'idle') {
      // keep the refocus event listener with newest refreshToken
      logger.info(
        'THIS SHOULD NOT HAPPEN - CityAccountAccessTokenProvider initializationState',
        initializationState,
      )
      // window.addEventListener('focus', refreshToken)
      // return () => window.removeEventListener('focus', refreshToken)
    }
    setInitializationState('initializing')
    // if we have token that looks valid in local storage, allow immediate interaction
    if (checkTokenValid(accessToken)) {
      logger.info('CityAccountAccessTokenProvider token found in local storage')
      setInitializationState('ready')
    } else {
      // clear invalid token, as a sanity check & to prevent any in-between states
      setAccessTokenState({ accessToken: null })
    }
    logger.info('CityAccountAccessTokenProvider checking token from query params')
    // look for token in query params - this is fallback for browsers which have trouble with iframe
    // TODO passing tokens in query params is not really recommended, rewrite once we do the amplify fix in city-account
    // get access token from query params, failure for any reason continues with iframe approach as usual
    try {
      const urlParams = new URLSearchParams(window.location.search)
      logger.info('CityAccountAccessTokenProvider urlParams', urlParams)
      const tokenFromQuery = urlParams.get('access_token')
      if (checkTokenValid(tokenFromQuery)) {
        logger.info('CityAccountAccessTokenProvider token found in query params')
        setAccessTokenState({ accessToken: tokenFromQuery })
        // remove token from query params
        const urlWithoutToken = new URL(window.location.href)
        urlWithoutToken.searchParams.delete('access_token')
        window.history.replaceState({}, '', urlWithoutToken.href)
        window.addEventListener('focus', refreshToken)
        setInitializationState('ready')
        return () => window.removeEventListener('focus', refreshToken)
      }
    } catch (error) {
      logger.error('Error token from query', error)
    }

    // alway try refreshing from iframe - if one of previous approaches worked this happens in the background
    refreshToken().finally(() => setInitializationState('ready'))
    // alway refresh on page refocus
    window.addEventListener('focus', refreshToken)
    return () => window.removeEventListener('focus', refreshToken)
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
