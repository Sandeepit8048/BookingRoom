// components/StatsHeader.jsx
import React, { useMemo } from 'react';
import { getMonthRange } from '../utils/dateUtils';

const StatsHeader = ({ bookings, currentDate, roomTypeFilter }) => {
  const stats = useMemo(() => {
    const { start, end } = getMonthRange(currentDate);
    const filteredBookings = bookings.filter(b => b.status !== 'cancelled');
    
    // Calculate total revenue for bookings overlapping the month
    const monthBookings = filteredBookings.filter(booking => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      return checkOut > start && checkIn <= end;
    });
    
    const totalRevenue = monthBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    
    // Calculate average occupancy for the month
    const roomTypeMap = {
      all: ['101', '102', '103', '201', '202', '203', '301', '302', '401', '402'],
      Standard: ['101', '102', '103'],
      Deluxe: ['201', '202', '203'],
      Suite: ['301', '302'],
      Penthouse: ['401', '402']
    };
    
    const targetRooms = roomTypeMap[roomTypeFilter] || roomTypeMap.all;
    let totalOccupancy = 0;
    let daysCount = 0;
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const occupiedCount = filteredBookings.filter(booking => {
        if (!targetRooms.includes(booking.roomNumber)) return false;
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        const currentDate = new Date(dateStr);
        return checkIn <= currentDate && checkOut > currentDate;
      }).length;
      totalOccupancy += occupiedCount / targetRooms.length;
      daysCount++;
    }
    
    const avgOccupancy = daysCount > 0 ? (totalOccupancy / daysCount) * 100 : 0;
    
    // Total bookings count
    const totalBookings = monthBookings.length;
    
    return { totalRevenue, avgOccupancy, totalBookings };
  }, [bookings, currentDate, roomTypeFilter]);
  
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
      <h3 className="text-lg font-semibold mb-4 opacity-90">Month Overview</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold">₹{(stats.totalRevenue / 1000).toFixed(0)}k</p>
          <p className="text-xs opacity-80 mt-1">Total Revenue</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{stats.avgOccupancy.toFixed(1)}%</p>
          <p className="text-xs opacity-80 mt-1">Avg Occupancy</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{stats.totalBookings}</p>
          <p className="text-xs opacity-80 mt-1">Bookings</p>
        </div>
      </div>
    </div>
  );
};

export default StatsHeader; 