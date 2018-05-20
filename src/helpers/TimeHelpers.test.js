import {
  validateHours,
  validateMinutes,
  getNormalizedHour,
  getTimeObject,
  // getModifiedMinutes,
  calculateRingsBetweenTime,
  skipCurrentHour
} from './TimeHelpers';

let twentyFourHoursArray;

beforeEach(() => {
  twentyFourHoursArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
});

describe('validateHours', () => {
  it('should return true if valid hour is passed', () => {
    expect(validateHours(0)).toBe(true);
    expect(validateHours(23)).toBe(true);
  });
  it('should return false if invalid hour is passed', () => {
    expect(validateHours(-1)).toBe(false);
    expect(validateHours(24)).toBe(false);
  });
});

describe('validateMinutes', () => {
  it('should return true if valid minute is passed', () => {
    expect(validateMinutes(0)).toBe(true);
    expect(validateMinutes(59)).toBe(true);
  });
  it('should return false if invalid minute is passed', () => {
    expect(validateMinutes(-1)).toBe(false);
    expect(validateMinutes(60)).toBe(false);
  });
});

describe('skipCurrentHour', () => {
  it('should return current hour skipped', () => {
    twentyFourHoursArray
      .slice(0,23)
      .map(hour => expect(skipCurrentHour(hour)).toBe( hour + 1 ));
    expect(skipCurrentHour(23)).toBe(0);
  });
});

describe('getNormalizedHour', () => {
  it('should return hours if passed less than 12', () => {
    twentyFourHoursArray
      .slice(1,12)
      .map( hour => expect(getNormalizedHour(hour)).toBe(hour) );
  });

  it('should return modified hours if passed greater than 12', () => {
    twentyFourHoursArray
      .slice(13)
      .map( hour => expect(getNormalizedHour(hour)).toBe(hour - 12) );
  });

  it('should return correct number for boundaries', () => {
    expect(getNormalizedHour(0)).toBe(12);
    expect(getNormalizedHour(12)).toBe(12);
    expect(getNormalizedHour(13)).toBe(1);
    expect(getNormalizedHour(23)).toBe(11);
  });
});

describe('getTimeObject', () => {
  it('should not break if no value is passed', () => {
    expect(getTimeObject()).toEqual({});
  });

  it('should return time object from string input', () => {
    twentyFourHoursArray
      .map(hour =>
        expect(getTimeObject(`${hour}:00`)).toMatchObject({ hours: hour, minutes: 0 })
      );
  });

  it('should contain modifiedHour in time object if minutes passed is not 00', () => {
    twentyFourHoursArray
      .slice(0,23)
      .map(hour =>
        expect(getTimeObject(`${hour}:10`)).toMatchObject({ modifiedHour: hour+1 })
      );
  });
});

describe('calculateRingsBetweenTime', () => {
  let fullClockCycleArray,
      rangeCounter;
  beforeEach(() => {
    fullClockCycleArray = twentyFourHoursArray.slice(1,13);
    rangeCounter = arr => arr.reduce((acc, cur) => acc + cur, 0);
  });

  it('should be defined', () => {
    expect(calculateRingsBetweenTime).toBeDefined();
  });

  it(`should calculate rings between 24 hour cycle`, () => {
    expect(calculateRingsBetweenTime('01:00', '01:00')).toBe(156);
    expect(calculateRingsBetweenTime('00:00', '00:00')).toBe(156);
    twentyFourHoursArray.map(hour => {
      expect(calculateRingsBetweenTime(`${hour}:00`, `${hour}:00`)).toBe(156);
    });
  });

  it(`should calculate rings between same hour cycle as zero if endTime minute is greater than startTime minute`, () => {
    expect(calculateRingsBetweenTime('01:09', '01:10')).toBe(0);
    twentyFourHoursArray.map(hour => {
      expect(calculateRingsBetweenTime(`${hour}:20`, `${hour}:23`)).toBe(0);
    });
  });

  it(`should calculate rings at the hour if startTime minute is 00 and endTime minute is greater than startTime minute`, () => {
    expect(calculateRingsBetweenTime('00:00', '00:01')).toBe(12);
    expect(calculateRingsBetweenTime('01:00', '01:01')).toBe(1);
    expect(calculateRingsBetweenTime('13:00', '13:01')).toBe(1);
    expect(calculateRingsBetweenTime('23:00', '23:01')).toBe(11);
  });

  it(`should calculate rings in 24 hours cycle scenario`, () => {
    expect(calculateRingsBetweenTime('01:10', '01:00')).toBe(156);
  });

  it('should count 2 bells between 1:10 - 2:20', () => {
    expect(calculateRingsBetweenTime('01:10', '02:20')).toBe(rangeCounter([2]));
  });

  it('should count 3 bells', () => {
    let result = rangeCounter([1, 2]);
    expect(calculateRingsBetweenTime('01:00', '02:20')).toBe(result);
    expect(calculateRingsBetweenTime('00:10', '02:20')).toBe(result);
    expect(calculateRingsBetweenTime('13:00', '14:00')).toBe(result);
  });

  it('should count 5 bells', () => {
    let result = rangeCounter([2, 3]);
    expect(calculateRingsBetweenTime('1:10', '03:20')).toBe(result);
    expect(calculateRingsBetweenTime('2:00', '03:20')).toBe(result);
  });

  it(`should calculate rings at the hour in calculation '01:00', '03:00'`, () => {
    expect(calculateRingsBetweenTime('01:00', '03:00')).toBe(6);
  });

  it(`should calculate rings at the hour in calculation '00:00', '03:20'`, () => {
    expect(calculateRingsBetweenTime('00:00', '03:20')).toBe(18);
  });

  it(`should calculate rings between '01:00', '00:00'`, () => {
    let result = rangeCounter([...fullClockCycleArray, ...fullClockCycleArray]);
    expect(calculateRingsBetweenTime('01:00', '12:00')).toBe(78);
    expect(calculateRingsBetweenTime('01:00', '00:00')).toBe(result);
  });

  it(`should calculate rings at the hour in calculation '01:00', '14:00'`, () => {
    expect(calculateRingsBetweenTime('01:00', '14:00')).toBe(81);
  });

  it('should pass initial requirement test case', () => {
    expect(calculateRingsBetweenTime('2:00', '3:00')).toBe(5);
    expect(calculateRingsBetweenTime('14:00', '15:00')).toBe(5);
    expect(calculateRingsBetweenTime('14:23', '15:42')).toBe(3);
    expect(calculateRingsBetweenTime('23:00', '1:00')).toBe(24);
  });
});