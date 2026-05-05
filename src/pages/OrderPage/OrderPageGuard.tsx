import React from 'react'
import { Redirect } from 'react-router'
import { useHistory } from 'react-router-dom'
import OrderPage from './OrderPage'
import useCityAccountAccessToken from '../../hooks/useCityAccount'
import { TicketType } from '../../models'
import { useAppSelector } from '../../hooks'
import { selectAvailableTicketTypes } from '../../store/global'
import { OrderPageTicketProvider } from './useOrderPageTicket'
import { ROUTES } from 'helpers/constants'

const OrderPageGuard = () => {
  const ticketTypes = useAppSelector(selectAvailableTicketTypes)
  const history = useHistory<{ ticketTypeId?: string }>()
  const searchParamsTicketTypeId = new URLSearchParams(history.location.search).get('ticketTypeId')
  const { status } = useCityAccountAccessToken()

  const hasAccount = status === 'authenticated'

  // After the sign-in ticket id is stored in the url. This removes the id from the URL and saves it in the state
  // to be consistent with the default behavior.
  if (searchParamsTicketTypeId) {
    return <Redirect to={{ pathname: ROUTES.ORDER, state: { ticketTypeId: searchParamsTicketTypeId } }} />
  }

  const ticketTypeId = history.location.state?.ticketTypeId
  if (!ticketTypeId) {
    return <Redirect to={ROUTES.HOME} />
  }

  const ticketType = ticketTypes.find((ticketType: TicketType) => ticketType.id === ticketTypeId)
  if (!ticketType) {
    return <Redirect to={ROUTES.HOME} />
  }

  if (ticketType.disabled) {
    return <Redirect to={ROUTES.HOME} />
  }

  const requiresLoginAndIsNotLoggedIn = ticketType.nameRequired && !hasAccount
  if (requiresLoginAndIsNotLoggedIn) {
    return <Redirect to={ROUTES.HOME} />
  }

  return (
    <OrderPageTicketProvider ticketType={ticketType}>
      <OrderPage />
    </OrderPageTicketProvider>
  )
}

export default OrderPageGuard
