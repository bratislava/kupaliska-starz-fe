import { Navigate, useLocation } from 'react-router'
import OrderPage from './OrderPage'
import useCityAccountAccessToken from '../../hooks/useCityAccount'
import { TicketType } from '../../models'
import { useAppSelector } from '../../hooks'
import { selectAvailableTicketTypes } from '../../store/global'
import { OrderPageTicketProvider } from './useOrderPageTicket'
import { ROUTES } from 'helpers/constants'
import { isDefined } from 'helpers/helper'

const OrderPageGuard = () => {
  const ticketTypes = useAppSelector(selectAvailableTicketTypes)
  const location = useLocation()
  const searchParamsTicketTypeId = new URLSearchParams(location?.search).get('ticketTypeId')
  const { status } = useCityAccountAccessToken()

  const hasAccount = status === 'authenticated'

  // After the sign-in ticket id is stored in the url. This removes the id from the URL and saves it in the state
  // to be consistent with the default behavior.
  if (searchParamsTicketTypeId) {
    return <Navigate to={ROUTES.ORDER} state={{ ticketTypeId: searchParamsTicketTypeId }} replace />
  }

  const orderData = location?.state?.orderData as { ticketTypeId: string, ticketAmount?: number }[] | undefined
  if (!orderData) {
    return <Navigate to={ROUTES.HOME} replace />
  }
  const foundTicketTypes = orderData.map((orderTicketType) => ticketTypes.find((ticketType: TicketType) => ticketType.id === orderTicketType.ticketTypeId)).filter(isDefined)

  if (foundTicketTypes.length !== orderData.length) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  if (foundTicketTypes.some((ticketType) => ticketType?.disabled)) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  const requiresLoginAndIsNotLoggedIn = foundTicketTypes.some((ticketType) => ticketType?.nameRequired) && !hasAccount
  if (requiresLoginAndIsNotLoggedIn) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return (
    <OrderPageTicketProvider ticketTypes={foundTicketTypes} orderData={orderData}>
      <OrderPage />
    </OrderPageTicketProvider>
  )
}

export default OrderPageGuard
