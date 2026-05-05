import React from 'react'
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

const Context = createContext<OrderPageTicket | undefined>(undefined)

export const OrderPageTicketProvider = ({
  ticketType,
  children,
}: PropsWithChildren<{ ticketType: TicketType }>) => {
  const { status } = useCityAccountAccessToken()

  const hasAccount = status === 'authenticated'

  const hasSwimmers = ticketType.nameRequired
  const hasNameRequired = ticketType.nameRequired
  const userQuery = useQuery('user', fetchUser, { enabled: hasSwimmers })
  const requireEmail = !hasAccount
  const hasOptionalFields = !ticketType.nameRequired && !hasAccount
  const hasTicketAmount = !ticketType.nameRequired
  const displayMissingInformationWarning =
    hasSwimmers && userQuery.data?.data
      ? userQuery.data.data.image == null || userQuery.data.data.age == null
      : false
  const userQueryNotLoadedIfNeeded = hasSwimmers && !userQuery.data
  const sendDisabled = displayMissingInformationWarning || userQueryNotLoadedIfNeeded
  const isSeniorOrDisabledTicket = ticketType.isSeniorIsDisabled

  return (
    <Context.Provider
      value={{
        ticketType,
        requireEmail,
        hasOptionalFields,
        hasSwimmers,
        hasTicketAmount,
        displayMissingInformationWarning,
        sendDisabled,
        isSeniorOrDisabledTicket,
        hasNameRequired,
      }}
    >
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
