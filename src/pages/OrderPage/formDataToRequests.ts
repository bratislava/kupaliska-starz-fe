import { times } from 'lodash'
import { TicketType } from 'models/order'
import { OrderFormData } from './OrderPage'

export interface OrderFormTicketTypeData {
  ticketType?: TicketType
  ticketAmount?: number
  selectedSwimmerIds?: (string | null)[]
  hasOptionalFields?: boolean
  hasSwimmers?: boolean
  hasTicketAmount?: boolean
  requireEmail?: boolean
}

export function orderFormToRequests(
  formData: Omit<OrderFormData, 'ticketTypesData'> & { ticketTypesData: OrderFormTicketTypeData[] },
) {
  let getPriceRequest = {} as any
  let orderRequest = {} as any

  if (formData.discountCode) {
    getPriceRequest.discountPercent = formData.discountCode.amount
    orderRequest.discountCode = formData.discountCode.code
  }

  const tickets = formData.ticketTypesData
    .map((ticketTypeData) => {
      const ticketsWithSelectedSwimmerIds = ticketTypeData.selectedSwimmerIds?.map((id) => ({
        personId: id,
        ticketTypeId: ticketTypeData.ticketType?.id,
      }))
      const ticketsWithAdditionalData = times(ticketTypeData.ticketAmount!, () =>
        ticketTypeData.hasOptionalFields
          ? {
              age: formData.age ?? null,
              zip: formData.zip ?? null,
              ticketTypeId: ticketTypeData.ticketType?.id,
            }
          : { personId: null, ticketTypeId: ticketTypeData.ticketType?.id },
      )
      return [...(ticketsWithSelectedSwimmerIds ?? []), ...ticketsWithAdditionalData]
    })
    .flat()

  getPriceRequest.tickets = tickets
  orderRequest.tickets = tickets

  if (formData.ticketTypesData.some((ticketTypeData) => ticketTypeData.requireEmail)) {
    orderRequest.email = formData.email
  }
  orderRequest.agreement = formData.agreement
  orderRequest.token = formData.recaptchaToken

  return { getPriceRequest, orderRequest }
}
