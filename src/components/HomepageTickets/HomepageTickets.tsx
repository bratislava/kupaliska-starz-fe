import cx from 'classnames'
import { ROUTES } from 'helpers/constants'
import logger from 'helpers/logger'
import useCityAccountAccessToken from 'hooks/useCityAccount'
import { orderFormToRequests } from 'pages/OrderPage/formDataToRequests'
import { useEffect, useMemo, useState } from 'react'
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
import { Button, Icon, InputField } from '../index'

const partitionTicketTypes = (ticketTypes: TicketType[]) => ({
  dayTicketTypes: ticketTypes.filter(
    (ticketType) => ticketType.type === 'ENTRIES' && !ticketType.nameRequired,
  ),
  entryTicketTypes: ticketTypes
    .filter((ticketType) => ticketType.type === 'ENTRIES' && ticketType.nameRequired)
    .map((ticketType) => ({ ...ticketType, disabled: !environment.entryTicketSelling })),
  seasonalTicketTypes: ticketTypes
    .filter((ticketType) => ticketType.type === 'SEASONAL')
    .map((ticketType) => ({ ...ticketType, disabled: !environment.seasonalTicketSelling })),
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
  const [cart, setCart] = useState<{ ticketTypeId: string; ticketAmount: number }[]>([])

  const isAuthenticated = status === 'authenticated'
  const navigate = useNavigate()
  const login = useLogin()

  const ticketTypeNeedsLogin = (ticketType: TicketType) =>
    ticketType.nameRequired && !isAuthenticated
  const { dayTicketTypes, entryTicketTypes, seasonalTicketTypes } = useMemo(
    () => partitionTicketTypes(ticketTypes),
    [ticketTypes],
  )

  useEffect(() => {
    const cart = dayTicketTypes.map((ticketType) => ({
      ticketTypeId: ticketType.id,
      ticketAmount: 0,
    }))
    setCart(cart)
  }, [dayTicketTypes])

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

  const {
    data: cartPriceData,
    isFetching,
    isSuccess,
  } = useQuery({
    queryKey: ['cartPrice', cart],
    queryFn: ({ signal }) => {
      logger.info(getPriceRequest)
      return getPrice(getPriceRequest, status, signal)
    },
    onError: (err) => {
      logger.error(`HomepageTickets "getPrice" Request error: ${err}`)
    },
    enabled: getPriceRequest.tickets.length > 0,
  })

  // TODO; refactor this,bit hacky solution, possible because for now cart can only have tickets that don't need login
  const handleClick = async (ticketType?: TicketType) => {
    if (ticketType?.disabled) {
      return
    }
    if (ticketType && ticketTypeNeedsLogin(ticketType)) {
      await login(`${window.location.origin}${ROUTES.ORDER}?ticketTypeId=${ticketType.id}`)
    } else {
      navigate(ROUTES.ORDER, {
        state: {
          orderData: ticketType
            ? [{ ticketTypeId: ticketType.id }]
            : cart.filter((item) => item.ticketAmount > 0),
        },
      })
    }
  }

  const adjustTicketAmountFromCart = (ticketAmount: number, ticketType: TicketType) => {
    if (ticketAmount < 0) {
      return
    }
    setCart((prev) => {
      const cumulativeTicketAmount = prev
        .filter((item) => item.ticketTypeId !== ticketType.id)
        .reduce((acc, curr) => acc + (curr.ticketAmount ?? 0), 0)
      if (cumulativeTicketAmount + ticketAmount > environment.maxTicketPurchaseLimit) {
        return prev
      }

      return prev.map((ticketTypeDataInner) => {
        return ticketTypeDataInner.ticketTypeId === ticketType.id
          ? { ...ticketTypeDataInner, ticketAmount }
          : ticketTypeDataInner
      })
    })
  }

  const addTicketToCart = (ticketAmount: number, ticketType: TicketType) => {
    adjustTicketAmountFromCart(ticketAmount, ticketType)
  }

  const removeTicketFromCart = (ticketAmount: number, ticketType: TicketType) => {
    adjustTicketAmountFromCart(ticketAmount, ticketType)
  }

  return (
    <>
      <div className="
        flex flex-col gap-8
        lg:gap-10
      ">
        {[
          {
            name: 'Jednorazové lístky',
            description:
              'Vhodné pre príležitostných návštevníkov alebo pre tých, ktorí nechcú čakať pred kúpaliskom v dlhom rade a kúpia si lístok online priamo na mieste.',
            descriptionFooter: t('common.max-ticket-purchase-limit', {
              maxTicketPurchaseLimit: environment.maxTicketPurchaseLimit,
            }),
            ticketTypes: dayTicketTypes,
            isCartable: true,
          },
          {
            name: 'Vstupové permanentky',
            description:
              'Platí na 10 vstupov počas celej sezóny bez ohľadu na vek. Jedna permanentka je viazaná na jednu osobu a je neprenosná.',
            descriptionFooter: '',
            ticketTypes: entryTicketTypes,
          },
          {
            name: 'Sezónne permanentky',
            description:
              'Neobmedzený vstup počas celej sezóny na všetky naše kúpaliská a 90 minútový vstup denne na Mestskú Plaváreň Pasienky. K sezónnej permanentke pre dospelých a ŤZP/ŤZP-S je možné zakúpiť detskú permanentku až pre 3 deti za zvýhodnenú cenu 9,90 € za dieťa.',
            descriptionFooter: '',
            ticketTypes: seasonalTicketTypes,
          },
        ].map(({ name, description, descriptionFooter, ticketTypes, isCartable }, index) => (
          <div key={index} className="max-w-[904px]">
            <div className="flex flex-col gap-8">
              <div className="
                flex flex-col gap-3 text-center
                lg:text-left
              ">
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
                        `
                          flex flex-col gap-8 rounded-lg border border-divider
                          bg-sunscreen px-6 py-4
                          lg:flex-row lg:items-center
                        `,
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
                              // TODO add also error when input field is added
                              <div
                                key={item.ticketTypeId}
                                className="
                                  flex items-center justify-between rounded-lg
                                  border border-primary px-6 py-2
                                  lg:w-[182px]
                                "
                              >
                                <Button
                                  className="p-0"
                                  color="sunscreen"
                                  onClick={() =>
                                    removeTicketFromCart(item.ticketAmount - 1, ticketType)
                                  }
                                >
                                  <Icon name={'minus'} />
                                </Button>
                                {/* TODO this should be input field and use should be able to input the amount also add error as stated in figma */}
                                <InputField
                                  value={item.ticketAmount}
                                  // TODO use onBlur instead of onChange to be able to remove input value entirely
                                  // now when using onBlur the value is not changed when the user clicks on the plus/minus button
                                  onChange={(event) =>
                                    adjustTicketAmountFromCart(
                                      Number(event.target.value),
                                      ticketType,
                                    )
                                  }
                                  className="inline-flex w-18"
                                  textCenter
                                  inputWrapperClassName="lg:w-full"
                                />
                                <Button
                                  className="p-0"
                                  color="sunscreen"
                                  onClick={() => addTicketToCart(item.ticketAmount + 1, ticketType)}
                                >
                                  <Icon name={'plus'} />
                                </Button>
                              </div>
                            ))}
                        {!isCartable && (
                          <Button
                            className="
                              mt-2 w-full min-w-[182px]
                              xs:mt-0 xs:w-auto xs:px-4
                            "
                            thin
                            rounded
                            onClick={async () => handleClick(ticketType)}
                            color={needsLogin ? 'primary' : 'outlined'}
                            disabled={ticketType.disabled}
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
                <div className="
                  flex flex-col rounded-lg border border-divider bg-blueish px-6
                  py-4
                  lg:flex-row lg:items-center
                ">
                  <span className="grow font-semibold">{t('price-total')}</span>
                  <div className="flex items-center justify-between gap-x-6">
                    <span className="
                      grow text-xl font-semibold
                      lg:w-[115px] lg:text-left
                    ">
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
                      className="
                        mt-2 w-full min-w-[182px]
                        xs:mt-0 xs:w-auto xs:px-4
                      "
                      thin
                      rounded
                      onClick={async () => handleClick()}
                      disabled={cart.filter((item) => item.ticketAmount > 0).length === 0}
                      color="primary"
                    >
                      <>
                        {t('landing.basket')}
                        <Icon name={'euro-coin'} className={cx(`
                          no-fill ml-2 py-1
                        `)} />
                      </>
                    </Button>
                  </div>
                </div>
              )}
              {descriptionFooter && <p className="text-sm">{descriptionFooter}</p>}
            </div>
          </div>
        ))}
      </div>
      <div className="my-8 flex flex-col text-center text-sm leading-loose">
        <span>{t('common.additional-info-toddlers')}</span>
      </div>
    </>
  )
}

export default HomepageTickets
