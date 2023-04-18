import to from 'await-to-js'
import { order } from '../../store/order/api'
import { useErrorToast } from '../../hooks/useErrorToast'
import { AxiosError, AxiosResponse } from 'axios'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

/* Sends the order request and handles the necessary logic.

Inspired by https://dev.azure.com/bratislava-innovation/Inovacie/_git/kupaliska-starz-fe?path=%2Fsrc%2Fstore%2Forder%2Fthunks.ts */
export const useOrder = () => {
  const { dispatchErrorToast, dispatchErrorToastForHttpRequest } = useErrorToast()
  const { executeRecaptcha } = useGoogleReCaptcha()

  // TODO: types
  return async (request: any) => {
    if (!executeRecaptcha) {
      dispatchErrorToast('Captcha nie je dostupná.')
      return
    }

    const [recaptchaError, recaptcha] = await to(executeRecaptcha('order'))
    if (recaptchaError) {
      dispatchErrorToast()
      return
    }
    const requestWithRecaptcha = { ...request, recaptcha }

    const [err, response] = await to<AxiosResponse<any>, AxiosError<any>>(
      order(requestWithRecaptcha),
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
