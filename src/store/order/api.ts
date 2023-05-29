import {
  apiClient,
  apiClientWithAccessToken,
  apiClientWithAccessTokenIfAvailable,
} from 'helpers/apiClient'
import { CheckPriceResponse, OrderRequest } from 'models'
import { CityAccountAccessTokenAuthenticationStatus } from '../../hooks/useCityAccount'

export function order(data: OrderRequest, authStatus: CityAccountAccessTokenAuthenticationStatus) {
  if (authStatus === 'authenticated') {
    return apiClientWithAccessToken.post('/api/v1/orders', data)
  }
  if (authStatus === 'unauthenticated') {
    return apiClient.post('/api/v1/orders/unauthenticated', data)
  }

  return Promise.reject(new Error('Unsupported auth status'))
}

export function getPrice(
  order: any,
  authStatus: CityAccountAccessTokenAuthenticationStatus,
  abortSignal?: AbortSignal,
) {
  if (authStatus === 'authenticated') {
    return apiClientWithAccessToken.post<CheckPriceResponse>('/api/v1/orders/getPrice', order, {
      signal: abortSignal,
    })
  }
  if (authStatus === 'unauthenticated') {
    return apiClient.post<CheckPriceResponse>('/api/v1/orders/getPrice/unauthenticated', order, {
      signal: abortSignal,
    })
  }

  return Promise.reject(new Error('Unsupported auth status'))
}

export interface FinalOrderTicket {
  id: string
  isChildren: boolean
  qrCode: string
  name: string | null
  ticketTypeId: string
}

export interface FinalOrderResponse {
  tickets: FinalOrderTicket[]
  pdf: string
}

export function getFinalOrder(orderId: string, accessToken: string) {
  return apiClientWithAccessTokenIfAvailable.get<FinalOrderResponse>(
    `/api/v1/orders/${orderId}/successful`,
    {
      headers: {
        'Order-Authorization': accessToken,
      },
    },
  )
}

export interface DiscountCodeResponse {
  discountCode: { code: string; amount: number }
}

export function checkDiscountCode(ticketTypeId: string, discountCode: string) {
  return apiClient.get<DiscountCodeResponse>(
    `/api/v1/orders/discountCodes/${discountCode}/ticketTypes/${ticketTypeId}`,
  )
}
