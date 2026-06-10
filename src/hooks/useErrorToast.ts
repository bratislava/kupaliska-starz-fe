import { setToast } from '../store/global'
import { useAppDispatch } from './store'
import { AxiosError } from 'axios'
import useCityAccountAccessToken from './useCityAccount'
import { ErrorWithMessages, getErrorMessagesFromHttpRequest } from 'helpers/general'

export const useErrorToast = () => {
  const dispatch = useAppDispatch()
  const { refreshToken } = useCityAccountAccessToken()

  const dispatchErrorToast = (message?: string) =>
    dispatch(
      setToast({
        type: 'error',
        message: message ?? 'Niečo sa pokazilo. Prosím skúste to neskôr.',
      }),
    )

  const dispatchErrorToastForHttpRequest = <T extends ErrorWithMessages>(
    error: AxiosError<T>,
    defaultMessage?: string,
  ) => {
    dispatchErrorToast(getErrorMessagesFromHttpRequest(error, defaultMessage))
    // if the error is because of expired access, refreshing solves the issue, if it's not it doesn't hurt
    refreshToken()
  }

  return { dispatchErrorToast, dispatchErrorToastForHttpRequest }
}
