import { redirectToLogout } from 'helpers/cityAccountApi'

export const useLogout = () => async () => {
  return redirectToLogout()
}
