import { useState } from "react";
import OccupancyBar from "./Occupancybar.jsx";
import Tooltip      from "./Tooltip";
import { getHeatColor, getHeatTextColor } from "../utils/bookingUtils";


const DayCell = ({
  dateStr, dayNum, isCurrentMonth, occupancy, isToday,
  isSelected, isInRange, isDragging,
  onMouseDown, onMouseEnter, onMouseUp, onClick,
  bookings, showTooltip,
}) => {
  const [tooltipPos, setTooltipPos] = useState(null);

  const handleMouseEnterCell = (e) => {
    onMouseEnter(dateStr);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
  };

  const heatBg   = getHeatColor(occupancy, isCurrentMonth);
  const heatText = getHeatTextColor(occupancy);

  let borderClass = "border border-slate-200/60";
  let ringClass   = "";
  if (isSelected || isInRange) {
    borderClass = "border border-indigo-400";
    ringClass   = "ring-1 ring-inset ring-indigo-300";
  }
  if (isToday && isCurrentMonth) borderClass = "border-2 border-indigo-600";

  const bgOverlay = isInRange   ? "bg-indigo-100/70"
                  : isSelected  ? "bg-indigo-200/80"
                  : "";
  const dimClass  = !isCurrentMonth ? "opacity-40" : "";

  return (
    <div
      className={`relative rounded-lg cursor-pointer select-none transition-all duration-150
        ${heatBg} ${borderClass} ${ringClass} ${dimClass}
        hover:scale-[1.03] hover:z-10 hover:shadow-md active:scale-95`}
      style={{ minHeight: "72px" }}
      onMouseDown={() => onMouseDown(dateStr)}
      onMouseEnter={handleMouseEnterCell}
      onMouseLeave={() => setTooltipPos(null)}
      onMouseUp={() => onMouseUp(dateStr)}
      onClick={() => onClick(dateStr)}
    >
      {(isInRange || isSelected) && (
        <div className={`absolute inset-0 rounded-lg ${bgOverlay} pointer-events-none z-0`} />
      )}

      <div className="relative z-10 p-1.5 sm:p-2 flex flex-col h-full">
        <div className="flex items-start justify-between">
          <span
            className={`text-xs sm:text-sm font-semibold leading-none
              ${isToday && isCurrentMonth ? "text-indigo-700" : heatText}`}
          >
            {dayNum}
          </span>
          {occupancy > 0 && (
            <span className={`text-[9px] sm:text-[10px] font-bold leading-none ${heatText} opacity-80`}>
              {occupancy}/10
            </span>
          )}
        </div>
        <div className="mt-auto">
          <OccupancyBar count={occupancy} />
        </div>
      </div>

      {showTooltip && !isDragging && tooltipPos && (
        <Tooltip dateStr={dateStr} bookings={bookings} position={tooltipPos} />
      )}
    </div>
  );
};

export default DayCell;