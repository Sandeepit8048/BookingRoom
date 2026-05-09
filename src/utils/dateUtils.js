// ─── DATE UTILITIES ───────────────────────────────────────────────────────────

/** Format a Date object as "YYYY-MM-DD" */
export const toDateStr = (d) => {
  const y   = d.getFullYear();
  const m   = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/** Parse a "YYYY-MM-DD" string into a local Date */
export const parseDate = (str) => {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/** Integer day-difference between two Date objects */
export const diffDays = (a, b) => Math.round((b - a) / 86400000);

/** Return a new Date that is n calendar days after d */
export const addDays = (d, n) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);