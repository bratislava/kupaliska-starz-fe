import { Icon } from 'components'
import Price, { PriceProps } from 'pages/OrderPage/Price'
import TicketTypesDetail, { TicketTypesDetailProps } from 'pages/OrderPage/TicketTypesDetail'
import { useTranslation } from 'react-i18next'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

interface SummaryProps extends TicketTypesDetailProps, Omit<PriceProps, 'pricing'> {
  isFetching: boolean
  isSuccess: boolean
  withinMaxTicketAmountLimit: boolean
  maxTicketPurchaseLimit: number
  pricing?: PriceProps['pricing']
}

const Summary = ({
  isFetching,
  isSuccess,
  withinMaxTicketAmountLimit,
  maxTicketPurchaseLimit,
  pricing,
  ...rest
}: SummaryProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-y-4 lg:gap-y-6">
      <span className="text-2xl font-semibold md:text-3xl">{t('buy-page.summary')}</span>
      <TicketTypesDetail isFetching={isFetching} isSuccess={isSuccess} {...rest} />
      {!withinMaxTicketAmountLimit && (
        <div className="flex gap-x-3 rounded-lg bg-[#FAE5E5] px-5 py-4">
          <Icon name="alert" className="no-fill text-error" />
          {t('common.max-ticket-purchase-limit', {
            maxTicketPurchaseLimit,
          })}
        </div>
      )}
      <div className="flex flex-row rounded-lg border-divider bg-blueish p-4 text-fontBlack lg:items-center lg:px-8">
        <span className="grow font-semibold">{t('price-total')}</span>
        <div className="flex items-center justify-between gap-x-6">
          <span className="grow font-semibold lg:w-[115px] lg:text-right lg:text-xl">
            <SkeletonTheme
              baseColor="#a8dbf2"
              highlightColor="#58bbe6"
              duration={1}
              width={40}
              height={28}
            >
              {isFetching ? <Skeleton /> : pricing && <Price pricing={pricing} />}
            </SkeletonTheme>
          </span>
        </div>
      </div>
      <div className="text-gray color-fontBlack">
        <p>{t('common.additional-info-toddlers')}</p>
      </div>
    </div>
  )
}

export default Summary
