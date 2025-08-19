import React, { useMemo } from 'react'
import { useAppSelector } from '../../hooks'
import { selectAvailableTickets } from '../../store/global'
import { Ticket } from '../../models'
import { Button, Icon } from '../index'
import cx from 'classnames'
import { useLogin } from '../../hooks/useLogin'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import useCityAccountAccessToken from 'hooks/useCityAccount'
import { currencyFormatter } from '../../helpers/currencyFormatter'
import { ROUTES } from 'helpers/constants'

const partitionTickets = (tickets: Ticket[]) => ({
  dayTickets: tickets.filter((ticket) => ticket.type === 'ENTRIES' && !ticket.nameRequired),
  entryTickets: tickets
    .filter((ticket) => ticket.type === 'ENTRIES' && ticket.nameRequired)
    .map((ticket) => ({ ...ticket, disabled: true })),
  seasonalTickets: tickets
    .filter((ticket) => ticket.type === 'SEASONAL')
    .map((ticket) => ({ ...ticket, disabled: true })),
})

const HomepageTickets = () => {
  const tickets = useAppSelector(selectAvailableTickets)
  const { t } = useTranslation()
  const { status } = useCityAccountAccessToken()

  const isAuthenticated = status === 'authenticated'
  const history = useHistory()
  const login = useLogin()

  const ticketNeedsLogin = (ticket: Ticket) => ticket.nameRequired && !isAuthenticated
  const { dayTickets, entryTickets, seasonalTickets } = useMemo(
    () => partitionTickets(tickets),
    [tickets],
  )

  const handleClick = async (ticket: Ticket) => {
    if (ticket.disabled) {
      return
    }

    if (ticketNeedsLogin(ticket)) {
      await login(`${window.location.origin}${ROUTES.ORDER}?ticketId=${ticket.id}`)
    } else {
      history.push({
        pathname: ROUTES.ORDER,
        state: { ticketId: ticket.id },
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
            tickets: dayTickets,
          },
          {
            name: 'Vstupové permanentky',
            description:
              'Platí na 10 vstupov počas celej sezóny bez ohľadu na vek. Jedna permanentka je viazaná na jednu osobu a je neprenosná.',
            descriptionFooter: '',
            tickets: entryTickets,
          },
          {
            name: 'Sezónne permanentky',
            description:
              'Neobmedzený vstup počas celej sezóny na všetky naše kúpaliská a 90 minútový vstup denne na Mestskú Plaváreň Pasienky. K sezónnej permanentke pre dospelých a ŤZP/ŤZP-S je možné zakúpiť detskú permanentku až pre 3 deti za zvýhodnenú cenu 9,90 € za dieťa.',
            descriptionFooter: '',
            tickets: seasonalTickets,
          },
        ].map(({ name, description, descriptionFooter, tickets }, index) => (
          <div key={index} className="max-w-[904px]">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3 text-center lg:text-left">
                <h5 className="font-semibold text-xl">{name}</h5>
                <p>{description}</p>
              </div>
              <div className="flex flex-col gap-3">
                {tickets?.map((ticket) => {
                  const needsLogin = ticketNeedsLogin(ticket)

                  return (
                    <div
                      key={ticket.id}
                      className={cx(
                        'px-6 py-4 rounded-lg flex flex-col lg:flex-row gap-8 border border-divider lg:items-center bg-sunscreen',
                        { 'cursor-pointer': !ticket.disabled },
                      )}
                      onClick={() => handleClick(ticket)}
                    >
                      <span className="grow font-semibold">{ticket.name}</span>
                      <div className="flex items-center justify-between gap-x-8">
                        <span className="lg:w-[108px] font-semibold lg:text-right">
                          {currencyFormatter.format(ticket.priceWithVat)}
                        </span>
                        <Button
                          className="xs:px-4 w-full mt-2 xs:mt-0 xs:w-auto min-w-[182px]"
                          thin
                          onClick={() => handleClick(ticket)}
                          color={needsLogin ? 'primary' : 'outlined'}
                          disabled={ticket.disabled}
                        >
                          {needsLogin ? t('signin-button') : t('landing.basket')}
                          <Icon
                            name={needsLogin ? 'login' : 'euro-coin'}
                            className={cx('ml-2 no-fill', {
                              'py-1': !needsLogin,
                            })}
                          />
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
