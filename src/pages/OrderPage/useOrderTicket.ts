import { useMemo } from 'react'
import { useAppSelector } from '../../hooks'
import { selectAvailableTickets } from '../../store/global'
import { useHistory } from 'react-router-dom'
import { Ticket } from '../../models'
import { useAccount } from '../../hooks/useAccount'

/* Retrieves the ticket id from history state, gets the ticket, redirects if necessary and return the info needed. */
export const useOrderTicket = () => {
  const tickets = useAppSelector(selectAvailableTickets)
  const { data: account } = useAccount()
  const history = useHistory<{ ticketId?: string }>()
  const hasAccount = Boolean(account)

  return useMemo(() => {
    const ticketId = history.location.state?.ticketId
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
