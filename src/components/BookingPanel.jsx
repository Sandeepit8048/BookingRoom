// components/BookingPanel.jsx
import React, { useMemo } from 'react';
import { normalizeRange, getNightsBetween } from '../utils/dateUtils';

const BookingPanel = ({ bookings, selectedRange }) => {
  const overlappingBookings = useMemo(() => {
    if (!selectedRange.start || !selectedRange.end) {
      return [];
    }
    
    const { start, end } = normalizeRange(selectedRange.start, selectedRange.end);
    
    return bookings
      .filter(booking => {
        if (booking.status === 'cancelled') return false;
        
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        // Booking overlaps if: checkOut > rangeStart AND checkIn <= rangeEnd
        return checkOut > start && checkIn <= end;
      })
      .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));
  }, [bookings, selectedRange]);
  
  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      checked_in: 'bg-blue-100 text-blue-800',
      checked_out: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };
  
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  if (!selectedRange.start || !selectedRange.end) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 h-full">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking Details</h3>
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>Select a date range to view bookings</p>
          <p className="text-sm mt-2">Click and drag across dates</p>
        </div>
      </div>
    );
  }
  
  const { start, end } = normalizeRange(selectedRange.start, selectedRange.end);
  const nightCount = getNightsBetween(start, end) + 1;
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Booking Details</h3>
        <p className="text-sm text-gray-500 mt-1">
          {formatDate(start.toISOString())} - {formatDate(end.toISOString())}
          <span className="ml-2 text-indigo-600 font-medium">({nightCount} {nightCount === 1 ? 'night' : 'nights'})</span>
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto max-h-[600px]">
        {overlappingBookings.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No bookings in this range</p>
          </div>
        ) : (
          <div className="space-y-3">
            {overlappingBookings.map(booking => {
              const nights = getNightsBetween(new Date(booking.checkIn), new Date(booking.checkOut));
              return (
                <div key={booking.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{booking.guestName}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">Room:</span> {booking.roomNumber} ({booking.roomType})
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Check-in:</span> {formatDate(booking.checkIn)}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Check-out:</span> {formatDate(booking.checkOut)}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Nights:</span> {nights}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Source:</span> {booking.source}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPanel;