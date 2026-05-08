// components/Calendar.jsx
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import CalendarDay from './CalendarDay';
import { 
  getCalendarDays, 
  normalizeRange, 
  isSameDay,
  formatMonthYear 
} from '../utils/dateUtils';
import { calculateOccupancy } from '../utils/occupancyUtils';

const Calendar = ({ 
  bookings, 
  currentDate, 
  onMonthChange, 
  onRangeSelect,
  selectedRange,
  roomTypeFilter 
}) => {
  const [dragState, setDragState] = useState({ isDragging: false, startDate: null });
  const calendarRef = useRef(null);
  
  const days = useMemo(() => {
    return getCalendarDays(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  const occupancyData = useMemo(() => {
    return calculateOccupancy(bookings, days, roomTypeFilter);
  }, [bookings, days, roomTypeFilter]);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    onMonthChange(newDate);
  };

  const handleToday = () => {
    onMonthChange(new Date());
  };

  const isDateInRange = (date) => {
    if (!selectedRange.start || !selectedRange.end) return false;
    const { start, end } = normalizeRange(selectedRange.start, selectedRange.end);
    return date >= start && date <= end;
  };

  const handleMouseDown = (date) => {
    setDragState({ isDragging: true, startDate: date });
    onRangeSelect(date, date);
  };

  const handleMouseEnter = (date) => {
    if (dragState.isDragging && dragState.startDate) {
      onRangeSelect(dragState.startDate, date);
    }
  };

  const handleMouseUp = () => {
    setDragState({ isDragging: false, startDate: null });
  };

  useEffect(() => {
    if (dragState.isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [dragState.isDragging]);

  const getDayProps = (day) => {
    const date = day.date;
    const isSelected = selectedRange.start && selectedRange.end && isDateInRange(date);
    const occupancy = occupancyData.get(date.toISOString().split('T')[0]) || { count: 0, total: 0 };
    
    return {
      date,
      isCurrentMonth: day.isCurrentMonth,
      occupancyCount: occupancy.count,
      totalRooms: occupancy.total,
      isSelected,
      onMouseDown: () => handleMouseDown(date),
      onMouseEnter: () => handleMouseEnter(date),
    };
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-semibold text-gray-800">
          {formatMonthYear(currentDate)}
        </h2>
        
        <div className="flex gap-2">
          <button
            onClick={handleToday}
            className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
          >
            Today
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Next month"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div 
        ref={calendarRef}
        className="grid grid-cols-7 gap-1 select-none"
        style={{ userSelect: 'none' }}
      >
        {days.map((day, index) => (
          <CalendarDay key={index} {...getDayProps(day)} />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-medium">Occupancy Heatmap:</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f0f9ff' }}></div>
              <span className="text-xs text-gray-500">Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#0284c7' }}></div>
              <span className="text-xs text-gray-500">High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;