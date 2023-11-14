import { getAccount } from 'helpers/cityAccountApi'
import { useQuery } from 'react-query'
import useCityAccount from './useCityAccount'
import { useEffect, useState } from 'react'
import { faro } from 'helpers/logger'

export const useAccount = () => {
  const [refreshed, setRefreshed] = useState(false)
  const { sub, status, accessToken, refreshToken } = useCityAccount()

  const query = useQuery(['userData', sub], () => getAccount(accessToken as string), {
    enabled: status === 'authenticated',
    onError: async () => {
      if (!refreshed) {
        await refreshToken()
        setRefreshed(true)
      }
    },
  })

  useEffect(() => {
    if (query?.data?.sub) {
      faro?.api?.setUser({ id: query.data.sub, email: query.data.email })
    }
  }, [query?.data?.email, query?.data?.sub])

  return { ...query, isLoading: query.isLoading || status === 'initializing' }
}
