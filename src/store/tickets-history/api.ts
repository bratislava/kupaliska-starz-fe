import { apiClientWithAccessToken } from '../../helpers/apiClient'

export interface TicketFromHistory {
  id: string
  type: string
  remainingEntries: number | null
  ownerName: string
  ownerId: string
  entries: TicketFromHistoryEntry[]
  qrCode: string
  priceWithTax: number
  priceWithoutTax: number
  priceTax: number
  age: number
  ticketColor: TicketColor
  validTo: string
}

export interface TicketFromHistoryEntry {
  id: string
  from: number | null
  to: number | null
  poolName: string
}

export interface TicketColor {
  text: string
  background: string
}

export function fetchTicketsHistory() {
  return apiClientWithAccessToken.get<TicketFromHistory[]>('/api/v1/orders/tickets')
}
