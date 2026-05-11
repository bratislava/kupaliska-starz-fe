import { Navigate, useLocation } from 'react-router'
import OrderPage from './OrderPage'
import useCityAccountAccessToken from '../../hooks/useCityAccount'
import { TicketType } from '../../models'
import { useAppSelector } from '../../hooks'
import { selectAvailableTicketTypes } from '../../store/global'
import { OrderPageTicketProvider } from './useOrderPageTicket'
import { ROUTES } from 'helpers/constants'

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

  const ticketTypeId = location?.state?.ticketTypeId as string | undefined
  if (!ticketTypeId) {
    return <Navigate to={ROUTES.HOME} replace />
  }
  const ticketType = ticketTypes.find((ticketType: TicketType) => ticketType.id === ticketTypeId)
  if (!ticketType) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  if (ticketType.disabled) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  const requiresLoginAndIsNotLoggedIn = ticketType.nameRequired && !hasAccount
  if (requiresLoginAndIsNotLoggedIn) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return (
    <OrderPageTicketProvider ticketType={ticketType}>
      <OrderPage />
    </OrderPageTicketProvider>
  )
}

export default OrderPageGuard
