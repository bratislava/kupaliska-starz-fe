import React, { useMemo, useState } from 'react'
import { Button, Icon, Modal, ProfileNavBar, Spinner } from 'components'
import { useTranslation } from 'react-i18next'
import MobileCarousel from '../../components/MobileCarousel/MobileCarousel'
import cx from 'classnames'
import ProfileLine from '../../components/ProfileLine/ProfileLine'
import { fetchTicketsHistory, TicketFromHistory } from '../../store/tickets-history/api'
import { useQuery } from 'react-query'
import { partition } from 'lodash'
import { AxiosError } from 'axios'
import { ErrorWithMessages, useErrorToast } from '../../hooks/useErrorToast'

// the best indication we get from backend ¯\_(ツ)_/¯
const ONE_TIME_TICKET_TYPE = 'Jednorazový lístok'

const formatDate = (timestamp: number) => new Date(timestamp).toLocaleDateString('sk-SK')
const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString('sk-SK', {
    hour: '2-digit',
    minute: '2-digit',
  })

const TicketsManagementModal = ({
  open = false,
  onClose,
  ticket,
}: {
  open: boolean
  onClose: any
  ticket: TicketFromHistory | null
}) => {
  const { t } = useTranslation()

  return (
    <Modal
      open={open}
      onClose={onClose}
      button={
        <Button onClick={onClose} className="px-10">
          {t('tickets.less-info')}
        </Button>
      }
      modalClassName="w-full md:w-max"
    >
      {ticket && (
        <>
          <div
            className="hidden md:block p-10 text-primary w-screen"
            style={{ maxWidth: '1000px' }}
          >
            <div className="flex mb-5">
              <div className="flex flex-col justify-between flex-1">
                <div className="font-bold mt-4">{t('tickets.ticket-detail')}</div>
                <div className="flex justify-between">
                  <div className="mr-8">
                    {t('tickets.ticket-owner')}
                    <span className="font-semibold">{ticket.ownerName}</span>
                  </div>
                  <div className="mr-8">
                    {t('tickets.price-individual')}
                    <span className="font-semibold">{ticket.price} €</span>
                  </div>
                  {ticket.remainingEntries != null && ticket.remainingEntries !== 0 && (
                    <div className="mr-8">
                      {t('tickets.remaining-entries-indvidual')}
                      <span className="font-semibold">{ticket.remainingEntries}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <img alt="" src={ticket.qrCode} width={120} height={120} />
              </div>
            </div>
            <div className="w-full h-0.5 bg-primary opacity-30 rounded"></div>
            <table className="table-auto w-full">
              <thead>
                <tr className="opacity-50 text-left">
                  <th className="font-medium py-10">{t('tickets.place')}</th>
                  <th className="font-medium py-10">{t('tickets.date')}</th>
                  <th className="font-medium py-10">{t('tickets.time-in')}</th>
                  <th className="font-medium py-10">{t('tickets.time-out')}</th>
                </tr>
              </thead>
              <tbody>
                {ticket.entries?.length > 0 ? (
                  ticket.entries.map((entry, index) => (
                    <tr key={index}>
                      <td className="pb-5">{entry.poolName}</td>
                      <td className="pb-5">{entry.from && formatDate(entry.from)}</td>
                      <td className="pb-5">{entry.from && formatTime(entry.from)}</td>
                      <td className="pb-5">{entry.to && formatTime(entry.to)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>{t('tickets.no-entries')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="md:hidden text-primary h-full mb-5">
            <div className="pt-8 px-6 pb-5 bg-blueish rounded-t-lg">
              <div className="pb-4 font-bold text-xl">{t('tickets.ticket-detail')}</div>
              <div className="pb-3">
                {t('tickets.ticket-owner')}
                <span className="font-semibold">{ticket.ownerName}</span>
              </div>
              <div className="pb-3">
                {t('tickets.price-individual')}
                <span className="font-semibold">{ticket.price} €</span>
              </div>
              {ticket.remainingEntries != null && ticket.remainingEntries !== 0 && (
                <div>
                  {t('tickets.remaining-entries-indvidual')}
                  <span className="font-semibold">{ticket.remainingEntries}</span>
                </div>
              )}
            </div>
            <div className="h-0.5 bg-primary opacity-30 rounded mx-6"></div>
            <div className="px-6 py-4">
              {ticket.entries.length === 0 && 'Pre zobrazený lístok neexistujú žiadne návštevy.'}
              {ticket.entries.map((entry, index) => (
                <React.Fragment key={index}>
                  <div className="grid grid-cols-2 gap-y-3">
                    <div className="col-span-2">
                      <div className="mb-1">{t('tickets.place')}</div>
                      <div>{entry.poolName}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="mb-1">{t('tickets.date')}</div>
                      <div> {entry.from && formatDate(entry.from)}</div>
                    </div>
                    <div>
                      <div className="mb-1">{t('tickets.time-in')}</div>
                      <div>{entry.from && formatTime(entry.from)}</div>
                    </div>
                    <div>
                      <div className="mb-1">{t('tickets.time-out')}</div>
                      <div>{entry.to && formatTime(entry.to)}</div>
                    </div>
                  </div>
                  <div className="h-0.5 bg-primary opacity-30 rounded my-4"></div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}
interface TicketProps {
  ticket: TicketFromHistory
  onDetailClick: () => void
}

const Ticket = ({ ticket, onDetailClick }: TicketProps) => {
  const { t } = useTranslation()

  // BE should not send explicit color, but rather button type, therefore we convert it here to real values instead
  // of using the color from the BE.
  const textClass = {
    '#07038C': 'text-white',
    '#D0ECF8': 'text-primary',
    '#FFFFFF': 'text-primary',
  }[ticket.ticketColor.background]
  const backgroundClass = {
    '#07038C': 'bg-primary',
    '#D0ECF8': 'bg-blueish',
    '#FFFFFF': 'bg-white',
  }[ticket.ticketColor.background]
  const buttonColor = (
    {
      '#07038C': 'white',
      '#D0ECF8': 'primary',
      '#FFFFFF': 'primary',
    } as const
  )[ticket.ticketColor.background]

  return (
    <div
      className={`flex p-6 mb-6 items-center flex-col rounded-lg shadow-xs overflow-auto ${textClass} ${backgroundClass}`}
    >
      <span className="font-bold text-2xl mb-1">STARZ</span>
      <img alt="" src={ticket.qrCode} className="mb-6" />
      <span className="font-semibold mb-3 text-xl text-center">{ticket.type}</span>
      <span className="text-center mb-6">
        {ticket.type === ONE_TIME_TICKET_TYPE ? '' : ticket.ownerName}
      </span>
      <div className="flex justify-center">
        <Button color={buttonColor} className="absolute shadow-xs" onClick={onDetailClick}>
          {t('tickets.ticket-button')}
          <Icon className="ml-4 no-fill" name="arrow-right" />
        </Button>
      </div>
    </div>
  )
}

interface TableProps {
  headers: React.ReactNode[]
  rows: React.ReactNode[][]
  rowBackgroundClass: string
}

const Table = ({ headers, rows, rowBackgroundClass }: TableProps) => {
  return (
    <table className="table-auto w-full hidden md:table" style={{ borderSpacing: '10px' }}>
      <thead>
        <tr>
          {headers.map((header, index) => {
            const first = index === 0
            const last = index === headers.length - 1
            return (
              <th
                key={index}
                className={cx('py-4', {
                  'text-left pl-10': first,
                  'pr-10': last,
                })}
              >
                {header}
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <tr className={`${rowBackgroundClass} px-10 py-5 shadow-xs rounded-lg`}>
              {row.map((column, columnIndex) => {
                const first = columnIndex === 0
                const last = columnIndex === row.length - 1

                return (
                  <td
                    key={columnIndex}
                    className={cx('py-5', {
                      'rounded-l-lg pl-10': first,
                      'text-center': !first,
                      'rounded-r-lg pr-10': last,
                    })}
                  >
                    {column}
                  </td>
                )
              })}
            </tr>
            {rowIndex !== rows.length - 1 && <tr style={{ height: '40px' }}></tr>}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  )
}

const UsedTicket = ({
  ticket,
  onDetailClick,
}: {
  ticket: TicketFromHistory
  onDetailClick: () => void
}) => {
  const { t } = useTranslation()

  return (
    <div className="flex px-8 py-6 mb-6 flex-col rounded-lg shadow-xs bg-white">
      <div className="flex flex-col pb-6">
        <span>{t('tickets.ticket-type')}</span>
        <span className="font-semibold text-xl">{ticket.type}</span>
      </div>
      <div className="flex flex-col pb-6">
        <span>{t('tickets.entry-date')}</span>
        <span className="font-semibold text-xl">
          {ticket.entries[0] && ticket.entries[0].from && formatDate(ticket.entries[0].from)}
        </span>
      </div>
      <div className="flex flex-col pb-6">
        <span>{t('tickets.price')}</span>
        <span className="font-semibold text-xl">{ticket.price} €</span>
      </div>
      <div className="flex justify-center">
        <Button color="blueish" className="absolute shadow-xs" onClick={onDetailClick}>
          {t('tickets.more-info')}
          <Icon className="ml-4 no-fill" name="arrow-right" />
        </Button>
      </div>
    </div>
  )
}

const TicketsManagementPage = () => {
  const { t } = useTranslation()
  const { dispatchErrorToastForHttpRequest } = useErrorToast()

  const ticketsQuery = useQuery('tickets', fetchTicketsHistory, {
    onError: (err) => {
      dispatchErrorToastForHttpRequest(err as AxiosError<ErrorWithMessages>)
    },
  })
  const [openedTicketDetail, setOpenedTicketDetail] = useState<TicketFromHistory | null>(null)

  const dataMapped = useMemo(() => {
    if (!ticketsQuery.data?.data) {
      return
    }

    const [activeTickets, usedTickets] = partition(
      ticketsQuery.data.data,
      (ticket) => ticket.remainingEntries !== 0,
    )

    const activeTicketsRows = activeTickets.map((ticket) => [
      ticket.type,
      ticket.remainingEntries,
      // don't show owner name for 1 time tickets, so that we don't imply these are bound
      ticket.type === ONE_TIME_TICKET_TYPE ? '' : ticket.ownerName,
      // eslint-disable-next-line react/jsx-key,jsx-a11y/anchor-is-valid
      <a
        role="button"
        onClick={() => setOpenedTicketDetail(ticket)}
        className="underline text-primary font-semibold"
      >
        {t('tickets.more-info')}
      </a>,
    ])

    const usedTicketsRows = usedTickets.map((ticket) => {
      const lastEntry = ticket.entries[0]
      return [
        ticket.type,
        lastEntry?.from && formatDate(lastEntry.from),
        lastEntry?.poolName,
        // eslint-disable-next-line react/jsx-key,jsx-a11y/anchor-is-valid
        <a
          role="button"
          onClick={() => setOpenedTicketDetail(ticket)}
          className="underline text-primary font-semibold"
        >
          {t('tickets.more-info')}
        </a>,
      ]
    })

    const hasActiveTickets = activeTickets.length > 0
    const hasUsedTickets = usedTickets.length > 0
    const hasTickets = hasActiveTickets || hasUsedTickets

    return {
      hasActiveTickets,
      hasUsedTickets,
      hasTickets,
      activeTickets,
      usedTickets,
      activeTicketsRows,
      usedTicketsRows,
    }
  }, [t, ticketsQuery.data])

  const handleModalClose = () => {
    setOpenedTicketDetail(null)
  }

  return (
    <>
      <TicketsManagementModal
        open={Boolean(openedTicketDetail)}
        ticket={openedTicketDetail}
        onClose={handleModalClose}
      ></TicketsManagementModal>

      <section className="w-full">
        <ProfileNavBar></ProfileNavBar>
        <div className="container mx-auto">
          <ProfileLine></ProfileLine>
        </div>
        {ticketsQuery.isLoading && (
          <div className="flex justify-center p-6">
            <Spinner />
          </div>
        )}
        {dataMapped && (
          <>
            {dataMapped.hasActiveTickets && (
              <>
                <div className="container mx-auto">
                  <div className="text-center pb-2 md:pb-6 md:mt-14 mt-10 text-xl md:text-2xl font-semibold">
                    {t('tickets.active')}
                  </div>
                  <Table
                    headers={[
                      t('tickets.ticket-type'),
                      t('tickets.entries-left'),
                      t('tickets.season-ticket-owner'),
                      '',
                    ]}
                    rows={dataMapped.activeTicketsRows}
                    rowBackgroundClass="bg-blueish"
                  ></Table>
                </div>
                {/* Carousel cannot be in container. */}
                <MobileCarousel className="md:hidden mb-10">
                  {dataMapped.activeTickets.map((ticket, index) => (
                    <Ticket
                      key={index}
                      ticket={ticket}
                      onDetailClick={() => setOpenedTicketDetail(ticket)}
                    ></Ticket>
                  ))}
                </MobileCarousel>
              </>
            )}
            {dataMapped.hasUsedTickets && (
              <>
                <div className="container mx-auto">
                  <div
                    className={cx('text-center pb-2 md:pb-6 text-xl md:text-2xl font-semibold', {
                      'md:mt-24 mt-14': dataMapped.hasActiveTickets,
                      'md:mt-14 mt-10': !dataMapped.hasActiveTickets,
                    })}
                  >
                    {t('tickets.inactive')}
                  </div>

                  <Table
                    headers={[
                      t('tickets.ticket-type'),
                      t('tickets.entry-date'),
                      t('tickets.entry-place'),
                      '',
                    ]}
                    rows={dataMapped.usedTicketsRows}
                    rowBackgroundClass="bg-white"
                  ></Table>
                </div>
                {/* Carousel cannot be in container. */}
                <MobileCarousel className="md:hidden mb-10">
                  {dataMapped.usedTickets.map((ticket, index) => (
                    <UsedTicket
                      key={index}
                      ticket={ticket}
                      onDetailClick={() => setOpenedTicketDetail(ticket)}
                    ></UsedTicket>
                  ))}
                </MobileCarousel>
              </>
            )}

            {!dataMapped.hasTickets && (
              <div className="container mx-auto flex items-center mt-8 md:mt-20 flex-col md:flex-row">
                <div className="grow text-xl md:text-3xl font-bold md:min-w-5/10 mb-8 md:mb-0">
                  {t('tickets.no-tickets')}
                </div>
                <div className="shrink">
                  <img src="/no-tickets.svg" alt="" />
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}

export default TicketsManagementPage
