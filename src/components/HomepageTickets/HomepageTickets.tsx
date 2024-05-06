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

const partitionTickets = (tickets: Ticket[]) => ({
  dayTickets: tickets.filter((ticket) => ticket.type === 'ENTRIES' && !ticket.nameRequired),
  entryTickets: tickets.filter((ticket) => ticket.type === 'ENTRIES' && ticket.nameRequired),
  seasonalTickets: tickets.filter((ticket) => ticket.type === 'SEASONAL'),
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
      await login(`${window.location.origin}/order?ticketId=${ticket.id}`)
    } else {
      history.push({
        pathname: '/order',
        state: { ticketId: ticket.id },
      })
    }
  }

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      {[
        {
          name: 'Jednorazové lístky',
          description:
            'Vhodné pre príležitostných návštevníkov alebo pre tých, ktorí nechcú čakať pred kúpaliskom v dlhom rade a kúpia si lístok online priamo na mieste.',
          tickets: dayTickets,
        },
        {
          name: 'Vstupové permanentky',
          description:
            'Platí na 10 vstupov počas celej sezóny bez ohľadu na vek. Jedna permanentka je viazaná na jednu osobu a je neprenosná.',
          tickets: entryTickets,
        },
        {
          name: 'Sezónne permanentky',
          description:
            'Neobmedzený vstup počas celej sezóny na všetky našé kúpaliská v Bratislave. Možnosť zakúpiť spolu s detskou permanentkou až pre 5 detí za zvýhodnenú cenu 1€ za dieťa. ',
          tickets: seasonalTickets,
        },
      ].map(({ name, description, tickets }, index) => (
        <div key={index} className="max-w-[904px]">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3 text-center lg:text-left">
              <h5 className="font-semibold text-xl">{name}</h5>
              <p>{description}</p>
            </div>
            <div className="flex flex-col gap-3">
              {tickets?.map((ticket) => {
                const needsLogin = ticket.nameRequired && !isAuthenticated

                return (
                  <div
                    key={ticket.id}
                    className={cx(
                      'px-6 py-4 rounded-lg flex flex-col lg:flex-row gap-8 border border-divider lg:items-center bg-white',
                      { 'cursor-pointer': !ticket.disabled },
                    )}
                    onClick={() => handleClick(ticket)}
                  >
                    <span className="grow font-semibold">{ticket.name}</span>
                    <div className="flex items-center justify-between gap-x-8">
                      <span className="lg:w-[108px] font-semibold lg:text-right">
                        {currencyFormatter.format(ticket.price)}
                      </span>
                      <Button
                        className="xs:px-4 w-full mt-2 xs:mt-0 xs:w-auto min-w-[182px]"
                        thin
                        onClick={() => handleClick(ticket)}
                        color={needsLogin ? 'primary' : 'outlined'}
                        disabled={ticket.disabled}
                      >
                        {needsLogin ? 'Prihlásiť sa' : t('landing.basket')}
                        <Icon
                          name={needsLogin ? 'login' : 'euro-coin'}
                          className={cx('ml-2 no-fill', { 'py-1': !needsLogin })}
                        />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default HomepageTickets
