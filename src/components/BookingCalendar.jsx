import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const TOTAL_ROOMS = 10;
const STATUS_CONFIG = {
  confirmed:    { label: "Confirmed",    color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  checked_in:   { label: "Checked In",   color: "bg-blue-100 text-blue-800 border-blue-200" },
  checked_out:  { label: "Checked Out",  color: "bg-slate-100 text-slate-700 border-slate-200" },
  cancelled:    { label: "Cancelled",    color: "bg-red-100 text-red-700 border-red-200" },
};

// ─── DATE UTILITIES ──────────────────────────────────────────────────────────
const toDateStr = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const parseDate = (str) => {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const diffDays = (a, b) => Math.round((b - a) / 86400000);
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

// Night occupancy: checkIn <= night < checkOut (exclusive checkout)
const bookingOccupiesNight = (booking, dateStr) => {
  if (booking.status === "cancelled") return false;
  return booking.checkIn <= dateStr && dateStr < booking.checkOut;
};

const bookingOverlapsRange = (booking, startStr, endStr) => {
  if (booking.status === "cancelled") return false;
  // booking overlaps if checkIn < rangeEnd+1 && checkOut > rangeStart
  const rangeEnd = toDateStr(addDays(parseDate(endStr), 1));
  return booking.checkIn < rangeEnd && booking.checkOut > startStr;
};

// ─── HEATMAP COLOR ───────────────────────────────────────────────────────────
const getHeatColor = (count, isCurrentMonth = true) => {
  if (count === 0) return isCurrentMonth ? "bg-slate-50" : "bg-slate-50/40";
  const pct = count / TOTAL_ROOMS;
  if (pct <= 0.2) return isCurrentMonth ? "bg-amber-100" : "bg-amber-100/40";
  if (pct <= 0.4) return isCurrentMonth ? "bg-amber-200" : "bg-amber-200/40";
  if (pct <= 0.6) return isCurrentMonth ? "bg-orange-300" : "bg-orange-300/40";
  if (pct <= 0.8) return isCurrentMonth ? "bg-orange-400" : "bg-orange-400/40";
  return isCurrentMonth ? "bg-rose-500" : "bg-rose-500/40";
};
const getHeatTextColor = (count) => {
  if (count === 0) return "text-slate-400";
  const pct = count / TOTAL_ROOMS;
  if (pct <= 0.4) return "text-amber-900";
  if (pct <= 0.6) return "text-orange-900";
  return "text-white";
};

// ─── MINI OCCUPANCY BAR ──────────────────────────────────────────────────────
const OccupancyBar = ({ count }) => {
  const pct = Math.round((count / TOTAL_ROOMS) * 100);
  const color = count === 0 ? "bg-slate-200"
    : pct <= 40 ? "bg-amber-400"
    : pct <= 70 ? "bg-orange-400"
    : "bg-rose-500";
  return (
    <div className="w-full h-1 rounded-full bg-slate-200 mt-1">
      <div className={`h-1 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
};

// ─── TOOLTIP ─────────────────────────────────────────────────────────────────
const Tooltip = ({ dateStr, bookings, position }) => {
  const dayBookings = bookings.filter(b => bookingOccupiesNight(b, dateStr));
  const cancelled = bookings.filter(b => b.status === "cancelled" && b.checkIn <= dateStr && dateStr < b.checkOut);
  if (!position) return null;
  return (
    <div
      className="fixed z-50 bg-slate-900 text-white text-xs rounded-xl shadow-2xl p-3 w-56 pointer-events-none"
      style={{ top: position.y, left: position.x, transform: "translate(-50%, -110%)" }}
    >
      <p className="font-semibold text-slate-200 mb-1.5">
        {new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
      </p>
      <p className="text-slate-300 mb-1">{dayBookings.length}/{TOTAL_ROOMS} rooms occupied</p>
      {dayBookings.length > 0 && (
        <div className="space-y-1 mt-2 border-t border-slate-700 pt-2">
          {dayBookings.slice(0, 4).map(b => (
            <div key={b.id} className="flex justify-between items-center">
              <span className="text-slate-300 truncate flex-1 mr-2">{b.guestName}</span>
              <span className="text-slate-400 shrink-0">Rm {b.roomNumber}</span>
            </div>
          ))}
          {dayBookings.length > 4 && <p className="text-slate-500">+{dayBookings.length - 4} more</p>}
        </div>
      )}
      {cancelled.length > 0 && (
        <p className="text-slate-500 mt-1 text-[11px]">{cancelled.length} cancelled</p>
      )}
    </div>
  );
};

// ─── DAY CELL ─────────────────────────────────────────────────────────────────
const DayCell = ({
  dateStr, dayNum, isCurrentMonth, occupancy, isToday,
  isSelected, isDragStart, isDragEnd, isInRange,
  onMouseDown, onMouseEnter, onMouseUp, onClick,
  bookings, showTooltip,
}) => {
  const cellRef = useRef(null);
  const [tooltipPos, setTooltipPos] = useState(null);

  const handleMouseEnterCell = (e) => {
    onMouseEnter(dateStr);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
  };
  const handleMouseLeaveCell = () => {
    setTooltipPos(null);
  };

  const heatBg = getHeatColor(occupancy, isCurrentMonth);
  const heatText = getHeatTextColor(occupancy);

  let borderClass = "border border-slate-200/60";
  let ringClass = "";
  if (isSelected || isInRange) {
    borderClass = "border border-indigo-400";
    ringClass = "ring-1 ring-inset ring-indigo-300";
  }
  if (isToday && isCurrentMonth) {
    borderClass = "border-2 border-indigo-600";
  }

  const bgOverlay = isInRange
    ? "bg-indigo-100/70"
    : isSelected
    ? "bg-indigo-200/80"
    : "";

  const dimClass = !isCurrentMonth ? "opacity-40" : "";

  return (
    <div
      ref={cellRef}
      className={`relative rounded-lg cursor-pointer select-none transition-all duration-150
        ${heatBg} ${borderClass} ${ringClass} ${dimClass}
        hover:scale-[1.03] hover:z-10 hover:shadow-md active:scale-95`}
      style={{ minHeight: "72px" }}
      onMouseDown={() => onMouseDown(dateStr)}
      onMouseEnter={handleMouseEnterCell}
      onMouseLeave={handleMouseLeaveCell}
      onMouseUp={() => onMouseUp(dateStr)}
      onClick={() => onClick(dateStr)}
    >
      {(isInRange || isSelected) && (
        <div className={`absolute inset-0 rounded-lg ${bgOverlay} pointer-events-none z-0`} />
      )}
      <div className="relative z-10 p-1.5 sm:p-2 flex flex-col h-full">
        <div className="flex items-start justify-between">
          <span className={`text-xs sm:text-sm font-semibold leading-none
            ${isToday && isCurrentMonth ? "text-indigo-700" : heatText}`}>
            {dayNum}
          </span>
          {occupancy > 0 && (
            <span className={`text-[9px] sm:text-[10px] font-bold leading-none ${heatText} opacity-80`}>
              {occupancy}/{TOTAL_ROOMS}
            </span>
          )}
        </div>
        <div className="mt-auto">
          <OccupancyBar count={occupancy} />
        </div>
      </div>
      {showTooltip && tooltipPos && (
        <Tooltip dateStr={dateStr} bookings={bookings} position={tooltipPos} />
      )}
    </div>
  );
};

// ─── BOOKING CARD ─────────────────────────────────────────────────────────────
const BookingCard = ({ booking }) => {
  const nights = diffDays(parseDate(booking.checkIn), parseDate(booking.checkOut));
  const sc = STATUS_CONFIG[booking.status] || STATUS_CONFIG.confirmed;
  const fmt = (d) => parseDate(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const amtFmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(booking.totalAmount);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 hover:border-indigo-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 text-sm truncate">{booking.guestName}</p>
          <p className="text-xs text-slate-500 mt-0.5">{booking.id} · {booking.source}</p>
        </div>
        <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sc.color}`}>
          {sc.label}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mt-2">
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-slate-400 text-[10px] uppercase tracking-wide mb-0.5">Room</p>
          <p className="font-medium">{booking.roomNumber} <span className="text-slate-400">({booking.roomType})</span></p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-slate-400 text-[10px] uppercase tracking-wide mb-0.5">Nights</p>
          <p className="font-medium">{nights} night{nights !== 1 ? "s" : ""} · {booking.guests} guest{booking.guests !== 1 ? "s" : ""}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-slate-400 text-[10px] uppercase tracking-wide mb-0.5">Check-in</p>
          <p className="font-medium">{fmt(booking.checkIn)}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-slate-400 text-[10px] uppercase tracking-wide mb-0.5">Check-out</p>
          <p className="font-medium">{fmt(booking.checkOut)}</p>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">{booking.currency}</span>
        <span className="text-sm font-bold text-slate-800">{amtFmt}</span>
      </div>
    </div>
  );
};

// ─── STATS STRIP ─────────────────────────────────────────────────────────────
const StatsStrip = ({ bookings, year, month }) => {
  const monthBookings = useMemo(() => {
    const start = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const end = `${year}-${String(month + 1).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;
    return bookings.filter(b =>
      b.status !== "cancelled" &&
      b.checkIn <= end && b.checkOut > start
    );
  }, [bookings, year, month]);

  const revenue = monthBookings.reduce((s, b) => s + b.totalAmount, 0);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let totalOccupancyNights = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const occ = bookings.filter(b => bookingOccupiesNight(b, ds)).length;
    totalOccupancyNights += occ;
  }
  const avgOcc = Math.round((totalOccupancyNights / (daysInMonth * TOTAL_ROOMS)) * 100);

  const longestStay = monthBookings.reduce((max, b) => {
    const n = diffDays(parseDate(b.checkIn), parseDate(b.checkOut));
    return n > max ? n : max;
  }, 0);

  const roomCounts = {};
  monthBookings.forEach(b => { roomCounts[b.roomType] = (roomCounts[b.roomType] || 0) + 1; });
  const topRoom = Object.entries(roomCounts).sort((a, b) => b[1] - a[1])[0];

  const revFmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", notation: "compact", maximumFractionDigits: 1 }).format(revenue);

  const stats = [
    { label: "Monthly Revenue", value: revFmt, icon: "💰" },
    { label: "Avg Occupancy", value: `${avgOcc}%`, icon: "📊" },
    { label: "Longest Stay", value: `${longestStay}d`, icon: "📅" },
    { label: "Top Room Type", value: topRoom ? topRoom[0] : "—", icon: "🏨" },
    { label: "Total Bookings", value: monthBookings.length, icon: "📋" },
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

// ─── HEATMAP LEGEND ──────────────────────────────────────────────────────────
const Legend = () => (
  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-500">
    <span>Low</span>
    {[0, 2, 4, 7, 9, 10].map(n => (
      <div key={n} className={`w-4 h-4 sm:w-5 sm:h-5 rounded ${getHeatColor(n)} border border-slate-200/60`} title={`${n} rooms`} />
    ))}
    <span>High</span>
  </div>
);

// ─── FILTER BAR ──────────────────────────────────────────────────────────────
const FilterBar = ({ filters, onChange, onExport }) => {
  const roomTypes = ["All", "Standard", "Deluxe", "Suite", "Penthouse"];
  const sources = ["All", "Direct", "Airbnb", "Booking.com", "Expedia", "Agoda", "Walk-in"];
  const statuses = ["All", "confirmed", "checked_in", "checked_out", "cancelled"];

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">Filters</span>

      <select
        value={filters.roomType}
        onChange={e => onChange({ ...filters, roomType: e.target.value })}
        className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        {roomTypes.map(t => <option key={t}>{t}</option>)}
      </select>

      <select
        value={filters.source}
        onChange={e => onChange({ ...filters, source: e.target.value })}
        className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        {sources.map(s => <option key={s}>{s}</option>)}
      </select>

      <select
        value={filters.status}
        onChange={e => onChange({ ...filters, status: e.target.value })}
        className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        {statuses.map(s => <option key={s}>{s}</option>)}
      </select>

      {(filters.roomType !== "All" || filters.source !== "All" || filters.status !== "All") && (
        <button
          onClick={() => onChange({ roomType: "All", source: "All", status: "All" })}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          Clear
        </button>
      )}

      <div className="ml-auto">
        <button
          onClick={onExport}
          className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          Export CSV
        </button>
      </div>
    </div>
  );
};

// ─── SEARCH BAR ──────────────────────────────────────────────────────────────
const SearchBar = ({ value, onChange }) => (
  <div className="relative mb-4">
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      placeholder="Search guest name..."
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-slate-700 placeholder-slate-400"
    />
    {value && (
      <button onClick={() => onChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function BookingCalendar() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const today = new Date();
  const todayStr = toDateStr(today);

  // Restore last-viewed month from sessionStorage (persistence bonus)
  const savedState = (() => {
    try {
      const s = sessionStorage.getItem("guestara_last_view");
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  })();
  const [viewYear, setViewYear] = useState(savedState?.year ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(savedState?.month ?? today.getMonth());

  const [selStart, setSelStart] = useState(null);
  const [selEnd, setSelEnd] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverDate, setHoverDate] = useState(null);

  const [filters, setFilters] = useState({ roomType: "All", source: "All", status: "All" });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("calendar"); // calendar | timeline

  // Persist last-viewed month
  useEffect(() => {
    try { sessionStorage.setItem("guestara_last_view", JSON.stringify({ year: viewYear, month: viewMonth })); }
    catch {}
  }, [viewYear, viewMonth]);

  // Load bookings.json via fetch
  useEffect(() => {
    setLoading(true);
    fetch("/bookings.json")
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => { setBookings(data); setLoading(false); })
    .catch(() => {
  setError("Could not load bookings.json. Make sure it is placed in the /public folder.");
  setLoading(false);
});
  }, []);

  // Apply filters
  const filteredBookings = useMemo(() => {
    let b = bookings;
    if (filters.roomType !== "All") b = b.filter(x => x.roomType === filters.roomType);
    if (filters.source !== "All") b = b.filter(x => x.source === filters.source);
    if (filters.status !== "All") b = b.filter(x => x.status === filters.status);
    return b;
  }, [bookings, filters]);

  // Search-highlighted dates
  const searchHighlightDates = useMemo(() => {
    if (!searchQuery.trim()) return new Set();
    const q = searchQuery.toLowerCase();
    const matching = bookings.filter(b => b.guestName.toLowerCase().includes(q));
    const dates = new Set();
    matching.forEach(b => {
      let cur = parseDate(b.checkIn);
      const out = parseDate(b.checkOut);
      while (cur < out) {
        dates.add(toDateStr(cur));
        cur = addDays(cur, 1);
      }
    });
    return dates;
  }, [bookings, searchQuery]);

  // Occupancy map for filtered bookings
  const occupancyMap = useMemo(() => {
    const map = {};
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    // Include a buffer for dimmed cells
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + 7);

    let cur = new Date(startDate);
    while (cur <= endDate) {
      const ds = toDateStr(cur);
      map[ds] = filteredBookings.filter(b => bookingOccupiesNight(b, ds)).length;
      cur = addDays(cur, 1);
    }
    return map;
  }, [filteredBookings, viewYear, viewMonth]);

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startDow = firstOfMonth.getDay(); // 0=Sun
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const totalCells = Math.ceil((startDow + daysInMonth) / 7) * 7;
    const days = [];
    for (let i = 0; i < totalCells; i++) {
      const dayOffset = i - startDow;
      const d = new Date(viewYear, viewMonth, 1 + dayOffset);
      days.push({
        date: d,
        dateStr: toDateStr(d),
        dayNum: d.getDate(),
        isCurrentMonth: d.getMonth() === viewMonth,
      });
    }
    return days;
  }, [viewYear, viewMonth]);

  // Drag selection range
  const selRange = useMemo(() => {
    if (!selStart && !selEnd) return { start: null, end: null };
    if (selStart && !selEnd) return { start: selStart, end: selStart };
    const a = selStart < selEnd ? selStart : selEnd;
    const b = selStart < selEnd ? selEnd : selStart;
    return { start: a, end: b };
  }, [selStart, selEnd]);

  // Bookings for selected range
  const selectedBookings = useMemo(() => {
    if (!selRange.start) return [];
    return filteredBookings.filter(b => bookingOverlapsRange(b, selRange.start, selRange.end));
  }, [filteredBookings, selRange]);

  // Mouse handlers
  const handleMouseDown = useCallback((dateStr) => {
    setDragStart(dateStr);
    setIsDragging(true);
    setSelStart(dateStr);
    setSelEnd(null);
  }, []);

  const handleMouseEnter = useCallback((dateStr) => {
    setHoverDate(dateStr);
    if (isDragging && dragStart) {
      setSelEnd(dateStr);
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback((dateStr) => {
    if (isDragging) {
      setSelEnd(dateStr || dragStart);
      setIsDragging(false);
      setDragStart(null);
    }
  }, [isDragging, dragStart]);

  const handleCellClick = useCallback((dateStr) => {
    if (!isDragging) {
      setSelStart(dateStr);
      setSelEnd(dateStr);
    }
  }, [isDragging]);

  // Global mouse up (for when cursor leaves grid)
  useEffect(() => {
    const handleGlobalUp = () => {
      if (isDragging) { setIsDragging(false); setDragStart(null); }
    };
    window.addEventListener("mouseup", handleGlobalUp);
    return () => window.removeEventListener("mouseup", handleGlobalUp);
  }, [isDragging]);

  // Navigation
  const goToPrev = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const goToNext = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };
  const goToToday = () => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); };

  // Export CSV
  const handleExport = useCallback(() => {
    const rows = selectedBookings.length > 0 ? selectedBookings : filteredBookings;
    const header = ["ID","Guest Name","Room","Room Type","Check-in","Check-out","Nights","Guests","Amount","Currency","Status","Source"];
    const lines = rows.map(b => {
      const nights = diffDays(parseDate(b.checkIn), parseDate(b.checkOut));
      return [b.id, b.guestName, b.roomNumber, b.roomType, b.checkIn, b.checkOut, nights, b.guests, b.totalAmount, b.currency, b.status, b.source].join(",");
    });
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "bookings_export.csv"; a.click();
    URL.revokeObjectURL(url);
  }, [selectedBookings, filteredBookings]);

  // ─── TIMELINE VIEW ──────────────────────────────────────────────────────────
  const TimelineView = () => {
    const rooms = ["101","102","103","201","202","203","301","302","401","402"];
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const monthStart = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-01`;
    const monthEnd = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;

    const roomBookings = useMemo(() =>
      rooms.reduce((acc, r) => {
        acc[r] = filteredBookings.filter(b => b.roomNumber === r && b.status !== "cancelled" && b.checkIn <= monthEnd && b.checkOut > monthStart);
        return acc;
      }, {}), []);

    const colW = Math.max(24, Math.floor(640 / daysInMonth));

    return (
      <div className="overflow-x-auto">
        <div style={{ minWidth: `${120 + daysInMonth * colW}px` }}>
          {/* Header row */}
          <div className="flex border-b border-slate-200 mb-1">
            <div className="w-28 shrink-0 text-xs font-semibold text-slate-500 px-2 py-1">Room</div>
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
              <div
                key={d}
                style={{ width: colW, minWidth: colW }}
                className={`text-center text-[10px] font-medium py-1 shrink-0
                  ${toDateStr(new Date(viewYear, viewMonth, d)) === todayStr ? "text-indigo-600 font-bold" : "text-slate-400"}`}
              >
                {d}
              </div>
            ))}
          </div>
          {/* Room rows */}
          {rooms.map(room => (
            <div key={room} className="flex items-center mb-0.5 group">
              <div className="w-28 shrink-0 text-xs font-medium text-slate-600 px-2 py-1 bg-slate-50 rounded-l-lg">
                Rm {room}
                <span className="text-[10px] text-slate-400 ml-1">
                  {filteredBookings.find(b => b.roomNumber === room)?.roomType?.slice(0, 3) ?? ""}
                </span>
              </div>
              <div className="flex relative h-7 flex-1" style={{ width: `${daysInMonth * colW}px` }}>
                {/* Day grid background */}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                  const ds = toDateStr(new Date(viewYear, viewMonth, d));
                  const isWeekend = [0, 6].includes(new Date(viewYear, viewMonth, d).getDay());
                  return (
                    <div
                      key={d}
                      style={{ width: colW, minWidth: colW }}
                      className={`h-full border-r border-slate-100 shrink-0
                        ${ds === todayStr ? "bg-indigo-50" : isWeekend ? "bg-slate-50/50" : ""}`}
                    />
                  );
                })}
                {/* Booking bars */}
                {roomBookings[room].map(b => {
                  const ci = parseDate(b.checkIn);
                  const co = parseDate(b.checkOut);
                  const mStart = new Date(viewYear, viewMonth, 1);
                  const mEnd = new Date(viewYear, viewMonth + 1, 0);
                  const barStart = ci < mStart ? mStart : ci;
                  const barEnd = co > addDays(mEnd, 1) ? addDays(mEnd, 1) : co;
                  const left = diffDays(mStart, barStart);
                  const width = diffDays(barStart, barEnd);
                  const sc = STATUS_CONFIG[b.status];
                  const barColors = {
                    confirmed: "bg-emerald-400",
                    checked_in: "bg-blue-400",
                    checked_out: "bg-slate-400",
                    cancelled: "bg-red-300",
                  };
                  return (
                    <div
                      key={b.id}
                      style={{ left: left * colW, width: width * colW - 1, top: "4px", height: "20px" }}
                      className={`absolute rounded-md ${barColors[b.status] || "bg-slate-400"}
                        text-white text-[9px] font-medium flex items-center px-1.5 overflow-hidden
                        cursor-pointer hover:brightness-110 transition-all shadow-sm z-10`}
                      title={`${b.guestName} (${b.checkIn} → ${b.checkOut})`}
                      onClick={() => { setSelStart(b.checkIn); setSelEnd(toDateStr(addDays(parseDate(b.checkOut), -1))); }}
                    >
                      <span className="truncate">{b.guestName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 font-medium">Loading bookings…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-red-200 p-8 max-w-md text-center shadow-sm">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Failed to Load Bookings</h2>
        <p className="text-slate-500 text-sm">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
          Retry
        </button>
      </div>
    </div>
  );

  const selRangeLabel = selRange.start
    ? selRange.start === selRange.end
      ? new Date(selRange.start + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })
      : `${new Date(selRange.start + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })} → ${new Date(selRange.end + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/30 font-sans">
      <div className="max-w-screen-xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">

        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                🏨 Guestara
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Occupancy Heatmap · {TOTAL_ROOMS} rooms</p>
            </div>
            {/* View toggle */}
            <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1 self-start sm:self-auto">
              <button
                onClick={() => setActiveTab("calendar")}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${activeTab === "calendar" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                📅 Calendar
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${activeTab === "timeline" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                📊 Timeline
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <StatsStrip bookings={filteredBookings} year={viewYear} month={viewMonth} />

        {/* Search */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* Filter Bar */}
        <FilterBar filters={filters} onChange={setFilters} onExport={handleExport} />

        {/* Calendar / Timeline container */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Month nav */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button onClick={goToPrev} className="p-1.5 sm:p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 min-w-[140px] sm:min-w-[160px] text-center">
                    {MONTH_NAMES[viewMonth]} {viewYear}
                  </h2>
                  <button onClick={goToNext} className="p-1.5 sm:p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Legend />
                  <button
                    onClick={goToToday}
                    className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded-xl transition-colors"
                  >
                    Today
                  </button>
                </div>
              </div>

              <div className="p-2 sm:p-4">
                {activeTab === "calendar" ? (
                  <>
                    {/* Day headers */}
                    <div className="grid grid-cols-7 mb-2">
                      {DAYS_OF_WEEK.map(d => (
                        <div key={d} className="text-center text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider py-1 sm:py-2">
                          {d}
                        </div>
                      ))}
                    </div>
                    {/* Day cells */}
                    <div
                      className="grid grid-cols-7 gap-1 sm:gap-1.5"
                      onMouseLeave={() => { if (isDragging) { setIsDragging(false); } }}
                    >
                      {calendarDays.map(({ dateStr, dayNum, isCurrentMonth }) => {
                        const occupancy = occupancyMap[dateStr] ?? 0;
                        const inRange = selRange.start && selRange.end && dateStr >= selRange.start && dateStr <= selRange.end;
                        const isSearchHighlight = searchHighlightDates.has(dateStr);
                        return (
                          <div key={dateStr} className={`relative ${isSearchHighlight ? "ring-2 ring-yellow-400 ring-offset-1 rounded-lg" : ""}`}>
                            <DayCell
                              dateStr={dateStr}
                              dayNum={dayNum}
                              isCurrentMonth={isCurrentMonth}
                              occupancy={occupancy}
                              isToday={dateStr === todayStr}
                              isSelected={selRange.start === dateStr || selRange.end === dateStr}
                              isInRange={!!inRange}
                              isDragStart={dragStart === dateStr}
                              isDragEnd={isDragging && hoverDate === dateStr}
                              onMouseDown={handleMouseDown}
                              onMouseEnter={handleMouseEnter}
                              onMouseUp={handleMouseUp}
                              onClick={handleCellClick}
                              bookings={filteredBookings}
                              showTooltip={!isDragging}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <TimelineView />
                )}
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full">
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {selRange.start ? "Booking Details" : "Select a Date"}
                </h3>
                {selRangeLabel && (
                  <p className="text-xs text-indigo-600 mt-0.5 font-medium">{selRangeLabel}</p>
                )}
                {selRange.start && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedBookings.length} booking{selectedBookings.length !== 1 ? "s" : ""} found
                  </p>
                )}
              </div>

              <div className="p-3 sm:p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 320px)", minHeight: "200px" }}>
                {!selRange.start ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-4xl mb-3">👆</div>
                    <p className="text-sm text-slate-500">Click or drag on the calendar to select dates</p>
                    <p className="text-xs text-slate-400 mt-2">You can drag across multiple days to select a range</p>
                  </div>
                ) : selectedBookings.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-4xl mb-3">🌙</div>
                    <p className="text-sm text-slate-500 font-medium">No bookings</p>
                    <p className="text-xs text-slate-400 mt-1">All rooms are available on this date</p>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {selectedBookings.map(b => <BookingCard key={b.id} booking={b} />)}
                  </div>
                )}
              </div>

              {selRange.start && (
                <div className="px-4 py-3 border-t border-slate-100">
                  <button
                    onClick={() => { setSelStart(null); setSelEnd(null); }}
                    className="w-full text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 py-1.5 rounded-lg transition-colors"
                  >
                    Clear selection
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Guestara Front Desk · {bookings.length} total bookings loaded · {filteredBookings.length} after filters
        </div>
      </div>
    </div>
  );
}
