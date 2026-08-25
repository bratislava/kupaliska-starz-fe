import TicketTypeDetail from 'components/TicketTypeDetail/TicketTypeDetail'
import { CartItem } from 'models/order'
import { OrderFormData } from 'pages/OrderPage/OrderPage'
import { OrderPageTicket } from 'pages/OrderPage/useOrderPageTicket'
import { UseFormSetValue } from 'react-hook-form'

export interface TicketTypesDetailProps {
  ticketTypesData: CartItem[]
  isFetching: boolean
  isSuccess: boolean
  ticketTypesWithAdditionalProperties: OrderPageTicket[]
  adultCount?: number
  childrenCount?: number
  setValue: UseFormSetValue<OrderFormData>
  setTicketAmountOfTicketType: (ticketAmount: number, cartItem: CartItem) => void
}
const TicketTypesDetail = ({
  ticketTypesData,
  isFetching,
  isSuccess,
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
        isFetching={isFetching}
        isSuccess={isSuccess}
        adultCount={adultCount}
        childrenCount={childrenCount}
      />
    )
  })
}

export default TicketTypesDetail
