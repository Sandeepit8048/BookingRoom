import { TOTAL_ROOMS } from "../constants";
import { bookingOccupiesNight } from "../utils/bookingUtils";

/**
 * Tooltip
 * Floating dark card shown on hover over a calendar cell.
 *
 * Props:
 *   dateStr  — "YYYY-MM-DD"
 *   bookings — full booking array (filtered)
 *   position — { x, y } in viewport pixels, or null
 */
const Tooltip = ({ dateStr, bookings, position }) => {
  const dayBookings = bookings.filter(b => bookingOccupiesNight(b, dateStr));
  const cancelled   = bookings.filter(
    b => b.status === "cancelled" && b.checkIn <= dateStr && dateStr < b.checkOut,
  );

  if (!position) return null;

  return (
    <div
      className="fixed z-50 bg-slate-900 text-white text-xs rounded-xl shadow-2xl p-3 w-56 pointer-events-none"
      style={{ top: position.y, left: position.x, transform: "translate(-50%, -110%)" }}
    >
      <p className="font-semibold text-slate-200 mb-1.5">
        {new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
          weekday: "short", day: "numeric", month: "short",
        })}
      </p>

      <p className="text-slate-300 mb-1">
        {dayBookings.length}/{TOTAL_ROOMS} rooms occupied
      </p>

      {dayBookings.length > 0 && (
        <div className="space-y-1 mt-2 border-t border-slate-700 pt-2">
          {dayBookings.slice(0, 4).map(b => (
            <div key={b.id} className="flex justify-between items-center">
              <span className="text-slate-300 truncate flex-1 mr-2">{b.guestName}</span>
              <span className="text-slate-400 shrink-0">Rm {b.roomNumber}</span>
            </div>
          ))}
          {dayBookings.length > 4 && (
            <p className="text-slate-500">+{dayBookings.length - 4} more</p>
          )}
        </div>
      )}

      {cancelled.length > 0 && (
        <p className="text-slate-500 mt-1 text-[11px]">{cancelled.length} cancelled</p>
      )}
    </div>
  );
};

export default Tooltip;