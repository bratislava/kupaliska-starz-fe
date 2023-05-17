import { redirectToLogout } from 'helpers/cityAccountApi'
import { ACCESS_TOKEN_STORAGE_KEY } from './useCityAccount'

export const useLogout = () => async () => {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
  return redirectToLogout()
}
