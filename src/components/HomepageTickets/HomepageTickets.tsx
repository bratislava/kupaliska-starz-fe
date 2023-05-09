import React, { useMemo } from 'react'
import { useAppSelector } from '../../hooks'
import { selectAvailableTickets } from '../../store/global'
import { Ticket } from '../../models'
import { Button, Icon } from '../index'
import cx from 'classnames'
import { useIsAuthenticated } from '@azure/msal-react'
import { useLogin } from '../../hooks/useLogin'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

const partitionTickets = (tickets: Ticket[]) => ({
  dayTickets: tickets.filter((ticket) => ticket.type === 'ENTRIES' && !ticket.nameRequired),
  entryTickets: tickets.filter((ticket) => ticket.type === 'ENTRIES' && ticket.nameRequired),
  seasonalTickets: tickets.filter((ticket) => ticket.type === 'SEASONAL'),
})

const HomepageTickets = () => {
  const tickets = useAppSelector(selectAvailableTickets)
  const { t } = useTranslation()
  const isAuthenticated = useIsAuthenticated()
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
    const orderLocation = {
      pathname: '/order',
      state: { ticketId: ticket.id },
    }

    if (ticketNeedsLogin(ticket)) {
      await login(orderLocation)
    } else {
      history.push(orderLocation)
    }
  }

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      {[
        {
          name: 'Celodenné lístky',
          description:
            'Vhodné pre príležitostných návštevníkov alebo pre tých, ktorí nechcú čakať pred kúpaliskom v dlhom rade a kúpia si lístok online priamo na mieste.',
          tickets: dayTickets,
        },
        {
          name: 'Vstupové permanentky',
          description:
            'Platí na 10 celodenných vstupov počas celej sezóny. Vhodné pre pravidelných návštevníkov, ktorí sa nechcú zaviazať kúpou sezónnej permanentky.',
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
                    <div className="flex items-center justify-between">
                      <span className="lg:w-[108px]">{ticket.price.toFixed(2)}€</span>
                      {!ticket.disabled && (
                        <Button
                          className="xs:px-4 w-full mt-2 xs:mt-0 xs:w-auto"
                          thin
                          onClick={() => handleClick(ticket)}
                        >
                          {needsLogin ? 'Prihlásiť sa' : t('landing.basket')}
                          <Icon
                            name={needsLogin ? 'login' : 'euro-coin'}
                            className={cx('ml-2 no-fill', { 'py-1': !needsLogin })}
                          />
                        </Button>
                      )}
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