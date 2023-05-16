import { redirectToLogout } from 'helpers/cityAccountApi'

export const useLogout = () => async () => {
  localStorage.removeItem('accessToken')
  return redirectToLogout()
}
