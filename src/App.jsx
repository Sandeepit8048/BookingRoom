import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Calendar from './components/Calendar';
import BookingPanel from './components/BookingPanel';
import Filters from './components/Filters';
import StatsHeader from './components/StatsHeader';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [roomTypeFilter, setRoomTypeFilter] = useState('all');
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });

  // Fetch bookings data
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('./booking.json');
        if (!response.ok) throw new Error('Failed to load bookings data');
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleMonthChange = useCallback((newDate) => {
    setCurrentDate(newDate);
  }, []);

  const handleRangeSelect = useCallback((startDate, endDate) => {
    setSelectedRange({ start: startDate, end: endDate });
  }, []);

  if (loading) return <LoadingSpinner />;
  // if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Hotel Occupancy Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Visualize bookings & occupancy heatmap</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Filters 
              roomTypeFilter={roomTypeFilter}
              onRoomTypeChange={setRoomTypeFilter}
            />
            <StatsHeader 
              bookings={bookings}
              currentDate={currentDate}
              roomTypeFilter={roomTypeFilter}
            />
            <Calendar
              bookings={bookings}
              currentDate={currentDate}
              onMonthChange={handleMonthChange}
              onRangeSelect={handleRangeSelect}
              selectedRange={selectedRange}
              roomTypeFilter={roomTypeFilter}
            />
          </div>
          <div className="lg:col-span-1">
            <BookingPanel
              bookings={bookings}
              selectedRange={selectedRange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;