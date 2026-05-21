import { useMemo, useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useAppSelector } from '../../hooks'
import { selectAvailableTicketTypes } from '../../store/global'
import { TicketType } from '../../models'
import { Button, Icon } from '../index'
import cx from 'classnames'
import { useLogin } from '../../hooks/useLogin'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import useCityAccountAccessToken from 'hooks/useCityAccount'
import { FormatCurrencyFromCents } from '../../helpers/currencyFormatter'
import { ROUTES } from 'helpers/constants'
import { environment } from '../../environment'
import { getPrice } from 'store/order/api'
import { orderFormToRequests } from 'pages/OrderPage/formDataToRequests'

const partitionTicketTypes = (ticketTypes: TicketType[]) => ({
  dayTicketTypes: ticketTypes.filter((ticketType) => ticketType.type === 'ENTRIES' && !ticketType.nameRequired),
  entryTicketTypes: ticketTypes
    .filter((ticketType) => ticketType.type === 'ENTRIES' && ticketType.nameRequired)
    .map((ticketType) => ({ ...ticketType, disabled: !environment.entryTicketSelling })),
  seasonalTicketTypes: ticketTypes
    .filter((ticketType) => ticketType.type === 'SEASONAL')
    .map((ticketType) => ({ ...ticketType, disabled: !environment.seasonalTicketSelling })),
})

const HomepageTickets = () => {
  const ticketTypes = useAppSelector(selectAvailableTicketTypes)
  const { t } = useTranslation()
  const { status } = useCityAccountAccessToken()
  // for now this is only used on ticket where name is not required 
  // hence only ticketAmount is needed and personId is omited
  const [cart, setCart] = useState<{ ticketTypeId: string, ticketAmount: number }[]>([])

  const isAuthenticated = status === 'authenticated'
  const navigate = useNavigate()
  const login = useLogin()

  const ticketTypeNeedsLogin = (ticketType: TicketType) => ticketType.nameRequired && !isAuthenticated
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
    ticketTypesData: cart.filter(item => item.ticketAmount > 0).map((item) => ({
      ticketAmount: item.ticketAmount,
      ticketType: ticketTypes.find(ticketType => ticketType.id === item.ticketTypeId),
      // TODO: we should send property hasOptionalFields derived from ticketType
      // for now all tickets in cart is of type where name is not required therefore hasOptionalFields is true
      hasOptionalFields: true,
    })),
  })

  const { data: cartPriceData, refetch, isFetching, isSuccess } = useQuery(
    'cartPrice',
    ({ signal }) => {
      return getPrice(getPriceRequest, status, signal)
    },
  )

  useEffect(() => {
    refetch()
  }, [cart, refetch])

  // TODO; refactor this,bit hacky solution, possible because for now cart can only have tickets that don't need login
  const handleClick = async (ticketType?: TicketType) => {
    if (ticketType?.disabled) {
      return
    }
    if (ticketType && ticketTypeNeedsLogin(ticketType)) {
      await login(`${window.location.origin}${ROUTES.ORDER}?ticketTypeId=${ticketType.id}`)
    } else {
      navigate(ROUTES.ORDER, {
        state: { orderData: ticketType ? [{ ticketTypeId: ticketType.id }] : cart.filter(item => item.ticketAmount > 0) },
      })
    }
  }

  const adjustTicketAmountFromCart = (ticketType: TicketType, amount: number) => {
    setCart((prev) => {
      return prev.map((item) => {
        const newAmount = item.ticketAmount + amount
        if (newAmount < 0 || newAmount > environment.maxTicketPurchaseLimit) {
          return item
        }
        if (item.ticketTypeId !== ticketType.id) {
          return item
        }
        return {
          ...item,
          ticketAmount: item.ticketAmount + amount
        }
      })
    })
  }

  const addTicketToCart = (ticketType: TicketType) => {
    adjustTicketAmountFromCart(ticketType, 1)
  }

  const removeTicketFromCart = (ticketType: TicketType) => {
    adjustTicketAmountFromCart(ticketType, -1)
  }

  return (
    <>
      <div className="flex flex-col gap-8 lg:gap-10">
        {[
          {
            name: 'Jednorazové lístky',
            description:
              'Vhodné pre príležitostných návštevníkov alebo pre tých, ktorí nechcú čakať pred kúpaliskom v dlhom rade a kúpia si lístok online priamo na mieste.',
            descriptionFooter: t('common.additional-info-student-senior'),
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
              <div className="flex flex-col gap-3 text-center lg:text-left">
                <h5 className="font-semibold text-xl">{name}</h5>
                <p>{description}</p>
              </div>
              <div className="flex flex-col gap-3">
                {ticketTypes?.map((ticketType: TicketType) => {
                  const needsLogin = ticketTypeNeedsLogin(ticketType)
                  return (
                    <div
                      key={ticketType.id}
                      className={cx(
                        'px-6 py-4 rounded-lg flex flex-col lg:flex-row gap-8 border border-divider lg:items-center bg-sunscreen',
                        { 'cursor-pointer': !ticketType.disabled },
                      )}
                      onClick={() => isCartable ? {} : handleClick(ticketType)}
                    >
                      <span className="grow font-semibold">{ticketType.name}</span>
                      <div className="flex items-center justify-between gap-x-6">
                        <span className="lg:w-[115px] lg:text-left">
                          <span className="text-xl font-semibold">
                            <FormatCurrencyFromCents value={ticketType.priceWithVat} />
                          </span>
                          <span>{t('common.per-ticket')}</span>
                        </span>
                        {isCartable && cart.filter((item) => item.ticketTypeId === ticketType.id).map((item) => (
                          // TODO add also error when input field is added
                          <div key={item.ticketTypeId} className="flex items-center justify-between px-6 py-2 lg:w-[182px] border border-primary rounded-lg">
                            <Button
                              className='p-0'
                              color='sunscreen'
                              onClick={() => removeTicketFromCart(ticketType)}
                            >
                              <Icon name={'minus'} />
                            </Button>
                            {/* TODO this should be input field and use should be able to input the amount also add error as stated in figma */}
                            <span className="font-semibold">{item.ticketAmount}</span>
                            <Button
                              className='p-0'
                              color='sunscreen'
                              onClick={() => addTicketToCart(ticketType)}
                            >
                              <Icon name={'plus'} />
                            </Button>
                          </div>
                        ))}
                        {!isCartable && <Button
                          className="xs:px-4 w-full mt-2 xs:mt-0 xs:w-auto min-w-[182px]"
                          thin
                          rounded
                          onClick={() => handleClick(ticketType)}
                          color={needsLogin ? 'primary' : 'outlined'}
                          disabled={ticketType.disabled}
                        >
                          <>
                            {needsLogin ? t('signin-button') : t('landing.basket')}
                            <Icon
                              name={needsLogin ? 'login' : 'euro-coin'}
                              className={cx('ml-2 no-fill', {
                                'py-1': !needsLogin,
                              })}
                            />
                          </>
                        </Button>}
                      </div>
                    </div>
                  )
                })}
              </div>
              {isCartable && (
                <div className="px-6 py-4 bg-blueish flex flex-col lg:flex-row lg:items-center rounded-lg border border-divider">
                  <span className="grow font-semibold">{t('price-total')}</span>
                  <div className="flex items-center justify-between gap-x-6">
                    <span className="lg:w-[115px] lg:text-left grow font-semibold text-xl">
                      <SkeletonTheme
                        baseColor="#a8dbf2"
                        highlightColor="#58bbe6"
                        duration={1}
                        width={40}
                        height={28}
                      >
                        {isFetching ? (
                          <Skeleton />
                        ) : (
                          <FormatCurrencyFromCents value={isSuccess ? cartPriceData.data?.data.pricing.orderPriceWithVat : 0} />
                        )}
                      </SkeletonTheme>
                    </span>
                    <Button
                      className="xs:px-4 w-full mt-2 xs:mt-0 xs:w-auto min-w-[182px]"
                      thin
                      rounded
                      onClick={() => handleClick()}
                      disabled={cart.filter(item => item.ticketAmount > 0).length === 0}
                      color='primary'
                    >
                      <>
                        {t('landing.basket')}
                        <Icon
                          name={'euro-coin'}
                          className={cx('ml-2 no-fill py-1')}
                        />
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
      <div className="flex flex-col text-center my-8 text-sm leading-loose">
        <span>{t('common.additional-info-toddlers')}</span>
      </div>
    </>
  )
}

export default HomepageTickets

