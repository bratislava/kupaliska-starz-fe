import cx from 'classnames'
import NumberField from 'components/NumberField/NumberField'
import { ROUTES } from 'helpers/constants'
import logger from 'helpers/logger'
import useCityAccountAccessToken from 'hooks/useCityAccount'
import { orderFormToRequests } from 'pages/OrderPage/formDataToRequests'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router'
import { getPrice } from 'store/order/api'

import { environment } from '../../environment'
import { FormatCurrencyFromCents } from '../../helpers/currencyFormatter'
import { useAppSelector } from '../../hooks'
import { useLogin } from '../../hooks/useLogin'
import { TicketType } from '../../models'
import { selectAvailableTicketTypes } from '../../store/global'
import { Button, Icon } from '../index'

const partitionTicketTypes = (ticketTypes: TicketType[]) => ({
  dayTicketTypes: ticketTypes.filter(
    (ticketType) => ticketType.type === 'ENTRIES' && !ticketType.nameRequired,
  ),
  entryTicketTypes: ticketTypes.filter(
    (ticketType) => ticketType.type === 'ENTRIES' && ticketType.nameRequired,
  ),
  seasonalTicketTypes: ticketTypes.filter((ticketType) => ticketType.type === 'SEASONAL'),
})

/**
 * Figma: https://www.figma.com/design/7ZleKHCPWbiQKjCV9nU7PW/Starz---Dizajn-2024?node-id=2045-2022
 */

const HomepageTickets = () => {
  const ticketTypes = useAppSelector(selectAvailableTicketTypes)
  const { t } = useTranslation()
  const { status } = useCityAccountAccessToken()
  // for now this is only used on ticket where name is not required
  // hence only ticketAmount is needed and personId is omited
  const [cart, setCart] = useState<{ ticketTypeId: string; ticketAmount: number }[]>(
    partitionTicketTypes(ticketTypes).dayTicketTypes.map((ticketType) => ({
      ticketTypeId: ticketType.id,
      ticketAmount: 0,
    })),
  )

  const isAuthenticated = status === 'authenticated'
  const navigate = useNavigate()
  const login = useLogin()

  const ticketTypeNeedsLogin = (ticketType: TicketType) =>
    ticketType.nameRequired && !isAuthenticated
  const { dayTicketTypes, entryTicketTypes, seasonalTicketTypes } = useMemo(
    () => partitionTicketTypes(ticketTypes),
    [ticketTypes],
  )

  const { getPriceRequest } = orderFormToRequests({
    ticketTypesData: cart
      .filter((item) => item.ticketAmount > 0)
      .map((item) => ({
        ticketAmount: item.ticketAmount,
        ticketType: ticketTypes.find((ticketType) => ticketType.id === item.ticketTypeId),
        // TODO: we should send property hasOptionalFields derived from ticketType
        // for now all tickets in cart is of type where name is not required therefore hasOptionalFields is true
        hasOptionalFields: true,
      })),
  })

  const withinMaxTicketAmountLimit =
    getPriceRequest.tickets.length <= environment.maxTicketPurchaseLimit

  const purchaseAmountInLimit = getPriceRequest.tickets.length > 0 && withinMaxTicketAmountLimit

  const {
    data: cartPriceData,
    isFetching,
    isSuccess,
    // add error handling
  } = useQuery({
    queryKey: ['cartPrice', cart, getPriceRequest, status],
    queryFn: async ({ signal }) => {
      logger.info(getPriceRequest)

      return getPrice(getPriceRequest, status, signal)
    },
    onError: (err) => {
      logger.error(`HomepageTickets "getPrice" Request error: ${err}`)
    },
    enabled: purchaseAmountInLimit,
  })

  // TODO; refactor this,bit hacky solution, possible because for now cart can only have tickets that don't need login
  const handleClick = async (ticketType?: TicketType) => {
    if (ticketType?.isDisabled) {
      return
    }
    if (ticketType && ticketTypeNeedsLogin(ticketType)) {
      login(`${window.location.origin}${ROUTES.ORDER}?ticketTypeId=${ticketType.id}`)
    } else {
      await navigate(ROUTES.ORDER, {
        state: {
          orderData: ticketType
            ? [{ ticketTypeId: ticketType.id }]
            : cart.filter((item) => item.ticketAmount > 0),
        },
      })
    }
  }

  const adjustTicketAmountFromCart = (ticketAmount: number, ticketType: TicketType) => {
    setCart((prev) => {
      return prev.map((ticketTypeDataInner) => {
        return ticketTypeDataInner.ticketTypeId === ticketType.id
          ? { ...ticketTypeDataInner, ticketAmount }
          : ticketTypeDataInner
      })
    })
  }

  // TODO split into multiple components
  return (
    <>
      <div className="flex flex-col gap-8 lg:gap-10">
        {[
          {
            name: t('homepage-tickets.day-name'),
            description: t('homepage-tickets.day-desc'),
            ticketTypes: dayTicketTypes,
            isCartable: true,
          },
          {
            name: t('homepage-tickets.entry-name'),
            description: t('homepage-tickets.entry-desc'),
            ticketTypes: entryTicketTypes,
          },
          {
            name: t('homepage-tickets.seasonal-name'),
            description: t('homepage-tickets.seasonal-desc'),
            ticketTypes: seasonalTicketTypes,
          },
        ].map(({ name, description, ticketTypes, isCartable }, index) => (
          <div key={index} className="max-w-[904px]">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 text-center lg:text-left">
                <h5 className="text-xl font-semibold">{name}</h5>
                <p>{description}</p>
              </div>
              <div className="flex flex-col gap-3">
                {/* TODO: when type is not present there is typescript error, 
                remove this type later after investigation why is it even needed */}
                {ticketTypes?.map((ticketType: TicketType) => {
                  const needsLogin = ticketTypeNeedsLogin(ticketType)

                  return (
                    <div
                      key={ticketType.id}
                      className={cx(
                        `flex flex-col gap-8 rounded-lg border border-divider bg-sunscreen px-6 py-4 lg:flex-row lg:items-center`,
                      )}
                    >
                      <span className="grow font-semibold">{ticketType.name}</span>
                      <div className="flex items-center justify-between gap-x-6">
                        <span className="lg:w-[120px] lg:text-left">
                          <div className="flex flex-nowrap">
                            <span className="text-xl font-semibold">
                              <FormatCurrencyFromCents value={ticketType.priceWithVat} />
                            </span>
                            <span>{t('common.per-ticket')}</span>
                          </div>
                        </span>
                        {isCartable &&
                          cart
                            .filter((item) => item.ticketTypeId === ticketType.id)
                            .map((item) => (
                              <NumberField
                                key={item.ticketTypeId}
                                value={item.ticketAmount}
                                onChange={(value) => adjustTicketAmountFromCart(value, ticketType)}
                                minValue={0}
                                maxValue={99}
                                isWheelDisabled
                                isDisabled={ticketType.isDisabled}
                              />
                            ))}
                        {!isCartable && (
                          <Button
                            className="mt-2 w-full min-w-[182px] xs:mt-0 xs:w-auto xs:px-4"
                            thin
                            rounded
                            onClick={async () => handleClick(ticketType)}
                            color={needsLogin ? 'primary' : 'outlined'}
                            disabled={ticketType.isDisabled}
                          >
                            <>
                              {needsLogin ? t('signin-button') : t('landing.basket')}
                              <Icon
                                name={needsLogin ? 'login' : 'euro-coin'}
                                className={cx('no-fill ml-2', {
                                  'py-1': !needsLogin,
                                })}
                              />
                            </>
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              {isCartable && (
                <>
                  {!withinMaxTicketAmountLimit && (
                    <div className="flex gap-x-3 rounded-lg bg-[#FAE5E5] px-5 py-4">
                      <Icon name="alert" className="no-fill text-error"></Icon>
                      {t('common.max-ticket-purchase-limit', {
                        maxTicketPurchaseLimit: environment.maxTicketPurchaseLimit,
                      })}
                    </div>
                  )}
                  <div className="flex flex-col rounded-lg border border-divider bg-blueish px-6 py-4 lg:flex-row lg:items-center">
                    <span className="grow font-semibold">{t('price-total')}</span>
                    <div className="flex items-center justify-between gap-x-6">
                      <span className="grow text-xl font-semibold lg:w-[115px] lg:text-left">
                        <SkeletonTheme
                          baseColor="#a8dbf2"
                          highlightColor="#58bbe6"
                          duration={1}
                          width={40}
                          height={28}
                        >
                          {isFetching && <Skeleton />}

                          {!isFetching && cartPriceData?.data?.data.pricing.orderPriceWithVat && (
                            // this causes error when user uses google translate on website
                            // best described here https://martijnhols.nl/blog/everything-about-google-translate-crashing-react
                            // working reasonable solution for web app of this size is surrounding TextNodes with spans
                            <span>
                              <FormatCurrencyFromCents
                                value={cartPriceData.data?.data.pricing.orderPriceWithVat}
                              />
                            </span>
                          )}
                          {!isFetching && !cartPriceData?.data?.data.pricing.orderPriceWithVat && (
                            <span>
                              <FormatCurrencyFromCents value={0} />
                            </span>
                          )}
                        </SkeletonTheme>
                      </span>
                      <Button
                        className="mt-2 w-full min-w-[182px] xs:mt-0 xs:w-auto xs:px-4"
                        thin
                        rounded
                        onClick={async () => handleClick()}
                        disabled={!purchaseAmountInLimit}
                        color="primary"
                      >
                        <>
                          {t('landing.basket')}
                          <Icon name={'euro-coin'} className={cx(`no-fill ml-2 py-1`)} />
                        </>
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="my-8 flex flex-col text-center text-sm/loose">
        <span>{t('common.additional-info-toddlers')}</span>
      </div>
    </>
  )
}

export default HomepageTickets
