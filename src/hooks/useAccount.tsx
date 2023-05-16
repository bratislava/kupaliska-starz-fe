import { getAccount } from 'helpers/cityAccountApi'
import { useQuery } from 'react-query'
import useCityAccount from './useCityAccount'

export const useAccount = () => {
  const { sub, status, accessToken } = useCityAccount()
  const query = useQuery(['userData', sub], () => getAccount(accessToken as string), {
    enabled: status === 'authenticated',
  })
  return { ...query, isLoading: query.isLoading || status === 'initializing' }
}
