import 'swiper/css'
import 'swiper/css/pagination'
import './TicketsSwiper.css'

import cx from 'classnames'
import { useCallback, useEffect, useState } from 'react'
import { Button as AriaButton } from 'react-aria-components'
import { Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperClass } from 'swiper/types'

import AppleWalletImage from '../../assets/images/apple_wallet.svg'
import GoogleWalletImage from '../../assets/images/google_wallet.svg'
import { environment } from '../../environment'
import { useAppSelector } from '../../hooks'
import { selectAvailableTicketTypes } from '../../store/global'
import { FinalOrderTicket } from '../../store/order/api'
import { Icon } from '../index'

interface TicketProps {
  ticket: FinalOrderTicket
}

// TODO: investigate if we can pass ticketType from upper component instead of fetching it here
const Ticket = ({ ticket }: TicketProps) => {
  const ticketTypes = useAppSelector(selectAvailableTicketTypes)

  const ticketType = ticketTypes.find((ticketType) => ticketType.id === ticket.ticketTypeId)

  return (
    <div className="inline-flex w-full flex-col items-center gap-6 px-8">
      <img className="w-full" src={ticket.qrCode} alt="" />
      {ticketType && <span className="text-xl font-semibold leading-7">{ticketType.name}</span>}
      <div className="flex flex-col items-center gap-2.5 sm:flex-row">
        <a
          href={`${environment.host}/api/v1/orders/appleWallet/${ticket.id}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Pridať do Peňaženky Apple"
        >
          <img src={AppleWalletImage} alt="" />
        </a>
        <a
          href={`${environment.host}/api/v1/orders/googlePay/${ticket.id}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Pridať do služby Google Peňaženka"
        >
          <img src={GoogleWalletImage} alt="" />
        </a>
      </div>
    </div>
  )
}

interface TicketsSwiperProps {
  tickets: FinalOrderTicket[]
}

const TicketsSwiper = ({ tickets }: TicketsSwiperProps) => {
  const [swiperRef, setSwiperRef] = useState<SwiperClass>()
  const [displayButtons, setDisplayButtons] = useState({ previous: false, next: false })

  const refreshDisplayButtons = useCallback(() => {
    setDisplayButtons({
      previous: !swiperRef?.isBeginning ?? false,
      next: !swiperRef?.isEnd ?? false,
    })
  }, [swiperRef])

  useEffect(() => {
    refreshDisplayButtons()
  }, [refreshDisplayButtons, swiperRef])

  const handlePrevious = useCallback(() => {
    swiperRef?.slidePrev()
  }, [swiperRef])

  const handleNext = useCallback(() => {
    swiperRef?.slideNext()
  }, [swiperRef])

  return (
    <div className="relative">
      {/* Arrows must be implemented on our own to be outside the swiper. */}
      {displayButtons.previous && (
        <AriaButton
          className="absolute -left-6 top-[calc(50%-48px)] z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-divider bg-sunscreen"
          onPress={handlePrevious}
        >
          <Icon name="arrow-left" className="no-fill font-fontBlack" />
        </AriaButton>
      )}
      {displayButtons.next && (
        <AriaButton
          className="absolute -right-6 top-[calc(50%-48px)] z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-divider bg-sunscreen"
          onPress={handleNext}
        >
          <Icon name="arrow-right" className="no-fill font-fontBlack" />
        </AriaButton>
      )}
      <Swiper
        pagination={true}
        modules={[Pagination]}
        spaceBetween={48}
        onSwiper={setSwiperRef}
        onPaginationUpdate={() => refreshDisplayButtons()}
        className="mb-4"
      >
        {tickets.map((ticket) => (
          <SwiperSlide key={ticket.id} className={cx({ 'pb-11': tickets.length > 1 })}>
            <Ticket ticket={ticket} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default TicketsSwiper
