import React from 'react'
import { Redirect } from 'react-router'
import { useHistory } from 'react-router-dom'
import OrderPage from './OrderPage'
import useCityAccountAccessToken from '../../hooks/useCityAccount'
import { Ticket } from '../../models'
import { useAppSelector } from '../../hooks'
import { selectAvailableTickets } from '../../store/global'
import { OrderPageTicketProvider } from './useOrderPageTicket'
import { ROUTES } from 'helpers/constants'

const OrderPageGuard = () => {
  const tickets = useAppSelector(selectAvailableTickets)
  const history = useHistory<{ ticketId?: string }>()
  const searchParamsTicketId = new URLSearchParams(history.location.search).get('ticketId')
  const { status } = useCityAccountAccessToken()

  const hasAccount = status === 'authenticated'

  // After the sign-in ticket id is stored in the url. This removes the id from the URL and saves it in the state
  // to be consistent with the default behavior.
  if (searchParamsTicketId) {
    return <Redirect to={{ pathname: ROUTES.ORDER, state: { ticketId: searchParamsTicketId } }} />
  }

  const ticketId = history.location.state?.ticketId
  if (!ticketId) {
    return <Redirect to={ROUTES.HOME} />
  }

  const ticket = tickets.find((t: Ticket) => t.id === ticketId)
  if (!ticket) {
    return <Redirect to={ROUTES.HOME} />
  }

  if (ticket.disabled) {
    return <Redirect to={ROUTES.HOME} />
  }

  const requiresLoginAndIsNotLoggedIn = ticket.nameRequired && !hasAccount
  if (requiresLoginAndIsNotLoggedIn) {
    return <Redirect to={ROUTES.HOME} />
  }

  return (
    <OrderPageTicketProvider ticket={ticket}>
      <OrderPage />
    </OrderPageTicketProvider>
  )
}

export default OrderPageGuard
