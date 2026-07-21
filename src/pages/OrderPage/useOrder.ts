import to from 'await-to-js'
import { AxiosError, AxiosResponse } from 'axios'
import { PaymentMethod } from 'helpers/types'

import useCityAccountAccessToken from '../../hooks/useCityAccount'
import { useErrorToast } from '../../hooks/useErrorToast'
import { order } from '../../store/order/api'

/* Sends the order request and handles the necessary logic.

Inspired by https://dev.azure.com/bratislava-innovation/Inovacie/_git/kupaliska-starz-fe?path=%2Fsrc%2Fstore%2Forder%2Fthunks.ts */
export const useOrder = () => {
  const { dispatchErrorToast, dispatchErrorToastForHttpRequest } = useErrorToast()
  const { status } = useCityAccountAccessToken()

  // TODO: types
  return async (request: any, paymentMethod?: PaymentMethod) => {
    const requestWithRecaptcha = { ...request, paymentMethod }

    const [err, response] = await to<AxiosResponse, AxiosError<any>>(
      order(requestWithRecaptcha, status),
    )
    if (response) {
      if (response?.data?.messages[0] && response?.data?.messages[0].type === 'SUCCESS') {
        window.location.href = `${response.data.data.url}?${response.data.data.formurlencoded}`

        return
      }
      dispatchErrorToast()

      return
    }

    if (err?.response?.status === 400) {
      dispatchErrorToastForHttpRequest(err, 'Objednávku sa nepodarilo odoslať')

      return
    }

    dispatchErrorToast()
  }
}
