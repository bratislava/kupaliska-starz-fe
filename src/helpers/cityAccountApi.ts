import { environment } from '../environment'
import { getAccessToken } from './amplify'

export const UNAUTHORIZED_MESSAGE = 'Unauthorized'

// more as a reference than something you should rely upon
export interface CityAccountUser {
  Enabled: boolean
  UserCreateDate: string
  UserLastModifiedDate: string
  UserStatus: string
  address: string
  'custom:sing_in_at': string
  'custom:tier': string
  email: string
  email_verified: string
  family_name: string
  given_name: string
  idUser: string
  phone_number: string
  phone_number_verified: string
  sub: string
}

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
      // TOOD better error handling
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
