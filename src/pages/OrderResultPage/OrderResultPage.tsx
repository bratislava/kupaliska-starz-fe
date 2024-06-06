import React, { PropsWithChildren } from 'react'
import { getFinalOrder } from '../../store/order/api'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router'
import OrderFailure from '../../components/OrderFailure/OrderFailure'
import OrderSuccess from 'components/OrderSuccess/OrderSuccess'
import qs from 'qs'
import { useErrorToast } from '../../hooks/useErrorToast'
import { Spinner } from '../../components'

type Params = {
  success?: string
  orderId?: string
  orderAccessToken?: string
}

const WithParams = ({ params }: { params: Params }) => {
  const { dispatchErrorToast } = useErrorToast()

  const query = useQuery(
    ['FinalOrder', params],
    () => getFinalOrder(params.orderId!, params.orderAccessToken!),
    { staleTime: Infinity, onError: () => dispatchErrorToast() },
  )

  if (query.isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    )
  }

  if (query.data) {
    return <OrderSuccess response={query.data.data} />
  }

  return null
}

const PageWrapper = ({ children }: PropsWithChildren<{}>) => {
  return <main className="bg-sunscreen grow">{children}</main>
}

const OrderResultPage = () => {
  const location = useLocation()
  const params = qs.parse(location.search.substring(1)) as Params
  const showFailure = params.success !== 'true' || !params.orderId || !params.orderAccessToken

  return (
    <PageWrapper>{showFailure ? <OrderFailure /> : <WithParams params={params} />}</PageWrapper>
  )
}

export default OrderResultPage
