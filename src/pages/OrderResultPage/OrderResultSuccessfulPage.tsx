import OrderSuccess from 'components/OrderSuccess/OrderSuccess'
import { ROUTES } from 'helpers/constants'
import qs from 'qs'
import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useLocation } from 'react-router'

import { Spinner } from '../../components'
import { useErrorToast } from '../../hooks/useErrorToast'
import { getFinalOrder } from '../../store/order/api'

interface Params {
  success?: string
  orderId?: string
  orderAccessToken?: string
}

const OrderResultPage = () => {
  const history = useHistory()
  const { dispatchErrorToast } = useErrorToast()

  const location = useLocation()
  const params = qs.parse(location.search.substring(1)) as Params
  const query = useQuery(
    ['FinalOrder', params],
    async () => getFinalOrder(params.orderId!, params.orderAccessToken!),
    { staleTime: Infinity, onError: () => dispatchErrorToast() },
  )

  useEffect(() => {
    if (!params.orderId || !params.orderAccessToken) {
      history.push(ROUTES.ORDER_UNSUCCESSFUL)
    }
  }, [params, history])

  return (
    <div className="bg-sunscreen grow">
      {query.isLoading && (
        <div className="flex items-center justify-center py-8">
          <Spinner />
        </div>
      )}
      {query.data && <OrderSuccess response={query.data.data} />}
    </div>
  )
}

export default OrderResultPage
