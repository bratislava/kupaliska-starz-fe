import axios, { AxiosRequestHeaders } from 'axios'
import qs from 'qs'
import { environment } from '../environment'
import { getMsalIdToken } from './getMsalIdToken'
import { msalInstance } from '../msalInstance'

enum WithMsal {
  None,
  Required,
  IfAvailable,
}

const createApiClient = (withMsal = WithMsal.None) => {
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

  if (withMsal === WithMsal.Required) {
    newApiClient.interceptors.request.use(async (config) => {
      const msalIdToken = await getMsalIdToken()
      ;(config.headers as AxiosRequestHeaders)['Authorization'] = `Bearer ${msalIdToken}`

      return config
    })
  }

  if (withMsal === WithMsal.IfAvailable) {
    newApiClient.interceptors.request.use(async (config) => {
      const hasAccount = msalInstance.getActiveAccount()
      if (!hasAccount) {
        return config
      }

      const msalIdToken = await getMsalIdToken()
      ;(config.headers as AxiosRequestHeaders)['Authorization'] = `Bearer ${msalIdToken}`

      return config
    })
  }

  return newApiClient
}

export const apiClient = createApiClient()
export const apiClientWithMsal = createApiClient(WithMsal.Required)
export const apiClientWithMsalIfAvailable = createApiClient(WithMsal.IfAvailable)
