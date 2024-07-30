import React from 'react'
import { Ticket } from '../../models'
import { createContext, PropsWithChildren, useContext } from 'react'
import useCityAccountAccessToken from '../../hooks/useCityAccount'
import { useQuery } from 'react-query'
import { fetchUser } from '../../store/user/api'

export interface OrderPageTicket {
  ticket: Ticket
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
  ticket,
  children,
}: PropsWithChildren<{ ticket: Ticket }>) => {
  const { status } = useCityAccountAccessToken()

  const hasAccount = status === 'authenticated'

  const hasSwimmers = ticket.nameRequired
  const hasNameRequired = ticket.nameRequired
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
  const isSeniorOrDisabledTicket = ticket.isSeniorIsDisabled

  return (
    <Context.Provider
      value={{
        ticket,
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
