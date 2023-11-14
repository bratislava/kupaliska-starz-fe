import axios, { AxiosRequestHeaders } from 'axios'
import qs from 'qs'
import { environment } from '../environment'
import { ACCESS_TOKEN_COOKIE_KEY } from '../hooks/useCityAccount'
import { checkTokenValid } from './cityAccountToken'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

enum WithAccessToken {
  None,
  Required,
  IfAvailable,
}

const getAccessToken = () => {
  const token = cookies.get(ACCESS_TOKEN_COOKIE_KEY)
  if (!token) {
    throw new Error('No access token in cookie storage')
  }

  const parsedToken = JSON.parse(token)
  if (!checkTokenValid(parsedToken?.accessToken)) {
    throw new Error('No access token in cookie storage')
  }

  return parsedToken.accessToken as string
}

const createApiClient = (withAccessToken = WithAccessToken.None) => {
  const newApiClient = axios.create({
    responseType: 'json',
    baseURL: environment.host,
    withCredentials: true,
    paramsSerializer: (params: any) => {
      return qs.stringify(params)
    },
    timeout: 100000,
  })

  newApiClient.interceptors.request.use((config) => {
    ;(config.headers as AxiosRequestHeaders)['Cache-Control'] = 'no-cache'

    return config
  })

  if (withAccessToken === WithAccessToken.Required) {
    newApiClient.interceptors.request.use(async (config) => {
      const accessToken = getAccessToken()
      ;(config.headers as AxiosRequestHeaders)['Authorization'] = `Bearer ${accessToken}`

      return config
    })
  }

  if (withAccessToken === WithAccessToken.IfAvailable) {
    newApiClient.interceptors.request.use(async (config) => {
      try {
        const accessToken = getAccessToken()
        ;(config.headers as AxiosRequestHeaders)['Authorization'] = `Bearer ${accessToken}`
      } catch (e) {}

      return config
    })
  }

  return newApiClient
}

export const apiClient = createApiClient()
export const apiClientWithAccessToken = createApiClient(WithAccessToken.Required)
export const apiClientWithAccessTokenIfAvailable = createApiClient(WithAccessToken.IfAvailable)
