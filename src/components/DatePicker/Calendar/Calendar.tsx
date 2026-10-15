import { createCalendar } from '@internationalized/date'
import { useRef } from 'react'
import { useCalendar, useLocale } from 'react-aria'
import { useTranslation } from 'react-i18next'
import { useCalendarState } from 'react-stately'

import ButtonComponentLibraryWrapper from '@/components/Button/ButtonComponentLibraryWrapper'
import Icon from '@/components/Icon/Icon'

import CalendarGrid from './CalendarGrid'

interface CalendarBase {
  onConfirm?: () => void
  onReset?: () => void
}

// TODO use 'Calendar' from https://github.com/bratislava/konto.bratislava.sk/blob/master/next/src/components/fields/DatePicker/Calendar.tsx
const Calendar = ({ onConfirm, onReset, ...rest }: CalendarBase) => {
  const { t } = useTranslation()
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
        <ButtonComponentLibraryWrapper
          {...prevButtonPropsFixed}
          variant="icon-wrapped-negative-margin"
          icon={<Icon name="arrow-left" />}
          aria-label={t('calendar.month-back')}
        />
        <span className="text-p2-semibold">{title.charAt(0).toUpperCase() + title.slice(1)}</span>
        <ButtonComponentLibraryWrapper
          {...nextButtonPropsFixed}
          variant="icon-wrapped-negative-margin"
          icon={<Icon name="arrow-right" />}
          aria-label={t('calendar.month-forward')}
        />
      </div>
      <CalendarGrid state={state} />
      <div className="flex items-center justify-between border-t-2 border-gray-700 px-4 py-3">
        <ButtonComponentLibraryWrapper variant="solid" onPress={onReset}>
          {t('common.reset')}
        </ButtonComponentLibraryWrapper>
        <ButtonComponentLibraryWrapper variant="solid" onPress={onConfirm}>
          {t('common.confirm')}
        </ButtonComponentLibraryWrapper>
      </div>
    </div>
  )
}

export default Calendar
