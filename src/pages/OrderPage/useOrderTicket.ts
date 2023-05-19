import { useMemo } from 'react'
import { useAppSelector } from '../../hooks'
import { selectAvailableTickets } from '../../store/global'
import { useHistory } from 'react-router-dom'
import { Ticket } from '../../models'
import { useAccount } from '../../hooks/useAccount'
import { useLocation } from 'react-router'

/* Retrieves the ticket id from history state, gets the ticket, redirects if necessary and return the info needed. */
export const useOrderTicket = () => {
  const tickets = useAppSelector(selectAvailableTickets)
  const { data: account } = useAccount()
  const history = useHistory<{ ticketId?: string }>()
  const location = useLocation()

  const hasAccount = Boolean(account)

  return useMemo(() => {
    const searchParamsTicketId = new URLSearchParams(history.location.search).get('ticketId')
    if (searchParamsTicketId) {
      const { pathname } = location
      // Removes the ticketId from the url and moves it to history state
      history.replace(pathname, { ticketId: searchParamsTicketId })
    }

    const ticketId = searchParamsTicketId ?? history.location.state?.ticketId
    if (!ticketId) {
      history.push('/')
      return {}
    }

    const ticket = tickets.find((t: Ticket) => t.id === ticketId)
    if (!ticket) {
      history.push('/')
      return {}
    }

    if (ticket.disabled) {
      history.push('/')
      return {}
    }

    const requiresLoginAndIsNotLoggedIn = ticket.nameRequired && !hasAccount
    if (requiresLoginAndIsNotLoggedIn) {
      history.push('/')
      return {}
    }

    const requireEmail = !hasAccount
    const hasOptionalFields = !ticket.nameRequired && !hasAccount
    const hasSwimmers = ticket.nameRequired
    const hasTicketAmount = !ticket.nameRequired
    return {
      ticket,
      requireEmail,
      hasOptionalFields,
      hasSwimmers,
      hasTicketAmount,
    }
  }, [hasAccount, history, location, tickets])
}
