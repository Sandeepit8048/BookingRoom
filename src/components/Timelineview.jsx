import { useMemo } from "react";
import { BAR_COLORS } from "../constants/Index";
import { toDateStr, parseDate, addDays, diffDays } from "../utils/dateUtils";

const ROOMS = ["101","102","103","201","202","203","301","302","401","402"];


const TimelineView = ({ filteredBookings, viewYear, viewMonth, todayStr, onBarClick }) => {
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const monthStart  = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-01`;
  const monthEnd    = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;
  const mStartDate  = new Date(viewYear, viewMonth, 1);
  const mEndDate    = new Date(viewYear, viewMonth + 1, 0);

  const roomBookings = useMemo(() =>
    ROOMS.reduce((acc, r) => {
      acc[r] = filteredBookings.filter(
        b => b.roomNumber === r &&
             b.status !== "cancelled" &&
             b.checkIn <= monthEnd &&
             b.checkOut > monthStart,
      );
      return acc;
    }, {}),
  [filteredBookings, monthStart, monthEnd]);

  const colW = Math.max(24, Math.floor(640 / daysInMonth));

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: `${120 + daysInMonth * colW}px` }}>
        {/* Day-number header */}
        <div className="flex border-b border-slate-200 mb-1">
          <div className="w-28 shrink-0 text-xs font-semibold text-slate-500 px-2 py-1">Room</div>
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
            <div
              key={d}
              style={{ width: colW, minWidth: colW }}
              className={`text-center text-[10px] font-medium py-1 shrink-0
                ${toDateStr(new Date(viewYear, viewMonth, d)) === todayStr
                  ? "text-indigo-600 font-bold"
                  : "text-slate-400"}`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Room rows */}
        {ROOMS.map(room => (
          <div key={room} className="flex items-center mb-0.5">
            {/* Room label */}
            <div className="w-28 shrink-0 text-xs font-medium text-slate-600 px-2 py-1 bg-slate-50 rounded-l-lg">
              Rm {room}
              <span className="text-[10px] text-slate-400 ml-1">
                {filteredBookings.find(b => b.roomNumber === room)?.roomType?.slice(0, 3) ?? ""}
              </span>
            </div>

            {/* Day columns + booking bars */}
            <div className="flex relative h-7 flex-1" style={{ width: `${daysInMonth * colW}px` }}>
              {/* Background grid */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                const ds        = toDateStr(new Date(viewYear, viewMonth, d));
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
                const ci      = parseDate(b.checkIn);
                const co      = parseDate(b.checkOut);
                const barStart = ci < mStartDate ? mStartDate : ci;
                const barEnd   = co > addDays(mEndDate, 1) ? addDays(mEndDate, 1) : co;
                const left     = diffDays(mStartDate, barStart);
                const width    = diffDays(barStart, barEnd);
                const barColor = BAR_COLORS[b.status] ?? "bg-slate-400";

                return (
                  <div
                    key={b.id}
                    style={{ left: left * colW, width: width * colW - 1, top: "4px", height: "20px" }}
                    className={`absolute rounded-md ${barColor} text-white text-[9px] font-medium
                      flex items-center px-1.5 overflow-hidden cursor-pointer
                      hover:brightness-110 transition-all shadow-sm z-10`}
                    title={`${b.guestName} (${b.checkIn} → ${b.checkOut})`}
                    onClick={() =>
                      onBarClick(b.checkIn, toDateStr(addDays(parseDate(b.checkOut), -1)))
                    }
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

export default TimelineView;