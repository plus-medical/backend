const nextMonth = () => {
  const MONTH_IN_MILLISECONDS = 4 * 7 * 24 * 60 * 60 * 1000;
  const date = new Date();
  date.setTime(date.getTime() + MONTH_IN_MILLISECONDS);
  return date;
};

const nextDay = () => {
  const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
  const date = new Date();
  date.setTime(date.getTime() + DAY_IN_MILLISECONDS);
  return date;
};

module.exports = {
  nextMonth,
  nextDay,
};
