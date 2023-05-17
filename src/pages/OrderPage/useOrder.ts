import to from 'await-to-js'
import { order } from '../../store/order/api'
import { useErrorToast } from '../../hooks/useErrorToast'
import { AxiosError, AxiosResponse } from 'axios'
import useCityAccountAccessToken from '../../hooks/useCityAccount'

/* Sends the order request and handles the necessary logic.

Inspired by https://dev.azure.com/bratislava-innovation/Inovacie/_git/kupaliska-starz-fe?path=%2Fsrc%2Fstore%2Forder%2Fthunks.ts */
export const useOrder = () => {
  const { dispatchErrorToast, dispatchErrorToastForHttpRequest } = useErrorToast()
  const { status } = useCityAccountAccessToken()

  // TODO: types
  return async (request: any) => {
    const requestWithRecaptcha = { ...request }

    const [err, response] = await to<AxiosResponse<any>, AxiosError<any>>(
      order(requestWithRecaptcha, status),
    )
    if (response) {
      if (response?.data?.messages[0] && response?.data?.messages[0].type === 'SUCCESS') {
        window.location.href = `${response.data.data.url}?${response.data.data.formurlencoded}`
        return
      } else {
        dispatchErrorToast()
        return
      }
    }

    if (err?.response?.status === 400) {
      dispatchErrorToastForHttpRequest(err, 'Objednávku sa nepodarilo odoslať')
      return
    }

    dispatchErrorToast()
  }
}
