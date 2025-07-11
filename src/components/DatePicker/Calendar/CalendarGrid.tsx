import React from 'react'
import { CalendarDate, DateDuration, endOfMonth, getWeeksInMonth } from '@internationalized/date'
import { useCalendarGrid, useLocale } from 'react-aria'
import { CalendarState } from 'react-stately'

import CalendarCell from './CalendarCell'

type CalendarGridBase = {
  state: CalendarState
  offset?: DateDuration
}

const CalendarGrid = ({ state, offset = {}, ...rest }: CalendarGridBase) => {
  const { locale } = useLocale()
  const startDate: CalendarDate = state?.visibleRange?.start.add(offset)
  const endDate = endOfMonth(startDate)
  const { gridProps, headerProps } = useCalendarGrid(
    {
      startDate,
      endDate,
      ...rest,
    },
    state,
  )
  const weeksInMonth = getWeeksInMonth(startDate, 'sk-SK')
  const weeksInMonthArr = Array.from({ length: weeksInMonth }, (_, i) => i + 0)

  const weekDaysCustom = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne']
  const weekDaysCustomEn = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  const weekDays = weekDaysCustom

  return (
    <div {...gridProps} className="flex flex-col items-center">
      <div
        {...headerProps}
        className="flex w-full justify-between border-y-2 border-gray-700 bg-gray-50 p-3 text-p3-medium"
      >
        {weekDays.map((day, index) => (
          <span className="flex h-5 w-10 items-center justify-center" key={index}>
            {day}
          </span>
        ))}
      </div>
      <div className="flex w-full flex-col px-3 py-4">
        {weeksInMonthArr.map((weekIndex: number) => (
          <div className="mb-1 flex justify-between last:mb-0 xs:mb-0" key={weekIndex}>
            {state
              ?.getDatesInWeek(weekIndex, startDate)
              ?.map((date, i) =>
                date ? (
                  <CalendarCell
                    isDisabled={
                      (state.minValue ? date < state.minValue : false) ||
                      (state.maxValue ? date > state.maxValue : false)
                    }
                    key={i}
                    state={state}
                    date={date}
                  />
                ) : (
                  <div key={i} />
                ),
              )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarGrid
