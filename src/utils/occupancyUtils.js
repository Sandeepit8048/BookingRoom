// utils/occupancyUtils.js
export const calculateOccupancy = (bookings, days, roomTypeFilter) => {
  const roomTypeMap = {
    all: ['101', '102', '103', '201', '202', '203', '301', '302', '401', '402'],
    Standard: ['101', '102', '103'],
    Deluxe: ['201', '202', '203'],
    Suite: ['301', '302'],
    Penthouse: ['401', '402']
  };
  
  const targetRooms = roomTypeMap[roomTypeFilter] || roomTypeMap.all;
  const totalRooms = targetRooms.length;
  
  const activeBookings = bookings.filter(b => b.status !== 'cancelled');
  
  const occupancyMap = new Map();
  
  days.forEach(day => {
    const dateKey = day.date.toISOString().split('T')[0];
    let occupiedCount = 0;
    
    activeBookings.forEach(booking => {
      if (!targetRooms.includes(booking.roomNumber)) return;
      
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const currentDate = new Date(dateKey);
      
      if (checkIn <= currentDate && checkOut > currentDate) {
        occupiedCount++;
      }
    });
    
    occupancyMap.set(dateKey, { count: occupiedCount, total: totalRooms });
  });
  
  return occupancyMap;
};