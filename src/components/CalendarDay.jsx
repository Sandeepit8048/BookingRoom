// components/CalendarDay.jsx
import React from 'react';
import { getHeatmapColor, formatDate } from '../utils/colorUtils';

const CalendarDay = ({ 
  date, 
  isCurrentMonth, 
  occupancyCount, 
  totalRooms, 
  isSelected,
  onMouseDown,
  onMouseEnter
}) => {
  const occupancyPercentage = totalRooms > 0 ? occupancyCount / totalRooms : 0;
  const backgroundColor = getHeatmapColor(occupancyPercentage);
  
  const baseClasses = `
    relative aspect-square p-2 rounded-lg transition-all duration-200 cursor-pointer
    ${isCurrentMonth ? 'hover:scale-105 hover:shadow-md' : 'opacity-40 hover:opacity-60'}
    ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 shadow-lg' : ''}
  `;
  
  return (
    <div
      className={baseClasses}
      style={{ backgroundColor }}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      data-date={formatDate(date)}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <span className={`text-sm font-medium ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}`}>
          {date.getDate()}
        </span>
        {isCurrentMonth && totalRooms > 0 && (
          <span className="text-xs mt-1 font-semibold text-gray-600 bg-white/50 px-1 rounded">
            {occupancyCount}/{totalRooms}
          </span>
        )}
      </div>
    </div>
  );
};

export default CalendarDay;