import { environment } from '../environment'
import { getAccessToken } from './cityAccountToken'
import { CityAccountUser } from './cityAccountDto'

export const UNAUTHORIZED_MESSAGE = 'Unauthorized'

export const cityAccountFrontendSSOUrl = `${environment.cityAccountFrontendUrl}/sso`

export const getAccount = async () => {
  const accessToken = await getAccessToken()
  const result = await fetch(`${environment.cityAccountBackendUrl}/auth/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  if (!result.ok) {
    if (result.status === 401) {
      throw new Error(UNAUTHORIZED_MESSAGE)
    } else {
      // TODO log to faro
      throw new Error('Error fetching account')
    }
  }
  return result.json() as Partial<CityAccountUser>
}

export const redirectToLogin = () => {
  const url = new URL(`${environment.cityAccountFrontendUrl}/login`)
  url.searchParams.set('returnUrl', window.location.href)
  window.location.href = url.toString()
}

export const redirectToLogout = () => {
  const url = new URL(`${environment.cityAccountFrontendUrl}/logout`)
  url.searchParams.set('returnUrl', window.location.href)
  window.location.href = url.toString()
}
