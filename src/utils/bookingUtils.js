import { TOTAL_ROOMS } from "../constants/Index";

// ─── BOOKING FILTERS ──────────────────────────────────────────────────────────


export const bookingOccupiesNight = (booking, dateStr) => {
  if (booking.status === "cancelled") return false;
  return booking.checkIn <= dateStr && dateStr < booking.checkOut;
};


export const bookingOverlapsRange = (booking, startStr, endStr, addDaysFn, toDateStrFn, parseDateFn) => {
  if (booking.status === "cancelled") return false;
  const rangeEnd = toDateStrFn(addDaysFn(parseDateFn(endStr), 1));
  return booking.checkIn < rangeEnd && booking.checkOut > startStr;
};

// ─── HEATMAP COLORS ───────────────────────────────────────────────────────────

export const getHeatColor = (count, isCurrentMonth = true) => {
  if (count === 0)
    return isCurrentMonth ? "bg-slate-50" : "bg-slate-50/40";
  const pct = count / TOTAL_ROOMS;
  if (pct <= 0.2) return isCurrentMonth ? "bg-amber-100"  : "bg-amber-100/40";
  if (pct <= 0.4) return isCurrentMonth ? "bg-amber-200"  : "bg-amber-200/40";
  if (pct <= 0.6) return isCurrentMonth ? "bg-orange-300" : "bg-orange-300/40";
  if (pct <= 0.8) return isCurrentMonth ? "bg-orange-400" : "bg-orange-400/40";
  return isCurrentMonth ? "bg-rose-500" : "bg-rose-500/40";
};

export const getHeatTextColor = (count) => {
  if (count === 0) return "text-slate-400";
  const pct = count / TOTAL_ROOMS;
  if (pct <= 0.4) return "text-amber-900";
  if (pct <= 0.6) return "text-orange-900";
  return "text-white";
};

// ─── CSV EXPORT ───────────────────────────────────────────────────────────────

export const exportBookingsCSV = (rows, diffDaysFn, parseDateFn) => {
  const header = [
    "ID", "Guest Name", "Room", "Room Type",
    "Check-in", "Check-out", "Nights", "Guests",
    "Amount", "Currency", "Status", "Source",
  ];
  const lines = rows.map((b) => {
    const nights = diffDaysFn(parseDateFn(b.checkIn), parseDateFn(b.checkOut));
    return [
      b.id, b.guestName, b.roomNumber, b.roomType,
      b.checkIn, b.checkOut, nights, b.guests,
      b.totalAmount, b.currency, b.status, b.source,
    ].join(",");
  });
  const csv  = [header.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "bookings_export.csv";
  a.click();
  URL.revokeObjectURL(url);
};