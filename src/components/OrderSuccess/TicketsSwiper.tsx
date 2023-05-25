import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperClass } from 'swiper/types'

import 'swiper/css'
import 'swiper/css/pagination'
import './TicketsSwiper.css'

import React, { useCallback, useEffect, useState } from 'react'
import { Pagination } from 'swiper'
import { FinalOrderTicket } from '../../store/order/api'
import cx from 'classnames'
import { Button as AriaButton } from 'react-aria-components'
import { Icon } from '../index'

type TicketProps = { ticket: FinalOrderTicket }

const Ticket = ({ ticket }: TicketProps) => {
  return (
    <div className="gap-6 inline-flex flex-col items-center w-full px-8">
      <img className="w-full" src={ticket.qrCode} alt="" />
      {/* TODO: We don't have enough information from BE to display this. */}
      {/*<div className="gap-4 flex flex-col items-start w-full">*/}
      {/*  <div className="text-center w-full">*/}
      {/*    /!*<p className="text-xl font-semibold leading-7 inline m-0">*!/*/}
      {/*    /!*  Celodenný lístok*!/*/}
      {/*    /!*  <br />*!/*/}
      {/*    /!*</p>*!/*/}
      {/*    <p className="text-base font-normal leading-6 inline m-0">*/}
      {/*      {ticket.isChildren ? 'Detský lístok' : 'Dospelý lístok'}*/}
      {/*    </p>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  )
}

type TicketsSwiperProps = { tickets: FinalOrderTicket[] }

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
          className="border-divider border-2 rounded-full w-12 h-12 absolute top-[calc(50%-48px)] -left-6 z-10 flex justify-center items-center bg-white"
          onPress={handlePrevious}
        >
          <Icon name="arrow-left" className="no-fill font-fontBlack" />
        </AriaButton>
      )}
      {displayButtons.next && (
        <AriaButton
          className="border-divider border-2 rounded-full w-12 h-12 absolute top-[calc(50%-48px)] -right-6 z-10 flex justify-center items-center bg-white"
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
          <SwiperSlide key={ticket.id} className={cx({ 'pb-10': tickets.length > 1 })}>
            <Ticket ticket={ticket} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default TicketsSwiper
