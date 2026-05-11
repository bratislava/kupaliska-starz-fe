import { useMemo } from 'react'
import { useAppSelector } from '../../hooks'
import { selectAvailableTicketTypes } from '../../store/global'
import { TicketType } from '../../models'
import { Button, Icon } from '../index'
import cx from 'classnames'
import { useLogin } from '../../hooks/useLogin'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import useCityAccountAccessToken from 'hooks/useCityAccount'
import { currencyFormatter } from '../../helpers/currencyFormatter'
import { ROUTES } from 'helpers/constants'
import { environment } from '../../environment'

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

  const isAuthenticated = status === 'authenticated'
  const navigate = useNavigate()
  const login = useLogin()

  const ticketTypeNeedsLogin = (ticketType: TicketType) => ticketType.nameRequired && !isAuthenticated
  const { dayTicketTypes, entryTicketTypes, seasonalTicketTypes } = useMemo(
    () => partitionTicketTypes(ticketTypes),
    [ticketTypes],
  )

  const handleClick = async (ticketType: TicketType) => {
    if (ticketType.disabled) {
      return
    }

    if (ticketTypeNeedsLogin(ticketType)) {
      await login(`${window.location.origin}${ROUTES.ORDER}?ticketTypeId=${ticketType.id}`)
    } else {
      navigate(ROUTES.ORDER, {
        state: { ticketTypeId: ticketType.id },
      })
    }
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
        ].map(({ name, description, descriptionFooter, ticketTypes }, index) => (
          <div key={index} className="max-w-[904px]">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3 text-center lg:text-left">
                <h5 className="font-semibold text-xl">{name}</h5>
                <p>{description}</p>
              </div>
              <div className="flex flex-col gap-3">
                {ticketTypes?.map((ticketType) => {
                  const needsLogin = ticketTypeNeedsLogin(ticketType)

                  return (
                    <div
                      key={ticketType.id}
                      className={cx(
                        'px-6 py-4 rounded-lg flex flex-col lg:flex-row gap-8 border border-divider lg:items-center bg-sunscreen',
                        { 'cursor-pointer': !ticketType.disabled },
                      )}
                      onClick={() => handleClick(ticketType)}
                    >
                      <span className="grow font-semibold">{ticketType.name}</span>
                      <div className="flex items-center justify-between gap-x-8">
                        <span className="lg:w-[108px] font-semibold lg:text-right">
                          {currencyFormatter.format(ticketType.priceWithVat)}
                        </span>
                        <Button
                          className="xs:px-4 w-full mt-2 xs:mt-0 xs:w-auto min-w-[182px]"
                          thin
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
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
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
