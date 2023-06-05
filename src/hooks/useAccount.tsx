import { getAccount } from 'helpers/cityAccountApi'
import { useQuery } from 'react-query'
import useCityAccount from './useCityAccount'
import { useEffect } from 'react'
import { faro } from 'helpers/logger'

export const useAccount = () => {
  const { sub, status, accessToken } = useCityAccount()
  const query = useQuery(['userData', sub], () => getAccount(accessToken as string), {
    enabled: status === 'authenticated',
  })

  useEffect(() => {
    if (query?.data?.sub) {
      faro?.api?.setUser({ id: query.data.sub, email: query.data.email })
    }
  }, [query?.data?.email, query?.data?.sub])

  return { ...query, isLoading: query.isLoading || status === 'initializing' }
}
