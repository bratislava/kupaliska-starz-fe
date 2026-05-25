import { times } from 'lodash'
import { TicketType } from 'models/order'
import { OrderFormData } from './OrderPage'

export interface OrderFormTicketTypeData {
  ticketType?: TicketType
  ticketAmount?: number
  selectedSwimmerIds?: (string | null)[]
  hasOptionalFields?: boolean
  hasSwimmers?: boolean
  requireEmail?: boolean
}

export function orderFormToRequests(
  formData: Omit<OrderFormData, 'ticketTypesData'> & { ticketTypesData: OrderFormTicketTypeData[] },
) {
  const { discountCode, ticketTypesData, age, zip, email, agreement, recaptchaToken } = formData

  let getPriceRequest = {} as any
  let orderRequest = {} as any

  if (discountCode) {
    getPriceRequest.discountPercent = discountCode.amount
    orderRequest.discountCode = discountCode.code
  }

  const tickets = ticketTypesData
    .map((ticketTypeData) => {
      const { ticketType, ticketAmount, selectedSwimmerIds, hasOptionalFields } = ticketTypeData

      const ticketsWithSelectedSwimmerIds = selectedSwimmerIds?.map((id) => ({
        personId: id,
        ticketTypeId: ticketType?.id,
      }))
      const ticketsWithAdditionalData = times(ticketAmount!, () =>
        hasOptionalFields
          ? {
              age: age ?? null,
              zip: zip ?? null,
              ticketTypeId: ticketType?.id,
            }
          : { personId: null, ticketTypeId: ticketType?.id },
      )
      return [...(ticketsWithSelectedSwimmerIds ?? []), ...ticketsWithAdditionalData]
    })
    .flat()

  getPriceRequest.tickets = tickets
  orderRequest.tickets = tickets

  if (ticketTypesData.some((ticketTypeData) => ticketTypeData.requireEmail)) {
    orderRequest.email = email
  }
  orderRequest.agreement = agreement === 'true'
  orderRequest.token = recaptchaToken

  return { getPriceRequest, orderRequest }
}
