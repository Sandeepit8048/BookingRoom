import { useState, useCallback, useEffect } from "react";

/**
 * useCalendarSelection
 * Manages drag-to-select and single-click date selection on the calendar grid.
 *
 * Returns:
 *   selStart, selEnd         — raw selection anchors
 *   selRange                 — { start, end } normalised (start <= end)
 *   isDragging               — whether a drag is in progress
 *   handleMouseDown(dateStr) — start a new drag
 *   handleMouseEnter(dateStr)— extend drag in progress
 *   handleMouseUp(dateStr)   — commit drag
 *   handleCellClick(dateStr) — single-click select
 *   clearSelection()         — reset
 */
export function useCalendarSelection() {
  const [selStart,   setSelStart]   = useState(null);
  const [selEnd,     setSelEnd]     = useState(null);
  const [dragStart,  setDragStart]  = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((dateStr) => {
    setDragStart(dateStr);
    setIsDragging(true);
    setSelStart(dateStr);
    setSelEnd(null);
  }, []);

  const handleMouseEnter = useCallback(
    (dateStr) => {
      if (isDragging && dragStart) setSelEnd(dateStr);
    },
    [isDragging, dragStart],
  );

  const handleMouseUp = useCallback(
    (dateStr) => {
      if (isDragging) {
        setSelEnd(dateStr || dragStart);
        setIsDragging(false);
        setDragStart(null);
      }
    },
    [isDragging, dragStart],
  );

  const handleCellClick = useCallback(
    (dateStr) => {
      if (!isDragging) {
        setSelStart(dateStr);
        setSelEnd(dateStr);
      }
    },
    [isDragging],
  );

  const clearSelection = useCallback(() => {
    setSelStart(null);
    setSelEnd(null);
  }, []);

  // Release drag if the mouse button is released anywhere outside the grid
  useEffect(() => {
    const onGlobalUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragStart(null);
      }
    };
    window.addEventListener("mouseup", onGlobalUp);
    return () => window.removeEventListener("mouseup", onGlobalUp);
  }, [isDragging]);

  const selRange =
    !selStart && !selEnd
      ? { start: null, end: null }
      : selStart && !selEnd
      ? { start: selStart, end: selStart }
      : {
          start: selStart < selEnd ? selStart : selEnd,
          end:   selStart < selEnd ? selEnd   : selStart,
        };

  return {
    selStart,
    selEnd,
    selRange,
    isDragging,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    handleCellClick,
    clearSelection,
    // Allow external overrides (e.g. clicking a timeline bar)
    setSelStart,
    setSelEnd,
  };
}