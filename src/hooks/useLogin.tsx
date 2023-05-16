import { redirectToLogin } from 'helpers/cityAccountApi'

export const useLogin = () => async () => redirectToLogin()
