import { AxiosResponse } from 'axios'
import TicketTypeDetail from 'components/TicketTypeDetail/TicketTypeDetail'
import { CartItem, GetPriceResponse } from 'models/order'
import { OrderFormData } from 'pages/OrderPage/OrderPage'
import { OrderPageTicket } from 'pages/OrderPage/useOrderPageTicket'
import { UseFormSetValue } from 'react-hook-form'
import { UseQueryResult } from 'react-query'

interface TicketTypesDetailProps {
  ticketTypesData: CartItem[]
  priceQuery: UseQueryResult<AxiosResponse<GetPriceResponse>>
  ticketTypesWithAdditionalProperties: OrderPageTicket[]
  adultCount?: number
  childrenCount?: number
  setValue: UseFormSetValue<OrderFormData>
  setTicketAmountOfTicketType: (ticketAmount: number, cartItem: CartItem) => void
}
const TicketTypesDetail = ({
  ticketTypesData,
  priceQuery,
  ticketTypesWithAdditionalProperties,
  adultCount,
  childrenCount,
  setValue,
  setTicketAmountOfTicketType,
}: TicketTypesDetailProps) => {
  return ticketTypesData.map((ticketTypeData) => {
    const ticketAmount = ticketTypeData.ticketAmount

    const handleTicketTypeRemove =
      ticketTypesData.length > 1
        ? () => {
            // this will remove the ticket type from the form data
            // but it will reappear after reloading the page because it ultimately comes from location state
            // TODO fix this when cart is implemented using redux
            setValue(
              'ticketTypesData',
              ticketTypesData.filter(
                (ticketTypeDataInner) =>
                  ticketTypeDataInner.ticketType.id !== ticketTypeData.ticketType.id,
              ),
            )
          }
        : undefined

    return (
      <TicketTypeDetail
        key={ticketTypeData.ticketType.id}
        ticketAmount={ticketAmount}
        ticketType={ticketTypeData.ticketType}
        hasTicketAmount={
          ticketTypesWithAdditionalProperties.find(
            (ticketType) => ticketType.ticketType.id === ticketTypeData.ticketType.id,
          )?.hasTicketAmount ?? false
        }
        handleTicketTypeRemove={handleTicketTypeRemove}
        setTicketAmount={(value: number) => setTicketAmountOfTicketType(value, ticketTypeData)}
        isFetching={priceQuery.isFetching}
        isSuccess={priceQuery.isSuccess}
        adultCount={adultCount}
        childrenCount={childrenCount}
      />
    )
  })
}

export default TicketTypesDetail
