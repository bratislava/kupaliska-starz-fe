import { Ticket } from '../../models'
import { times } from 'lodash'
import { OrderFormData } from './OrderPage'

export function orderFormToRequests(
  formData: OrderFormData,
  ticket: Ticket,
  {
    requireEmail,
    hasOptionalFields,
    hasSwimmers,
    hasTicketAmount,
  }: {
    requireEmail: boolean
    hasOptionalFields: boolean
    hasSwimmers: boolean
    hasTicketAmount: boolean
  },
) {
  let getPriceRequest = {} as any
  let orderRequest = {} as any

  getPriceRequest.ticketTypeId = ticket.id
  orderRequest.ticketTypeId = ticket.id

  if (formData.discountCode) {
    getPriceRequest.discountPercent = formData.discountCode.amount
    orderRequest.discountCode = formData.discountCode.code
  }

  if (hasSwimmers) {
    const tickets = formData.selectedSwimmerIds!.map((id) => ({
      personId: id,
    }))
    getPriceRequest.tickets = tickets
    orderRequest.tickets = tickets
  }

  if (hasTicketAmount) {
    const tickets = times(formData.ticketAmount!, () =>
      hasOptionalFields
        ? {
            age: formData.age ?? null,
            zip: formData.zip ?? null,
          }
        : { personId: null },
    )

    getPriceRequest.tickets = tickets
    orderRequest.tickets = tickets
  }
  if (requireEmail) {
    orderRequest.email = formData.email
  }
  orderRequest.agreement = formData.agreement

  return { getPriceRequest, orderRequest }
}
