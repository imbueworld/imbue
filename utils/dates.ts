import moment, { MomentInput } from "moment";

// import {sentenceCase} from 'sentence-case';
export const MONTH_NAMES_With_Year = [
  'Jan 2021',
  'Feb 2021',
  'Mar 2021',
  'Apr 2021',
  'May 2021',
  'Jun 2021',
  'Jul 2021',
  'Aug 2021',
  'Sep 2021',
  'Oct 2021',
  'Nov 2021',
  'Dec 2021',
  '',
];
export const MONTH = [
  'Jan-2021',
  'Feb-2021',
  'Mar-2021',
  'Apr-2021',
  'May-2021',
  'Jun-2021',
  'Jul-2021',
  'Aug-2021',
  'Sep-2021',
  'Oct-2021',
  'Nov-2021',
  'Dec-2021',
];

const THREE_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const FULL_DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
export const getDay = (n: number, d: Date) => {
  const date = new Date(d);
  date.setDate(date.getDate() + n);
  return {
    fullDate: date,
    date: date.getDate(),
    day: THREE_DAYS[date.getDay()],
    month: MONTH[date.getMonth()],
    fullDay: FULL_DAYS[date.getDay()],
    year: date.getFullYear(),
  };
};
export const getMonth = (n: number) => {
  const date = moment(String(n), 'M').format('MMMM YYYY');
  const dateId = moment(String(n), 'M').format('YYYY-MM')
  // date.setDate(date.getDate() + n);
  console.log(date, "DATE");
  console.log(dateId, 'DATEID')
  return {
    fullDate: date,
    month: date,
    name: date,
    id: dateId,
  };
};
export function getDaysArrayByMonth(t: MomentInput) {
  var daysInMonth = moment(t).month();
  console.log(daysInMonth, "daysInMonth")
  var arrDays = [];

  while (daysInMonth) {
    var current = moment(t).date(daysInMonth);
    arrDays.push(current);
    daysInMonth--;
  }
  return arrDays;
}
export const getFullDate = (selectedDate: Date) => {
  const date = new Date(selectedDate);
  // const diff = selectedTime.split(':');
  // date.setHours(Number(diff[0]) + (diff[1].split(' ')[1] === 'AM' ? 0 : 12));
  // date.setMinutes(Number(diff[1].split(' ')[0]));
  date.setSeconds(0);
  date.setMilliseconds(0);
  return {
    date: date.getDate(),
    day: FULL_DAYS[date.getDay()],
    month: MONTH_NAMES_With_Year[date.getMonth()],
    hours: date.getHours(),
    minutes: date.getMinutes(),
    fullDate: date,
  };
};
