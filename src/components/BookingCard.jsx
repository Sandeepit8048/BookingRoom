import { STATUS_CONFIG } from "../constants/Index";
import { diffDays, parseDate } from "../utils/dateUtils";

const fmt = (d) =>
  parseDate(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

const amtFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
});


const BookingCard = ({ booking }) => {
  const nights = diffDays(parseDate(booking.checkIn), parseDate(booking.checkOut));
  const sc     = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.confirmed;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 hover:border-indigo-300 hover:shadow-sm transition-all">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 text-sm truncate">{booking.guestName}</p>
          <p className="text-xs text-slate-500 mt-0.5">{booking.id} · {booking.source}</p>
        </div>
        <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sc.color}`}>
          {sc.label}
        </span>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mt-2">
        {[
          ["Room",     `${booking.roomNumber} (${booking.roomType})`],
          ["Nights",   `${nights} night${nights !== 1 ? "s" : ""} · ${booking.guests} guest${booking.guests !== 1 ? "s" : ""}`],
          ["Check-in",  fmt(booking.checkIn)],
          ["Check-out", fmt(booking.checkOut)],
        ].map(([label, value]) => (
          <div key={label} className="bg-slate-50 rounded-lg p-2">
            <p className="text-slate-400 text-[10px] uppercase tracking-wide mb-0.5">{label}</p>
            <p className="font-medium">{value}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">{booking.currency}</span>
        <span className="text-sm font-bold text-slate-800">
          {amtFormatter.format(booking.totalAmount)}
        </span>
      </div>
    </div>
  );
};

export default BookingCard;