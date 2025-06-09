import React from 'react'
import { Button, Icon } from 'components'

import { createCalendar } from '@internationalized/date'
import { useRef } from 'react'
import { useCalendar, useLocale } from 'react-aria'
import { useCalendarState } from 'react-stately'
import { Button as AriaButton } from 'react-aria-components'

import CalendarGrid from './CalendarGrid'

type CalendarBase = {
  onConfirm?: () => void
  onReset?: () => void
}

const Calendar = ({ onConfirm, onReset, ...rest }: CalendarBase) => {
  const { locale } = useLocale()

  const state = useCalendarState({
    locale: 'sk-SK',
    ...rest,
    createCalendar,
  })
  const ref = useRef<HTMLDivElement>(null)
  const { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar({ ...rest }, state)

  const prevButtonPropsFixed = {
    ...prevButtonProps,
    children: undefined,
    href: undefined,
    target: undefined,
  }

  const nextButtonPropsFixed = {
    ...nextButtonProps,
    children: undefined,
    href: undefined,
    target: undefined,
  }

  return (
    <div
      {...calendarProps}
      ref={ref}
      className="w-full max-w-xs rounded-lg border-2 border-gray-700 bg-white"
    >
      <div className="flex justify-between px-4 py-3">
        <AriaButton {...prevButtonPropsFixed} aria-label="Left">
          <Icon name="arrow-left" className="no-fill font-fontBlack" />
        </AriaButton>
        <span className="text-p2-semibold">{title.charAt(0).toUpperCase() + title.slice(1)}</span>
        <AriaButton {...nextButtonPropsFixed} aria-label="Right">
          <Icon name="arrow-right" className="no-fill font-fontBlack" />
        </AriaButton>
      </div>
      <CalendarGrid state={state} />
      <div className="flex items-center justify-between border-t-2 border-gray-700 px-4 py-3">
        <Button onClick={onReset}>{'Resetovať'}</Button>
        <Button onClick={onConfirm}>{'Potvrdiť'}</Button>
      </div>
    </div>
  )
}

export default Calendar
