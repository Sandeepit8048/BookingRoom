// utils/dateUtils.js
export const getCalendarDays = (year, month) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
  
  // Get first day to display (start from Sunday of the first week)
  const startDate = new Date(year, month, 1);
  startDate.setDate(1 - startDayOfWeek);
  
  const days = [];
  for (let i = 0; i < 42; i++) { // 6 rows * 7 days
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const isCurrentMonth = date.getMonth() === month && date.getFullYear() === year;
    days.push({ date, isCurrentMonth });
  }
  return days;
};

export const normalizeRange = (startDate, endDate) => {
  if (!startDate || !endDate) return { start: null, end: null };
  return {
    start: startDate <= endDate ? startDate : endDate,
    end: endDate >= startDate ? endDate : startDate
  };
};

export const isSameDay = (date1, date2) => {
  return date1.toDateString() === date2.toDateString();
};

export const getNightsBetween = (checkIn, checkOut) => {
  const diffTime = Math.abs(checkOut - checkIn);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatMonthYear = (date) => {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

export const getMonthRange = (date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start, end };
};