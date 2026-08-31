import TicketTypeDetail, {
  TicketTypeDetailProps,
} from 'components/TicketTypeDetail/TicketTypeDetail'
import { CartItem } from 'models/order'
import { OrderFormData } from 'pages/OrderPage/OrderPage'
import { OrderPageTicket } from 'pages/OrderPage/useOrderPageTicket'
import { UseFormSetValue } from 'react-hook-form'

export interface TicketTypesDetailProps extends Omit<
  TicketTypeDetailProps,
  'ticketType' | 'hasTicketAmount' | 'setTicketAmount' | 'handleTicketTypeRemove' | 'ticketAmount'
> {
  ticketTypesData: CartItem[]
  ticketTypesWithAdditionalProperties: OrderPageTicket[]
  setValue: UseFormSetValue<OrderFormData>
  setTicketAmountOfTicketType: (ticketAmount: number, cartItem: CartItem) => void
}

const TicketTypesDetail = ({
  ticketTypesData,
  ticketTypesWithAdditionalProperties,
  setValue,
  setTicketAmountOfTicketType,
  ...rest
}: TicketTypesDetailProps) => {
  return ticketTypesData.map((ticketTypeData) => {
    const { ticketType, ticketAmount } = ticketTypeData

    const handleTicketTypeRemove =
      ticketTypesData.length > 1
        ? () => {
            // this will remove the ticket type from the form data
            // but it will reappear after reloading the page because it ultimately comes from location state
            // TODO fix this when cart is implemented using redux
            setValue(
              'ticketTypesData',
              ticketTypesData.filter(
                (ticketTypeDataInner) => ticketTypeDataInner.ticketType.id !== ticketType.id,
              ),
            )
          }
        : undefined

    return (
      <TicketTypeDetail
        key={ticketType.id}
        {...rest}
        ticketAmount={ticketAmount}
        ticketType={ticketType}
        hasTicketAmount={
          ticketTypesWithAdditionalProperties.find(
            (ticketTypeAdditional) => ticketTypeAdditional.ticketType.id === ticketType.id,
          )?.hasTicketAmount ?? false
        }
        handleTicketTypeRemove={handleTicketTypeRemove}
        setTicketAmount={(value: number) => setTicketAmountOfTicketType(value, ticketTypeData)}
      />
    )
  })
}

export default TicketTypesDetail
