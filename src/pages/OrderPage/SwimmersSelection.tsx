import { AxiosError } from 'axios'
import { Icon } from 'components'
import { ErrorWithMessages, getErrorMessagesFromHttpRequest } from 'helpers/general'
import { CartItem } from 'models'
import { GetPriceRequest, OrderRequestBody } from 'pages/OrderPage/formDataToRequests'
import SwimmersList, { SwimmersListProps } from 'pages/OrderPage/SwimmersList'
import { Trans, useTranslation } from 'react-i18next'

interface SwimmersSelectionProps extends SwimmersListProps {
  ticketTypesData: CartItem[]
  getRequestsFromFormData: () => {
    getPriceRequest: GetPriceRequest
    orderRequest: OrderRequestBody
  }
  errorsPriceQuery: unknown
}

const SwimmersSelection = ({
  ticketTypesData,
  getRequestsFromFormData,
  errorsPriceQuery,
  ...rest
}: SwimmersSelectionProps) => {
  const { t } = useTranslation()

  return (
    <>
      <div className="mt-2">
        {ticketTypesData.some(
          (ticketTypeData) => ticketTypeData.ticketType.type === 'SEASONAL',
        ) && (
          <Trans
            i18nKey={'buy-page.select-people-reminder-seasonal'}
            components={{ span: <span /> }}
          />
        )}
        {ticketTypesData.some((ticketTypeData) => ticketTypeData.ticketType.type === 'ENTRIES') && (
          <Trans
            i18nKey={'buy-page.select-people-reminder-entries'}
            components={{ span: <span /> }}
          />
        )}
      </div>
      {/* TODO errors everywhere, refactor */}
      {/* TODO shouldn't this error be shown every time not only when ticketType.hasSwimmers is not true? */}
      {errorsPriceQuery && (
        <div className="my-6 flex gap-x-3 rounded-lg bg-[#FCF2E6] px-5 py-4">
          <Icon name="warning" className="no-fill text-[#E07B04]" />
          <div>
            {getErrorMessagesFromHttpRequest(
              // TODO check if we show correct errors in all cases
              // (zod schema error - probably not, joi schema error, manually thrown error)
              errorsPriceQuery as AxiosError<ErrorWithMessages>,
            )}
          </div>
        </div>
      )}
      {/* TODO this check should live in schema and error should be visible if schema is sending error */}
      {ticketTypesData.some((ticketTypeData) => ticketTypeData.ticketType.nameRequired) &&
        getRequestsFromFormData().getPriceRequest.tickets.length < 1 && (
          <div className="my-6 flex gap-x-3 rounded-lg bg-[#FCF2E6] px-5 py-4">
            <Icon name="warning" className="no-fill text-[#E07B04]" />
            <div>{t('buy-page.min-one-person')}</div>
          </div>
        )}
      <SwimmersList {...rest} ticketTypesData={ticketTypesData} />
    </>
  )
}

export default SwimmersSelection
