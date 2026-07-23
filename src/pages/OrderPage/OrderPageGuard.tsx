import { ROUTES } from 'helpers/constants'
import { isDefined } from 'helpers/helper'
import { Navigate, useLocation } from 'react-router'

import { useAppSelector } from '../../hooks'
import useCityAccountAccessToken from '../../hooks/useCityAccount'
import { TicketType } from '../../models'
import { selectAvailableTicketTypes } from '../../store/global'
import OrderPage from './OrderPage'
import { OrderPageTicketProvider } from './useOrderPageTicket'

const OrderPageGuard = () => {
  const ticketTypes = useAppSelector(selectAvailableTicketTypes)
  const location = useLocation()
  const searchParamsTicketTypeId = new URLSearchParams(location?.search).get('ticketTypeId')
  const { status } = useCityAccountAccessToken()

  const hasAccount = status === 'authenticated'

  // After the sign-in ticket id is stored in the url. This removes the id from the URL and saves it in the state
  // to be consistent with the default behavior.
  if (searchParamsTicketTypeId) {
    return (
      <Navigate
        to={ROUTES.ORDER}
        state={{ orderData: [{ ticketTypeId: searchParamsTicketTypeId }] }}
        replace
      />
    )
  }

  const orderData = location?.state?.orderData as
    | { ticketTypeId: string; ticketAmount?: number }[]
    | undefined
  if (!orderData) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  // TODO: when type is not present there is typescript error,
  // remove this type later after investigation why is it even needed
  const foundTicketTypes = orderData
    .map((orderTicketType) =>
      ticketTypes.find((ticketType: TicketType) => ticketType.id === orderTicketType.ticketTypeId),
    )
    .filter(isDefined)

  if (foundTicketTypes.length !== orderData.length) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  // disabled tickets should not be allowed to be ordered,
  // we disable ability to click on buttons in HomepageTickets.tsx,
  // so this should never happen
  if (foundTicketTypes.some((ticketType) => ticketType?.disabled)) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  const requiresLoginAndIsNotLoggedIn =
    foundTicketTypes.some((ticketType) => ticketType?.nameRequired) && !hasAccount
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
