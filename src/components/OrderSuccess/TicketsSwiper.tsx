import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'
import './TicketsSwiper.css'

import React from 'react'
import { Pagination } from 'swiper'
import { FinalOrderTicket } from '../../store/order/api'
import cx from 'classnames'

type TicketProps = { ticket: FinalOrderTicket }

const Ticket = ({ ticket }: TicketProps) => {
  return (
    <div className="gap-6 inline-flex flex-col items-center">
      <img className="w-full" src={ticket.qrCode} alt="" />
      <div className="gap-4 flex flex-col items-start w-full">
        <div className="text-center w-full">
          {/*<p className="text-xl font-semibold leading-7 inline m-0">*/}
          {/*  Celodenný lístok*/}
          {/*  <br />*/}
          {/*</p>*/}
          <p className="text-base font-normal leading-6 inline m-0">
            {ticket.isChildren ? 'Detský lístok' : 'Dospelý lístok'}
          </p>
        </div>
      </div>
    </div>
  )
}

type TicketsSwiperProps = { tickets: FinalOrderTicket[] }

const TicketsSwiper = ({ tickets }: TicketsSwiperProps) => {
  return (
    <Swiper pagination={true} modules={[Pagination]} className="w-full h-full" spaceBetween={48}>
      {tickets.map((ticket) => (
        <SwiperSlide key={ticket.id} className={cx({ 'pb-10': tickets.length > 1 })}>
          <Ticket ticket={ticket} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default TicketsSwiper
