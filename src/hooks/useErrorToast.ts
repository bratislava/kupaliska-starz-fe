import { AxiosError } from 'axios'
import { ErrorWithMessages, getErrorMessagesFromHttpRequest } from 'helpers/general'
import { useTranslation } from 'react-i18next'

import { setToast } from '../store/global'
import { useAppDispatch } from './store'
import useCityAccountAccessToken from './useCityAccount'

export const useErrorToast = () => {
  const dispatch = useAppDispatch()
  const { refreshAccessToken } = useCityAccountAccessToken()
  const { t } = useTranslation()

  const dispatchErrorToast = (message?: string) =>
    dispatch(
      setToast({
        type: 'error',
        message: message ?? t('common.error-generic'),
      }),
    )

  const dispatchErrorToastForHttpRequest = <T extends ErrorWithMessages>(
    error: AxiosError<T>,
    defaultMessage?: string,
  ) => {
    dispatchErrorToast(getErrorMessagesFromHttpRequest(error, defaultMessage))
    // if the error is because of expired access, refreshing solves the issue, if it's not it doesn't hurt
    refreshAccessToken(false)
  }

  return { dispatchErrorToast, dispatchErrorToastForHttpRequest }
}
