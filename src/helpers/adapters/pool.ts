import {
  SwimmingPoolResponse,
  SwimmingPool,
  OpeningHours,
  OpeningHoursStrings,
} from "models";

export const swimmingPoolResponseToSwimmingPool = (
  pool: SwimmingPoolResponse
): SwimmingPool => ({
  ...pool,

  openingHours: pool.openingHours
    ? pool.openingHours.map((hours) => {
        const intermezzo = {
          days: hours.days,
          interval: {
            from: new Date(hours.interval.from),
            to: new Date(hours.interval.to),
          },
        };
        return openingHoursToStringArray(intermezzo);
      })
    : [],
});

export const openingHoursToStringArray = (
  hours: OpeningHours
): OpeningHoursStrings => {
  const intervalString = `${hours.interval.from.getDate()}.${
    hours.interval.from.getMonth() + 1
  }.-${hours.interval.to.getDate()}.${hours.interval.to.getMonth() + 1}.`;
  const dayStringsObjects: {
    first: string;
    last: string;
    from: string;
    to: string;
  }[] = [];

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
      });
    } else {
      if (dayStringsObjects.length !== 0) {
        dayStringsObjects[dayStringsObjects.length - 1].last = day.dayName;
      }
    }
  });

  const dayStrings = dayStringsObjects.map((dayStringObj) => {
    let result = {
      day: "",
      time: "",
    };
    if (dayStringObj.first === dayStringObj.last) {
      result.day = dayStringObj.last.substring(0, 2);
    } else {
      result.day = `${dayStringObj.first.substring(
        0,
        2
      )}-${dayStringObj.last.substring(0, 2)}`;
    }

    result.time = dayStringObj.from && dayStringObj.to ? `${dayStringObj.from} - ${dayStringObj.to}` : "Zatvorené";

    return result;
  });

  return {
    intervalString,
    dayStrings,
  };
};
