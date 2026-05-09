import { TOTAL_ROOMS } from "../constants";

/**
 * OccupancyBar
 * Thin colour-coded bar shown at the bottom of each calendar cell.
 */
const OccupancyBar = ({ count }) => {
  const pct   = Math.round((count / TOTAL_ROOMS) * 100);
  const color =
    count === 0 ? "bg-slate-200"
    : pct <= 40 ? "bg-amber-400"
    : pct <= 70 ? "bg-orange-400"
    : "bg-rose-500";

  return (
    <div className="w-full h-1 rounded-full bg-slate-200 mt-1">
      <div
        className={`h-1 rounded-full transition-all ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default OccupancyBar;