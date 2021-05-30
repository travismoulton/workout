import { useState, useEffect, useRef } from 'react';

import classes from './DatePicker.module.css';

const DatePicker = (props) => {
  const daysMap = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const monthsMap = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayInMilliSeconds = 6 * 60 * 24 * 1000;

  // Getting a time stamp of the current day at noon
  const todayTimeStamp =
    Date.now() -
    (Date.now() % dayInMilliSeconds) +
    new Date().getTimezoneOffset() * 1000 * 60;

  const DATE = new Date();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [stateLevelYear, setStateLevelYear] = useState(DATE.getFullYear());
  const [stateLevelMonth, setStateLevelMonth] = useState(DATE.getMonth());
  const [selectedDay, setSelectedDay] = useState(todayTimeStamp);
  const [monthDetails, setMonthDetails] = useState(
    getMonthDetails(stateLevelYear, stateLevelMonth)
  );
  const inputRef = useRef(null);

  const addBackDrop = (e) => {
    if (showDatePicker) setShowDatePicker(false);
  };

  const getNumberOfDays = (year, month) =>
    40 - new Date(year, month, 40).getDate();

  const getDayDetails = (args) => {
    const date = args.index - args.firstDay;
    // getting the day as a value 0 - 6
    const day = args.index % 7;
    let prevMonth = args.month - 1;
    let prevYear = args.year - 1;

    // If january, move the calendar back to last year
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }

    const prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);

    // At the begining of the month, for days from the previous month calculate the appropriate date
    // by subtracting the number of days from that month by the index.

    // If it is not from the current month, get the date by using date modulus number of days. This
    // will account for days that spill into the next month.
    const _date =
      (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;

    const month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
    const timeStamp = new Date(args.year, args.month, _date).getTime();

    return {
      date: _date,
      day,
      month,
      timeStamp,
      dayString: daysMap[day],
    };
  };

  const getMonthDetails = (year, month) => {
    const firstDay = new Date(year, month).getDate(); // Get day of the month
    const numberOfDays = getNumberOfDays(year, month);
    const monthArr = [];
    const rows = 6;
    const columns = 7;
    let currentDay = null;
    let index = 0;

    rows.forEach((row) => {
      columns.forEach((column) => {
        currentDay = getDayDetails({
          index,
          numberOfDays,
          firstDay,
          year,
          month,
        });
        monthArr.push(currentDay);
        index++;
      });
    });

    return monthArr;
  };

  const isCurrentDay = (day) => day.timeStamp === todayTimeStamp;

  const isSelectedDay = (day) => day.timeStamp === selectedDay;

  const getDateFromDateString = (dateValue) => {
    const dateDetails = dateValue.split('-').map((d) => parseInt(d, 10));
    if (dateDetails.length < 3) return null;

    const [year, month, date] = dateDetails;

    return { year, month, date };

    // const year = dateDetails[0];
    // const month = dateDetails[1];
    // const date = dateDetails[2];
  };

  const getMonthStr = (month) =>
    monthsMap[Math.max(Math.min(11, month), 0)] || 'Month';

  const getDateStringFromTimestamp = (timeStamp) => {
    const dateObj = new Date(timeStamp);
    const month = dateObj.getMonth() + 1;
    const date = dateObj.getDate();

    return `${dateObj.getFullYear()}-${month < 10 ? '0' + month : month}-${
      date < 10 ? '0' + date : date
    } `;
  };

  const setDate = (dateDetails) => {
    const date = new Date(
      dateDetails.year,
      dateDetails.month - 1,
      dateDetails.date
    ).getTime();

    setSelectedDay(date);

    // Not sure about this. I believe it's so I can pass the date to parent component
    if (props.onChange) props.onChange(date);
  };

  const updateDateFromInput = () => {
    const dateValue = inputRef.current.value;
    const dateDetails = getDateFromDateString(dateValue);

    if (dateDetails) {
      setDate(dateDetails);
      setStateLevelYear(dateDetails.year);
      setStateLevelMonth(dateDetails.month - 1);
      setMonthDetails(getMonthDetails(dateDetails.year, dateDetails.month - 1));
    }
  };

  useEffect(() => {
    window.addEventListener('click', addBackDrop);

    return window.removeEventListener('click', addBackDrop);
  });

  return (
    <div className={classes.DatePicker}>
      <div className={classes.Input} onClick={() => setShowDatePicker(true)}>
        <input type="date" />
      </div>
      {showDatePicker ? <div className={classes.Container}></div> : ''}
    </div>
  );
};

export default DatePicker;
