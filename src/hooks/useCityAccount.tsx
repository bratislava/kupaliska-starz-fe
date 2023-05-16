import { checkTokenValid, getAccessTokenFromIFrame } from 'helpers/cityAccountToken'
import React, { useState } from 'react'
import { useEffectOnce, useLocalStorage } from 'usehooks-ts'
import jwtDecode, { JwtPayload } from 'jwt-decode'

type CityAccountAccessTokenAuthenticationStatus =
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
  const [isInitializing, setIsInitializing] = useState(true)
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
  if (!isInitializing) {
    status = !!jwtAccessToken ? 'authenticated' : 'unauthenticated'
  }

  const refreshToken = () =>
    getAccessTokenFromIFrame().then((token) => {
      setAccessTokenState({ accessToken: checkTokenValid(token) })
      return token
    })

  useEffectOnce(() => {
    // if we already token that looks valid in local storage, don't refresh
    if (checkTokenValid(accessToken)) {
      setIsInitializing(false)
    } else {
      refreshToken().finally(() => setIsInitializing(false))
    }
  })
  // mimicking previous behavior of not rendering children until initialized - if it doesn't break anything major this should be changed
  return (
    <CityAccountAccessTokenContext.Provider
      value={{ sub: jwtAccessToken?.sub, accessToken: accessToken, status, refreshToken }}
    >
      {isInitializing ? null : children}
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
