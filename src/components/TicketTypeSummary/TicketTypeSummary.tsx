import { Icon } from 'components'
import AdultChildrenCount from 'components/AdultChildrenCount/AdultChildrenCount'
import NumberField from 'components/NumberField/NumberField'
import { isDefined } from 'helpers/helper'
import { TicketType } from 'models'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'

import {
  FormatCurrencyFromCents,
  useCurrencyFromCentsFormatter,
} from '../../helpers/currencyFormatter'

interface TicketTypeSummary {
  ticketType: TicketType
  hasTicketAmount: boolean
  ticketAmount?: number
  handleTicketTypeRemove?: () => void
  setTicketAmount: (ticketAmount: number) => void
  isFetching: boolean
  isSuccess: boolean
  adultCount?: number
  childrenCount?: number
}

const TicketTypeSummary = ({
  ticketType,
  hasTicketAmount,
  ticketAmount,
  handleTicketTypeRemove,
  setTicketAmount,
  isFetching,
  isSuccess,
  childrenCount,
  adultCount,
}: TicketTypeSummary) => {
  const { t } = useTranslation()
  const currencyFromCentsFormatter = useCurrencyFromCentsFormatter()

  return (
    <div className="rounded-lg bg-sunscreen">
      <div className="p-8">
        <div className="flex flex-row justify-between">
          <div className="text-2xl font-semibold">
            {hasTicketAmount && `${ticketAmount}× `}
            {ticketType.name}
          </div>
          {handleTicketTypeRemove && (
            <button onClick={handleTicketTypeRemove}>
              <Icon name="close" />
            </button>
          )}
        </div>
        {childrenCount && adultCount && ticketType.childrenAllowed && (
          <p className="mt-2 font-bold">
            {isFetching ? (
              <div style={{ maxWidth: '200px' }}>
                <Skeleton />
              </div>
            ) : (
              isSuccess && (
                <AdultChildrenCount adultCount={adultCount} childrenCount={childrenCount} />
              )
            )}
          </p>
        )}
        <p className="mt-4">{ticketType.description}</p>
        {ticketType.childrenAllowed && (
          <>
            <br />
            <p className="font-semibold">
              {/* TODO pluralizacia */}
              {t('buy-page.children-discount-children-count-and-price', {
                childrenMaxNumber: ticketType.childrenMaxNumber,
                childrenPrice: isDefined(ticketType.childrenPriceWithVat)
                  ? currencyFromCentsFormatter.format(ticketType.childrenPriceWithVat)
                  : null,
              })}
            </p>
            <p className="font-semibold">{t('buy-page.children-alert-last-chance')}</p>
          </>
        )}
      </div>
      <div className="flex items-center justify-between rounded-b-lg bg-blueish p-4 lg:px-8">
        {hasTicketAmount && (
          <NumberField
            value={ticketAmount}
            onChange={(value) => setTicketAmount(value)}
            minValue={0}
            maxValue={99}
            isWheelDisabled
            isDisabled={ticketType.isDisabled}
          />
        )}
        <div className="flex flex-nowrap">
          <span className="font-bold text-fontBlack lg:text-xl">
            <FormatCurrencyFromCents value={ticketType.priceWithVat} />
          </span>
          <span>{t('common.per-ticket')}</span>
        </div>
      </div>
    </div>
  )
}

export default TicketTypeSummary
