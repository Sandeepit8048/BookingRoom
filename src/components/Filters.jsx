// components/Filters.jsx
import React from 'react';

const Filters = ({ roomTypeFilter, onRoomTypeChange }) => {
  const roomTypes = [
    { value: 'all', label: 'All Rooms', count: 10 },
    { value: 'Standard', label: 'Standard', count: 3 },
    { value: 'Deluxe', label: 'Deluxe', count: 3 },
    { value: 'Suite', label: 'Suite', count: 2 },
    { value: 'Penthouse', label: 'Penthouse', count: 2 }
  ];
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Room Type Filter</h3>
          <p className="text-sm text-gray-500">Filter occupancy heatmap by room category</p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {roomTypes.map(type => (
            <button
              key={type.value}
              onClick={() => onRoomTypeChange(type.value)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${roomTypeFilter === type.value 
                  ? 'bg-indigo-600 text-white shadow-md scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {type.label}
              <span className={`ml-2 text-xs ${roomTypeFilter === type.value ? 'text-indigo-200' : 'text-gray-500'}`}>
                ({type.count})
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;