import { Icon } from 'components'
import AssociatedSwimmerEditAddModal from 'components/AssociatedSwimmerEditAddModal/AssociatedSwimmerEditAddModal'
import OrderMissingInformationProfileModal from 'components/OrderMissingInformationProfileModal/OrderMissingInformationProfileModal'
import OrderPageSwimmersList from 'components/OrderPage/OrderPageSwimmersList'
import { AccountType } from 'helpers/cityAccountDto'
import { useAccount } from 'hooks/useAccount'
import { useErrorToast } from 'hooks/useErrorToast'
import { CartItem } from 'models'
import { useEffect, useMemo, useState } from 'react'
import { Button as AriaButton } from 'react-aria-components'
import { FieldErrors, UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { AssociatedSwimmer, fetchAssociatedSwimmers } from 'store/associatedSwimmers/api'
import { fetchUser } from 'store/user/api'

import { OrderFormData } from './OrderPage'
import { OrderPageTicket } from './useOrderPageTicket'

interface SwimmersListProps {
  errorsTicketTypeData?: FieldErrors<CartItem>[]
  // TODO make incoming setValue more specific then UseFormSetValue<OrderFormData>
  // setValue is only used to set "ticketTypesData" so something like UseFormSetValue<CartItem[]>
  setValue: UseFormSetValue<OrderFormData>
  ticketTypesData: CartItem[]
  ticketTypesWithAdditionalProperties: OrderPageTicket[]
  displayMissingInformationWarning: boolean
}

const SwimmersList = ({
  errorsTicketTypeData,
  setValue,
  ticketTypesData,
  ticketTypesWithAdditionalProperties,
  displayMissingInformationWarning,
}: SwimmersListProps) => {
  const [addSwimmerModalOpen, setAddSwimmerModalOpen] = useState(false)
  const [missingInformationModalOpen, setMissingInformationModalOpen] = useState(false)

  const associatedSwimmersQuery = useQuery('associatedSwimmers', fetchAssociatedSwimmers)
  const userQuery = useQuery('user', fetchUser)
  const { data: account } = useAccount()
  const { dispatchErrorToast } = useErrorToast()
  const { t } = useTranslation()

  /* Merges the list of associated swimmers with the logged-in user. */
  const mergedSwimmers = useMemo(() => {
    const swimmersWithOwner = []
    if (userQuery.data && account?.['custom:account_type'] === AccountType.FO) {
      swimmersWithOwner.push({
        id: null,
        age: userQuery.data.data.age,
        zip: userQuery.data.data.zip,
        image: userQuery.data.data.image,
        firstname: account.given_name as string,
        lastname: account.family_name as string,
        isPhysicalEntity: true,
      })
    }
    if (associatedSwimmersQuery.data) {
      swimmersWithOwner.push(...associatedSwimmersQuery.data.data.associatedSwimmers)
    }

    return swimmersWithOwner
  }, [account, associatedSwimmersQuery.data, userQuery.data])

  const error = associatedSwimmersQuery.error || userQuery.error

  useEffect(() => {
    if (error) {
      dispatchErrorToast()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  const handleSelectSwimmer = (
    swimmerToSelect: Partial<AssociatedSwimmer>,
    ticketTypeId: string,
  ) => {
    // `null` is current user, therefore we don't check for it
    if (swimmerToSelect.id === undefined) {
      return
    }
    const ticketTypeIndex = ticketTypesData.findIndex(
      (ticketTypeData) => ticketTypeData.ticketType.id === ticketTypeId,
    )
    if (ticketTypeIndex !== -1) {
      if (ticketTypesData[ticketTypeIndex].selectedSwimmerIds?.includes(swimmerToSelect.id)) {
        const newTicketTypesData = ticketTypesData.map((ticketTypeData, index) =>
          index === ticketTypeIndex
            ? {
                ...ticketTypeData,
                selectedSwimmerIds: ticketTypeData.selectedSwimmerIds?.filter(
                  (p) => p !== swimmerToSelect.id,
                ),
              }
            : ticketTypeData,
        )

        setValue('ticketTypesData', newTicketTypesData)
      } else {
        const newSelectedSwimmerIds = [
          ...(ticketTypesData[ticketTypeIndex].selectedSwimmerIds || []),
          swimmerToSelect.id,
        ]
        const newTicketTypesData = ticketTypesData.map((ticketTypeData, index) =>
          index === ticketTypeIndex
            ? {
                ...ticketTypeData,
                selectedSwimmerIds: newSelectedSwimmerIds,
              }
            : ticketTypeData,
        )

        setValue('ticketTypesData', newTicketTypesData)
      }
    }
  }

  const shouldDisplayMissingInformationWarning =
    displayMissingInformationWarning &&
    ticketTypesData.some((ticketTypeData) => ticketTypeData.selectedSwimmerIds?.includes(null))

  return (
    <>
      {missingInformationModalOpen && userQuery.data?.data && (
        <OrderMissingInformationProfileModal
          user={userQuery.data.data}
          onClose={() => setMissingInformationModalOpen(false)}
        />
      )}
      {addSwimmerModalOpen && (
        <AssociatedSwimmerEditAddModal
          onClose={() => setAddSwimmerModalOpen(false)}
          // good enough for now, we don't allow multiple order with multiple ticketTypes where name is requeired
          onSaveSuccess={(savedSwimmer) => {
            ticketTypesWithAdditionalProperties.length > 0 &&
              handleSelectSwimmer(
                savedSwimmer,
                ticketTypesWithAdditionalProperties[0].ticketType.id,
              )
          }}
        />
      )}
      {/* TODO errors everywhere, refactor */}
      {shouldDisplayMissingInformationWarning && (
        <div className="my-6 flex gap-x-3 rounded-lg bg-error px-5 py-4 text-white">
          <Icon name="warning" className="no-fill text-white" />
          <div>
            {t('buy-page.missing-photo-dob')}
            <AriaButton
              onPress={() => setMissingInformationModalOpen(true)}
              className="font-semibold underline"
            >
              {t('buy-page.fill-required-fields')}
            </AriaButton>
          </div>
        </div>
      )}
      {ticketTypesData.map(
        (ticketTypeData) =>
          ticketTypeData.selectedSwimmerIds && (
            <OrderPageSwimmersList
              key={ticketTypeData.ticketType.id}
              selectedSwimmerIds={ticketTypeData.selectedSwimmerIds}
              swimmers={mergedSwimmers}
              onSelectSwimmer={(swimmer) =>
                handleSelectSwimmer(swimmer, ticketTypeData.ticketType.id)
              }
              onAddSwimmer={() => setAddSwimmerModalOpen(true)}
            />
          ),
      )}

      <div className="px-2 text-sm text-error">
        {errorsTicketTypeData
          ?.map((field) =>
            field.selectedSwimmerIds?.map(
              (selectedSwimmerIdField) => selectedSwimmerIdField.message,
            ),
          )
          .join('/n')}
      </div>
    </>
  )
}

export default SwimmersList
