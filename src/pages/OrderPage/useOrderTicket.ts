import { Ticket } from '../../models'
import useCityAccountAccessToken from '../../hooks/useCityAccount'
import { useQuery } from 'react-query'
import { fetchUser } from '../../store/user/api'

export const useOrderTicket = (ticket: Ticket) => {
  const { status } = useCityAccountAccessToken()

  const hasAccount = status === 'authenticated'

  const hasSwimmers = ticket.nameRequired
  const userQuery = useQuery('user', fetchUser, { enabled: hasSwimmers })
  const requireEmail = !hasAccount
  const hasOptionalFields = !ticket.nameRequired && !hasAccount
  const hasTicketAmount = !ticket.nameRequired
  const displayMissingInformationWarning =
    hasSwimmers && userQuery.data?.data
      ? userQuery.data.data.image == null || userQuery.data.data.age == null
      : false
  const userQueryNotLoadedIfNeeded = hasSwimmers && !userQuery.data
  const sendDisabled = displayMissingInformationWarning || userQueryNotLoadedIfNeeded

  return {
    ticket,
    requireEmail,
    hasOptionalFields,
    hasSwimmers,
    hasTicketAmount,
    displayMissingInformationWarning,
    sendDisabled,
  }
}
