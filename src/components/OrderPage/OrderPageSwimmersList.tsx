import cx from 'classnames'
import { AssociatedSwimmer } from '../../store/associatedSwimmers/api'
import { Button as AriaButton, Checkbox } from 'react-aria-components'
import { Icon } from '../index'
import { useTranslation } from 'react-i18next'
import { useOrderPageTicket } from '../../pages/OrderPage/useOrderPageTicket'

type LoggedInUser = {
  id: null
  age: number | null
  zip: string | null
  image: string | null
  firstname: string
  lastname: string
  isPhysicalEntity: boolean
}
type OrderPageSwimmersListSwimmer = AssociatedSwimmer | LoggedInUser

type OrderPageSwimmersListProps = {
  selectedSwimmerIds: (string | null)[]
  swimmers: OrderPageSwimmersListSwimmer[]
  onSelectSwimmer?: (swimmer: OrderPageSwimmersListSwimmer) => void
  onAddSwimmer?: () => void
}

export const isLoggedInUser = (swimmer: OrderPageSwimmersListSwimmer): swimmer is LoggedInUser => {
  return 'isPhysicalEntity' in swimmer
}

const OrderPageSwimmersList = ({
  selectedSwimmerIds,
  swimmers,
  onSelectSwimmer = () => {},
  onAddSwimmer = () => {},
}: OrderPageSwimmersListProps) => {
  const { ticketTypesWithAdditionalProperties } = useOrderPageTicket()
  // TODO this should be calculated for ticketTypes where OrderPageSwimmersList is used not for all ticketTypes,
  // however, for now it's fine because user can't get to state where OrderPageSwimmersList is used and there is other ticketType in order
  const isSeniorOrDisabledTicket = ticketTypesWithAdditionalProperties.some(
    (ticketType) => ticketType.isSeniorOrDisabledTicket,
  )

  const hasNameRequired = ticketTypesWithAdditionalProperties.some(
    (ticketType) => ticketType.hasNameRequired,
  )

  const isDisabledCheckbox = (swimmer: OrderPageSwimmersListSwimmer) =>
    hasNameRequired && swimmer.id == null && isLoggedInUser(swimmer) && !swimmer.isPhysicalEntity

  const { t } = useTranslation()
  return (
    <div className="gap-3 flex flex-col pt-3">
      {swimmers.map((swimmer) => (
        <>
          <Checkbox
            className={cx('px-4 py-3 gap-4 flex items-center rounded-lg cursor-pointer', {
              'bg-white': !isDisabledCheckbox(swimmer),
              'bg-inactive': isDisabledCheckbox(swimmer),
            })}
            key={swimmer.id}
            isSelected={selectedSwimmerIds?.includes(swimmer.id)}
            onChange={() => onSelectSwimmer(swimmer)}
            isDisabled={isDisabledCheckbox(swimmer)}
          >
            <div
              className="h-14 w-12 bg-cover bg-center rounded-lg bg-backgroundGray shrink-0"
              style={{
                backgroundImage: swimmer.image ? `url(${swimmer.image})` : undefined,
              }}
            ></div>
            <div className="flex flex-col flex-grow">
              <p className="font-semibold">
                {swimmer.firstname} {swimmer.lastname}
              </p>
              <p className="text-sm">
                {swimmer.age != null &&
                  t('common.age-interval', { postProcess: 'interval', count: swimmer.age })}
              </p>
            </div>
            <div className="react-aria-checkbox" />
          </Checkbox>
          {/* TODO errors everywhere, refactor */}
          {isDisabledCheckbox(swimmer) && t('common.physical-person-only')}
        </>
      ))}
      <AriaButton
        onPress={() => onAddSwimmer()}
        className="flex items-center font-semibold px-3 py-2 self-start"
      >
        <Icon name="plus" className="mr-2 no-fill text-gray-700" />
        {isSeniorOrDisabledTicket
          ? 'Pridať osobu (senior alebo ŤZP/ŤZP-S)'
          : 'Pridať dieťa / dospelú osobu'}
      </AriaButton>
    </div>
  )
}

export default OrderPageSwimmersList
