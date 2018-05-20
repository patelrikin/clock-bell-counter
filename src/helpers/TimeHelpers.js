export const validateHours = hours => hours > -1 && hours < 24;

export const validateMinutes = minutes => minutes > -1 && minutes < 60;

export const isValidHour = hour => {
  hour = Number(hour);
  return validateHours(hour)
};

export const isValidMinute = minute => {
  minute = Number(minute);
  return validateMinutes(minute)
};

export const shouldRing = minutes => minutes === 0;

export const skipCurrentHour = hours => (hours === 23 ? 0 : hours + 1);

export const getNormalizedHour = hours => {
  hours = Number(hours);
  return (hours > 12 ? hours - 12 : hours === 0 ? 12 : hours);
}

export const getTimeObject = (timeString = '') => {
  if ( !timeString ) return {};

  let [ hours, minutes ] = timeString.split(':').map(Number);

  // get Next ringable hour
  let modifiedHour = shouldRing(minutes) ? hours : skipCurrentHour(hours);

  return {
    hours,
    minutes,
    modifiedHour
  };
}

export const countRings = (start, end) => {
  let totalRings = 0

  for ( let i = start; i <= end; i++ ) {
    totalRings += getNormalizedHour(i);
  }

  return totalRings;
}

export const calculateRingsBetweenTime = (startString, endString) => {
  let startTimeObj = getTimeObject(startString);
  let endTimeObj = getTimeObject(endString);

  let hoursBetween = endTimeObj.hours - startTimeObj.hours;

  if (hoursBetween === 0) { // OR just do falsy check, !hoursBetween
    // Case when both hours are same, go manual no need to use user data
    return countRings(0, 11) * 2;
  }

  if (hoursBetween > 0) {
    // Case when no midnight involved
    return countRings(startTimeObj.modifiedHour, endTimeObj.hours);
  }

  // Case when after midnight hours need to be calculated
  return countRings(startTimeObj.modifiedHour, 23) + countRings(0, endTimeObj.hours);
};