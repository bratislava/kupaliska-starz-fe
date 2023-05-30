import { checkTokenValid, getAccessTokenFromIFrame } from 'helpers/cityAccountToken'
import React, { useCallback, useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import jwtDecode, { JwtPayload } from 'jwt-decode'

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
    // TODO send to faro
    console.error('Invalid token found in local storage:', accessToken, error)
  }
  let status: CityAccountAccessTokenAuthenticationStatus = 'initializing'
  if (initializationState === 'ready') {
    status = !!jwtAccessToken ? 'authenticated' : 'unauthenticated'
  }

  const refreshToken = useCallback(
    () =>
      getAccessTokenFromIFrame().then((token) => {
        setAccessTokenState({ accessToken: checkTokenValid(token) })
        return token
      }),
    [setAccessTokenState],
  )

  // could be 'useEffectOnce' withou the extra initi logic, but regular useEffect listening on refreshToken ensures we unsubscribe correct eventListener, even if refreshToken implementation changes in the future
  useEffect(() => {
    // if we have token that looks valid in local storage, allow immediate interaction
    if (checkTokenValid(accessToken)) {
      setInitializationState('ready')
    }
    // always refresh on page reload (happens in background if valid token is available in storage)
    if (initializationState === 'idle') {
      setInitializationState('initializing')
      refreshToken().finally(() => setInitializationState('ready'))
    }
    // alway refresh on page refocus
    window.addEventListener('focus', refreshToken)
    return () => window.removeEventListener('focus', refreshToken)
  }, [accessToken, initializationState, refreshToken])
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
