import { AxiosError } from 'axios'
import cx from 'classnames'
import { Button, Icon, Modal, Spinner } from 'components'
import { FormatCurrencyFromCents } from 'helpers/currencyFormatter'
import { ErrorWithMessages, isOneTimeTicket } from 'helpers/general'
import { partition } from 'lodash'
import { Fragment, ReactNode, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import MobileCarousel from '../../components/MobileCarousel/MobileCarousel'
import { useErrorToast } from '../../hooks/useErrorToast'
import { fetchTicketsHistory, TicketFromHistory } from '../../store/tickets-history/api'

const formatDate = (timestamp: number) => new Date(timestamp).toLocaleDateString('sk-SK')
const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString('sk-SK', {
    hour: '2-digit',
    minute: '2-digit',
  })

const TicketsManagementModal = ({
  open,
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
            className="
              hidden w-screen p-10 text-primary
              md:block
            "
            style={{ maxWidth: '1000px' }}
          >
            <div className="mb-5 flex">
              <div className="flex flex-1 flex-col justify-between">
                <div className="mt-4 font-bold">{t('tickets.ticket-detail')}</div>
                <div className="flex justify-between">
                  <div className="mr-8">
                    {t('tickets.ticket-owner')}
                    <span className="font-semibold">{ticket.ownerName}</span>
                  </div>
                  <div className="mr-8">
                    {t('tickets.price-individual')}
                    <span className="font-semibold">
                      <FormatCurrencyFromCents value={ticket.priceWithVat} />
                    </span>
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
            <div className="h-0.5 w-full rounded bg-primary opacity-30"></div>
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left opacity-50">
                  <th className="py-10 font-medium">{t('tickets.place')}</th>
                  <th className="py-10 font-medium">{t('tickets.date')}</th>
                  <th className="py-10 font-medium">{t('tickets.time-in')}</th>
                  <th className="py-10 font-medium">{t('tickets.time-out')}</th>
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
          <div className="
            mb-5 h-full text-primary
            md:hidden
          ">
            <div className="rounded-t-lg bg-blueish px-6 pb-5 pt-8">
              <div className="pb-4 text-xl font-bold">{t('tickets.ticket-detail')}</div>
              <div className="pb-3">
                {t('tickets.ticket-owner')}
                <span className="font-semibold">{ticket.ownerName}</span>
              </div>
              <div className="pb-3">
                {t('tickets.price-individual')}
                <span className="font-semibold">
                  <FormatCurrencyFromCents value={ticket.priceWithVat} />
                </span>
              </div>
              {ticket.remainingEntries != null && ticket.remainingEntries !== 0 && (
                <div>
                  {t('tickets.remaining-entries-indvidual')}
                  <span className="font-semibold">{ticket.remainingEntries}</span>
                </div>
              )}
            </div>
            <div className="mx-6 h-0.5 rounded bg-primary opacity-30"></div>
            <div className="px-6 py-4">
              {ticket.entries.length === 0 && 'Pre zobrazený lístok neexistujú žiadne návštevy.'}
              {ticket.entries.map((entry, index) => (
                <Fragment key={index}>
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
                  <div className="my-4 h-0.5 rounded bg-primary opacity-30"></div>
                </Fragment>
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

// TODO separate to a new file
const Ticket = ({ ticket, onDetailClick }: TicketProps) => {
  const { t } = useTranslation()

  // BE should not send explicit color, but rather button type, therefore we convert it here to real values instead
  // of using the color from the BE.
  const textClass = {
    '#0A07F5': 'text-white',
    '#D0ECF8': 'text-primary',
    '#FFFFFF': 'text-primary',
  }[ticket.ticketColor.background]
  const backgroundClass = {
    '#0A07F5': 'bg-primary',
    '#D0ECF8': 'bg-blueish',
    '#FFFFFF': 'bg-white',
  }[ticket.ticketColor.background]
  const buttonColor = (
    {
      '#0A07F5': 'white',
      '#D0ECF8': 'primary',
      '#FFFFFF': 'primary',
    } as const
  )[ticket.ticketColor.background]

  return (
    <div
      className={`
        mb-6 flex flex-col items-center overflow-auto rounded-lg p-6 shadow-xs
        ${textClass}
        ${backgroundClass}
      `}
    >
      <span className="mb-1 text-2xl font-bold">STARZ</span>
      <img alt="" src={ticket.qrCode} className="mb-6" />
      <span className="mb-3 text-center text-xl font-semibold">{ticket.type}</span>
      <span className="mb-6 text-center">{isOneTimeTicket(ticket) ? '' : ticket.ownerName}</span>
      <div className="flex justify-center">
        <Button
          color={buttonColor}
          className="absolute bg-sunscreen shadow-xs"
          onClick={onDetailClick}
        >
          {t('tickets.ticket-button')}
          <Icon className="no-fill ml-4" name="arrow-right" />
        </Button>
      </div>
    </div>
  )
}

interface TableProps {
  headers: ReactNode[]
  rows: ReactNode[][]
  rowBackgroundClass: string
}

const Table = ({ headers, rows, rowBackgroundClass }: TableProps) => {
  return (
    <table className="
      hidden w-full table-auto
      md:table
    " style={{ borderSpacing: '10px' }}>
      <thead>
        <tr>
          {headers.map((header, index) => {
            const first = index === 0
            const last = index === headers.length - 1

            return (
              <th
                key={index}
                className={cx('py-4', {
                  'pl-10 text-left': first,
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
          <Fragment key={rowIndex}>
            <tr className={`
              ${rowBackgroundClass}
              rounded-lg px-10 py-5 shadow-xs
            `}>
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
          </Fragment>
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
    <div className="
      mb-6 flex flex-col rounded-lg bg-sunscreen px-8 py-6 shadow-xs
    ">
      <div className="flex flex-col pb-6">
        <span>{t('tickets.ticket-type')}</span>
        <span className="text-xl font-semibold">{ticket.type}</span>
      </div>
      <div className="flex flex-col pb-6">
        <span>{t('tickets.entry-date')}</span>
        <span className="text-xl font-semibold">
          {ticket.entries[0] && ticket.entries[0].from && formatDate(ticket.entries[0].from)}
        </span>
      </div>
      <div className="flex flex-col pb-6">
        <span>{t('tickets.price')}</span>
        <span className="text-xl font-semibold">
          <FormatCurrencyFromCents value={ticket.priceWithVat} />
        </span>
      </div>
      <div className="flex justify-center">
        <Button color="blueish" className="absolute shadow-xs" onClick={onDetailClick}>
          {t('tickets.more-info')}
          <Icon className="no-fill ml-4" name="arrow-right" />
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
      (ticket) => ticket.remainingEntries !== 0 && new Date(ticket.validTo) > new Date(),
    )

    const activeTicketsRows = activeTickets.map((ticket) => [
      ticket.type,
      ticket.remainingEntries,
      // don't show owner name for 1 time tickets, so that we don't imply these are bound
      isOneTimeTicket(ticket) ? '' : ticket.ownerName,
      // eslint-disable-next-line react/jsx-key,jsx-a11y/anchor-is-valid
      <a
        role="button"
        onClick={() => setOpenedTicketDetail(ticket)}
        className="font-semibold text-primary underline"
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
          className="font-semibold text-primary underline"
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
                  <div className="
                    mt-10 pb-2 text-center text-xl font-semibold
                    md:mt-14 md:pb-6 md:text-2xl
                  ">
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
                <MobileCarousel className="
                  mb-10
                  md:hidden
                ">
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
                    className={cx(`
                      pb-2 text-center text-xl font-semibold
                      md:pb-6 md:text-2xl
                    `, {
                      'mt-14 md:mt-24': dataMapped.hasActiveTickets,
                      'mt-10 md:mt-14': !dataMapped.hasActiveTickets,
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
                    rowBackgroundClass="bg-sunscreen"
                  ></Table>
                </div>
                {/* Carousel cannot be in container. */}
                <MobileCarousel className="
                  mb-10
                  md:hidden
                ">
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
              <div className="
                container mx-auto mt-8 flex flex-col items-center
                md:mt-20 md:flex-row
              ">
                <div className="
                  mb-8 grow text-xl font-bold
                  md:mb-0 md:min-w-5/10 md:text-3xl
                ">
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
