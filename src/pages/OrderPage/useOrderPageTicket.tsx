import { TicketType } from '../../models'
import { createContext, PropsWithChildren, useContext } from 'react'
import useCityAccountAccessToken from '../../hooks/useCityAccount'
import { useQuery } from 'react-query'
import { fetchUser } from '../../store/user/api'

export interface OrderPageTicket {
  ticketType: TicketType
  requireEmail: boolean
  hasOptionalFields: boolean
  hasSwimmers: boolean
  hasTicketAmount: boolean
  displayMissingInformationWarning: boolean
  sendDisabled: boolean
  isSeniorOrDisabledTicket: boolean
  hasNameRequired: boolean
}

const Context = createContext<
  | {
      ticketTypesWithAdditionalProperties: OrderPageTicket[]
      orderData: { ticketTypeId: string; ticketAmount?: number }[]
    }
  | undefined
>(undefined)

export const OrderPageTicketProvider = ({
  ticketTypes,
  orderData,
  children,
}: PropsWithChildren<{
  ticketTypes: TicketType[]
  orderData: { ticketTypeId: string; ticketAmount?: number }[]
}>) => {
  const { status } = useCityAccountAccessToken()

  const hasAccount = status === 'authenticated'

  const ticketTypesWithAdditionalData = ticketTypes.map((ticketType) => {
    return {
      ticketType,
      hasSwimmers: ticketType.nameRequired,
      hasNameRequired: ticketType.nameRequired,
      hasOptionalFields: !ticketType.nameRequired && !hasAccount,
      hasTicketAmount: !ticketType.nameRequired,
      isSeniorOrDisabledTicket: ticketType.isSeniorIsDisabled,
    }
  })

  const someTicketTypeHasSwimmers = ticketTypesWithAdditionalData.some(
    (ticketType) => ticketType.hasSwimmers
  )

  const userQuery = useQuery({
    // TODO add all variables for this query to the query key
    // should `someTicketTypeHasSwimmers` be included?
    queryKey: ['user'],
    queryFn: fetchUser,
    enabled: someTicketTypeHasSwimmers,
  })

  const ticketTypesWithAdditionalProperties = ticketTypesWithAdditionalData.map(
    (ticketTypeWithAdditionalData) => {
      const displayMissingInformationWarning =
        ticketTypeWithAdditionalData.hasSwimmers && userQuery.data?.data
          ? userQuery.data.data.image == null || userQuery.data.data.age == null
          : false
      const userQueryNotLoadedIfNeeded = ticketTypeWithAdditionalData.hasSwimmers && !userQuery.data

      return {
        ...ticketTypeWithAdditionalData,
        // TODO remove this from ticketType data, it has nothing to do with the ticket type,
        // it only depends on the presence of the user account
        requireEmail: !hasAccount,
        displayMissingInformationWarning,
        userQueryNotLoadedIfNeeded,
        sendDisabled: displayMissingInformationWarning || userQueryNotLoadedIfNeeded,
      }
    }
  )

  return (
    <Context.Provider value={{ ticketTypesWithAdditionalProperties, orderData }}>
      {children}
    </Context.Provider>
  )
}

export const useOrderPageTicket = () => {
  const orderPageTicket = useContext(Context)
  if (orderPageTicket === undefined) {
    throw new Error('useOrderPageTicket must be used within a OrderPageTicketProvider')
  }

  return orderPageTicket
}
