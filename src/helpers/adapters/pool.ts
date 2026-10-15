import i18n from '@/i18n'
import { OpeningHours, OpeningHoursStrings, SwimmingPool, SwimmingPoolResponse } from '@/models'

export const swimmingPoolResponseToSwimmingPool = (pool: SwimmingPoolResponse): SwimmingPool => ({
  ...pool,

  openingHours: pool.openingHours
    ? pool.openingHours.map((hours) => {
        const intermezzo = {
          days: hours.days,
          interval: {
            from: new Date(hours.interval.from),
            to: new Date(hours.interval.to),
          },
        }

        return openingHoursToStringArray(intermezzo)
      })
    : [],
})

export const openingHoursToStringArray = (hours: OpeningHours): OpeningHoursStrings => {
  const intervalString = `${hours.interval.from.getDate()}.${
    hours.interval.from.getMonth() + 1
  }.-${hours.interval.to.getDate()}.${hours.interval.to.getMonth() + 1}.`
  const dayStringsObjects: {
    first: string
    last: string
    from: string
    to: string
  }[] = []

  hours.days.forEach((day) => {
    if (
      dayStringsObjects.length === 0 ||
      !(
        day.from === dayStringsObjects[dayStringsObjects.length - 1].from &&
        day.to === dayStringsObjects[dayStringsObjects.length - 1].to
      )
    ) {
      dayStringsObjects.push({
        first: day.dayName,
        last: day.dayName,
        from: day.from,
        to: day.to,
      })
    } else if (dayStringsObjects.length !== 0) {
      dayStringsObjects[dayStringsObjects.length - 1].last = day.dayName
    }
  })

  const dayStrings = dayStringsObjects.map((dayStringObj) => {
    const result = {
      day: '',
      time: '',
      color: '',
    }
    if (dayStringObj.first === dayStringObj.last) {
      result.day = dayStringObj.last.substring(0, 2)
    } else {
      result.day = `${dayStringObj.first.substring(0, 2)}-${dayStringObj.last.substring(0, 2)}`
    }

    const isOpen = dayStringObj.from && dayStringObj.to
    result.time = isOpen ? `${dayStringObj.from} - ${dayStringObj.to}` : i18n.t('pools.closed')
    result.color = !isOpen && dayStringObj.first === dayStringObj.last ? 'error' : ''

    return result
  })

  return {
    intervalString,
    dayStrings,
  }
}
