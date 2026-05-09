import { useState, useEffect, useCallback, useMemo } from "react";
import BOOKINGS_DATA from "../data/booking.json";

import { DAYS_OF_WEEK, MONTH_NAMES, TOTAL_ROOMS } from "../constants";
import { toDateStr, parseDate, addDays, diffDays } from "../utils/dateUtils";
import { bookingOccupiesNight, bookingOverlapsRange, exportBookingsCSV } from "../utils/bookingUtils";
import { useCalendarSelection } from "../hooks/useCalendarSelection";

import DayCell      from "./Daycell";
import BookingCard  from "./BookingCard";
import StatsStrip   from "./Statsstrip";
import TimelineView from "./Timelineview";
import { Legend, FilterBar, SearchBar } from "./Controls";

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function BookingCalendar() {
  const bookings = BOOKINGS_DATA;
  const today    = new Date();
  const todayStr = toDateStr(today);

  // Restore last-viewed month from sessionStorage
  const savedState = (() => {
    try {
      const s = sessionStorage.getItem("guestara_last_view");
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  })();

  const [viewYear,  setViewYear]  = useState(savedState?.year  ?? 2026);
  const [viewMonth, setViewMonth] = useState(savedState?.month ?? 0);
  const [filters,   setFilters]   = useState({ roomType: "All", source: "All", status: "All" });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab,   setActiveTab]   = useState("calendar");

  const {
    selRange, isDragging,
    handleMouseDown, handleMouseEnter, handleMouseUp, handleCellClick,
    clearSelection, setSelStart, setSelEnd,
  } = useCalendarSelection();

  // Persist last-viewed month
  useEffect(() => {
    try {
      sessionStorage.setItem("guestara_last_view", JSON.stringify({ year: viewYear, month: viewMonth }));
    } catch {}
  }, [viewYear, viewMonth]);

  // ── Filtered bookings ──────────────────────────────────────────────────────
  const filteredBookings = useMemo(() => {
    let b = bookings;
    if (filters.roomType !== "All") b = b.filter(x => x.roomType === filters.roomType);
    if (filters.source   !== "All") b = b.filter(x => x.source   === filters.source);
    if (filters.status   !== "All") b = b.filter(x => x.status   === filters.status);
    return b;
  }, [bookings, filters]);

  // ── Search highlight dates ─────────────────────────────────────────────────
  const searchHighlightDates = useMemo(() => {
    if (!searchQuery.trim()) return new Set();
    const q       = searchQuery.toLowerCase();
    const matches = bookings.filter(b => b.guestName.toLowerCase().includes(q));
    const dates   = new Set();
    matches.forEach(b => {
      let cur = parseDate(b.checkIn);
      const out = parseDate(b.checkOut);
      while (cur < out) { dates.add(toDateStr(cur)); cur = addDays(cur, 1); }
    });
    return dates;
  }, [bookings, searchQuery]);

  // ── Occupancy map ──────────────────────────────────────────────────────────
  const occupancyMap = useMemo(() => {
    const map   = {};
    const start = addDays(new Date(viewYear, viewMonth, 1), -7);
    const end   = addDays(new Date(viewYear, viewMonth + 1, 0), 7);
    let cur = new Date(start);
    while (cur <= end) {
      const ds = toDateStr(cur);
      map[ds]  = filteredBookings.filter(b => bookingOccupiesNight(b, ds)).length;
      cur      = addDays(cur, 1);
    }
    return map;
  }, [filteredBookings, viewYear, viewMonth]);

  // ── Calendar grid cells ────────────────────────────────────────────────────
  const calendarDays = useMemo(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startDow     = firstOfMonth.getDay();
    const daysInMonth  = new Date(viewYear, viewMonth + 1, 0).getDate();
    const totalCells   = Math.ceil((startDow + daysInMonth) / 7) * 7;
    return Array.from({ length: totalCells }, (_, i) => {
      const d = new Date(viewYear, viewMonth, 1 + (i - startDow));
      return {
        date: d,
        dateStr: toDateStr(d),
        dayNum: d.getDate(),
        isCurrentMonth: d.getMonth() === viewMonth,
      };
    });
  }, [viewYear, viewMonth]);

  // ── Selected bookings for the side panel ──────────────────────────────────
  const selectedBookings = useMemo(() => {
    if (!selRange.start) return [];
    return filteredBookings.filter(b =>
      bookingOverlapsRange(b, selRange.start, selRange.end, addDays, toDateStr, parseDate),
    );
  }, [filteredBookings, selRange]);

  // ── Navigation helpers ─────────────────────────────────────────────────────
  const goToPrev = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const goToNext = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };
  const goToToday = () => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); };

  // ── CSV export ─────────────────────────────────────────────────────────────
  const handleExport = useCallback(() => {
    const rows = selectedBookings.length > 0 ? selectedBookings : filteredBookings;
    exportBookingsCSV(rows, diffDays, parseDate);
  }, [selectedBookings, filteredBookings]);

  // ── Selection label ────────────────────────────────────────────────────────
  const selRangeLabel = selRange.start
    ? selRange.start === selRange.end
      ? new Date(selRange.start + "T00:00:00").toLocaleDateString("en-IN", {
          weekday: "long", day: "numeric", month: "long",
        })
      : `${new Date(selRange.start + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })} → ${new Date(selRange.end + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
    : null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/30 font-sans">
      <div className="max-w-screen-xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                🏨 Guestara
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Occupancy Heatmap · {TOTAL_ROOMS} rooms
              </p>
            </div>
            <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1 self-start sm:self-auto">
              {["calendar", "timeline"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all
                    ${activeTab === tab
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"}`}
                >
                  {tab === "calendar" ? "📅 Calendar" : "📊 Timeline"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stats ───────────────────────────────────────────────────────── */}
        <StatsStrip bookings={filteredBookings} year={viewYear} month={viewMonth} />

        {/* ── Search ──────────────────────────────────────────────────────── */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* ── Filters ─────────────────────────────────────────────────────── */}
        <FilterBar filters={filters} onChange={setFilters} onExport={handleExport} />

        {/* ── Main grid ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">

          {/* Calendar / Timeline panel */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

              {/* Month navigation */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={goToPrev}
                    className="p-1.5 sm:p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 min-w-[140px] sm:min-w-[160px] text-center">
                    {MONTH_NAMES[viewMonth]} {viewYear}
                  </h2>
                  <button
                    onClick={goToNext}
                    className="p-1.5 sm:p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Legend />
                  <button
                    onClick={goToToday}
                    className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-indigo-600
                      hover:bg-indigo-50 border border-indigo-200 rounded-xl transition-colors"
                  >
                    Today
                  </button>
                </div>
              </div>

              <div className="p-2 sm:p-4">
                {activeTab === "calendar" ? (
                  <>
                    {/* Day-of-week headers */}
                    <div className="grid grid-cols-7 mb-2">
                      {DAYS_OF_WEEK.map(d => (
                        <div
                          key={d}
                          className="text-center text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider py-1 sm:py-2"
                        >
                          {d}
                        </div>
                      ))}
                    </div>

                    {/* Calendar grid */}
                    <div
                      className="grid grid-cols-7 gap-1 sm:gap-1.5"
                      onMouseLeave={() => { if (isDragging) { /* drag released outside */ } }}
                    >
                      {calendarDays.map(({ dateStr, dayNum, isCurrentMonth }) => {
                        const occupancy = occupancyMap[dateStr] ?? 0;
                        const inRange   =
                          selRange.start &&
                          selRange.end   &&
                          dateStr >= selRange.start &&
                          dateStr <= selRange.end;
                        const isSearchHighlight = searchHighlightDates.has(dateStr);

                        return (
                          <div
                            key={dateStr}
                            className={`relative ${isSearchHighlight ? "ring-2 ring-yellow-400 ring-offset-1 rounded-lg" : ""}`}
                          >
                            <DayCell
                              dateStr={dateStr}
                              dayNum={dayNum}
                              isCurrentMonth={isCurrentMonth}
                              occupancy={occupancy}
                              isToday={dateStr === todayStr}
                              isSelected={selRange.start === dateStr || selRange.end === dateStr}
                              isInRange={!!inRange}
                              isDragging={isDragging}
                              onMouseDown={handleMouseDown}
                              onMouseEnter={handleMouseEnter}
                              onMouseUp={handleMouseUp}
                              onClick={handleCellClick}
                              bookings={filteredBookings}
                              showTooltip={true}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <TimelineView
                    filteredBookings={filteredBookings}
                    viewYear={viewYear}
                    viewMonth={viewMonth}
                    todayStr={todayStr}
                    onBarClick={(checkIn, checkOutMinus1) => {
                      setSelStart(checkIn);
                      setSelEnd(checkOutMinus1);
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* ── Side panel ──────────────────────────────────────────────── */}
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

              <div
                className="p-3 sm:p-4 overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 320px)", minHeight: "200px" }}
              >
                {!selRange.start ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-4xl mb-3">👆</div>
                    <p className="text-sm text-slate-500">
                      Click or drag on the calendar to select dates
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      Drag across multiple days to select a range
                    </p>
                  </div>
                ) : selectedBookings.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-4xl mb-3">🌙</div>
                    <p className="text-sm text-slate-500 font-medium">No bookings</p>
                    <p className="text-xs text-slate-400 mt-1">All rooms available on this date</p>
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
                    onClick={clearSelection}
                    className="w-full text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50
                      py-1.5 rounded-lg transition-colors"
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
          Guestara Front Desk · {bookings.length} total bookings · {filteredBookings.length} after filters
        </div>

      </div>
    </div>
  );
}