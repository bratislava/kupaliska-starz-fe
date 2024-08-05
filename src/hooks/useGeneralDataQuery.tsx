import { useQuery } from 'react-query'
import { AxiosError } from 'axios'
import { ErrorWithMessages, useErrorToast } from './useErrorToast'
import { fetchGeneral } from 'store/global/api'

export const useGeneralDataQuery = () => {
  const { dispatchErrorToastForHttpRequest } = useErrorToast()
  return useQuery('generalData', fetchGeneral, {
    onError: (err) => {
      dispatchErrorToastForHttpRequest(err as AxiosError<ErrorWithMessages>)
    },
  })
}
