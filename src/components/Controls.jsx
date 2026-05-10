import { getHeatColor } from "../utils/bookingUtils";
import { ROOM_TYPES, SOURCES, STATUSES } from "../constants/Index";

// ─── HEATMAP LEGEND ───────────────────────────────────────────────────────────

export const Legend = () => (
  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-500">
    <span>Low</span>
    {[0, 2, 4, 7, 9, 10].map(n => (
      <div
        key={n}
        className={`w-4 h-4 sm:w-5 sm:h-5 rounded ${getHeatColor(n)} border border-slate-200/60`}
      />
    ))}
    <span>High</span>
  </div>
);

// ─── FILTER BAR ───────────────────────────────────────────────────────────────

export const FilterBar = ({ filters, onChange, onExport }) => {
  const filterDefs = [
    ["roomType", ROOM_TYPES],
    ["source",   SOURCES],
    ["status",   STATUSES],
  ];

  const isDirty =
    filters.roomType !== "All" ||
    filters.source   !== "All" ||
    filters.status   !== "All";

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
        Filters
      </span>

      {filterDefs.map(([key, opts]) => (
        <select
          key={key}
          value={filters[key]}
          onChange={e => onChange({ ...filters, [key]: e.target.value })}
          className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700
            focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {opts.map(t => <option key={t}>{t}</option>)}
        </select>
      ))}

      {isDirty && (
        <button
          onClick={() => onChange({ roomType: "All", source: "All", status: "All" })}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1.5
            rounded-lg hover:bg-indigo-50 transition-colors"
        >
          Clear
        </button>
      )}

      <div className="ml-auto">
        <button
          onClick={onExport}
          className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-1.5
            rounded-lg transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          Export CSV
        </button>
      </div>
    </div>
  );
};

// ─── SEARCH BAR ───────────────────────────────────────────────────────────────

export const SearchBar = ({ value, onChange }) => (
  <div className="relative mb-4">
    <svg
      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
      fill="none" viewBox="0 0 24 24" stroke="currentColor"
    >
      <path
        strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>

    <input
      type="text"
      placeholder="Search guest name..."
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl
        focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
        text-slate-700 placeholder-slate-400"
    />

    {value && (
      <button
        onClick={() => onChange("")}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
);