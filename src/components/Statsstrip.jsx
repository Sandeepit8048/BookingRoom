import { useMemo } from "react";
import { TOTAL_ROOMS } from "../constants";
import { bookingOccupiesNight } from "../utils/bookingUtils";
import { parseDate, diffDays } from "../utils/dateUtils";

const revFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", notation: "compact", maximumFractionDigits: 1,
});

const StatsStrip = ({ bookings, year, month }) => {
  const monthBookings = useMemo(() => {
    const start      = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const daysInMth  = new Date(year, month + 1, 0).getDate();
    const end        = `${year}-${String(month + 1).padStart(2, "0")}-${String(daysInMth).padStart(2, "0")}`;
    return bookings.filter(
      b => b.status !== "cancelled" && b.checkIn <= end && b.checkOut > start,
    );
  }, [bookings, year, month]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const totalOccupancyNights = useMemo(() => {
    let total = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      total += bookings.filter(b => bookingOccupiesNight(b, ds)).length;
    }
    return total;
  }, [bookings, year, month, daysInMonth]);

  const avgOcc = Math.round((totalOccupancyNights / (daysInMonth * TOTAL_ROOMS)) * 100);

  const revenue = monthBookings.reduce((s, b) => s + b.totalAmount, 0);

  const longestStay = monthBookings.reduce((max, b) => {
    const n = diffDays(parseDate(b.checkIn), parseDate(b.checkOut));
    return n > max ? n : max;
  }, 0);

  const roomCounts = {};
  monthBookings.forEach(b => { roomCounts[b.roomType] = (roomCounts[b.roomType] || 0) + 1; });
  const topRoom = Object.entries(roomCounts).sort((a, b) => b[1] - a[1])[0];

  const stats = [
    { label: "Monthly Revenue", value: revFormatter.format(revenue), icon: "💰" },
    { label: "Avg Occupancy",   value: `${avgOcc}%`,                 icon: "📊" },
    { label: "Longest Stay",    value: `${longestStay}d`,            icon: "📅" },
    { label: "Top Room Type",   value: topRoom ? topRoom[0] : "—",   icon: "🏨" },
    { label: "Total Bookings",  value: monthBookings.length,         icon: "📋" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-6">
      {stats.map(s => (
        <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 text-center">
          <p className="text-lg sm:text-xl">{s.icon}</p>
          <p className="text-lg sm:text-2xl font-bold text-slate-800 mt-0.5">{s.value}</p>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 leading-tight">{s.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsStrip;