// ─── CONSTANTS ────────────────────────────────────────────────────────────────

export const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const TOTAL_ROOMS = 10;

export const STATUS_CONFIG = {
  confirmed:   { label: "Confirmed",   color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  checked_in:  { label: "Checked In",  color: "bg-blue-100 text-blue-800 border-blue-200" },
  checked_out: { label: "Checked Out", color: "bg-slate-100 text-slate-700 border-slate-200" },
  cancelled:   { label: "Cancelled",   color: "bg-red-100 text-red-700 border-red-200" },
};

export const ROOM_TYPES   = ["All", "Standard", "Deluxe", "Suite", "Penthouse"];
export const SOURCES      = ["All", "Direct", "Airbnb", "Booking.com", "Expedia", "Agoda", "Walk-in"];
export const STATUSES     = ["All", "confirmed", "checked_in", "checked_out", "cancelled"];

export const BAR_COLORS = {
  confirmed:   "bg-emerald-400",
  checked_in:  "bg-blue-400",
  checked_out: "bg-slate-400",
  cancelled:   "bg-red-300",
};