"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

export type DateRange = { start: string; end: string };

type DateRangePickerProps = {
  label?: ReactNode;
  datePlaceholder?: string;
  dateValue?: DateRange;
  onDateClick?: (range: DateRange) => void;
  disabled?: boolean;
};

function formatDate(value: string) {
  if (!value) return "";
  const [y, m, d] = value.split("-");
  if (!y || !m || !d) return value;
  return `${d}/${m}/${y}`;
}

function formatRange(range: DateRange) {
  const start = formatDate(range.start);
  const end = formatDate(range.end);
  if (!start && !end) return "";
  if (start && end) return `${start} → ${end}`;
  return start || end;
}

export function DateRangePicker({
  label,
  datePlaceholder = "",
  dateValue,
  onDateClick,
  disabled = false,
}: DateRangePickerProps) {
  const fieldId = useId();
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange>(
    dateValue ?? { start: "", end: "" },
  );
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dateValue) setRange(dateValue);
  }, [dateValue]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!popoverRef.current) return;
      if (!popoverRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const apply = () => {
    onDateClick?.(range);
    setOpen(false);
  };

  const clear = () => {
    const empty = { start: "", end: "" };
    setRange(empty);
    onDateClick?.(empty);
    setOpen(false);
  };

  const displayLabel = formatRange(range);

  return (
    <div
      ref={popoverRef}
      className="flex-none relative flex w-full shrink-0 flex-col items-start gap-2 md:w-[275px]"
    >
      {label ? (
        <label
          htmlFor={fieldId}
          className="text-[14px] md:text-[16px] font-medium leading-[1.4] tracking-[0.32px] text-[#222125]"
        >
          {label}
        </label>
      ) : null}
      <button
        id={fieldId}
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`flex h-10 w-full items-center gap-2 rounded-lg bg-[#f4f5f8] py-3 pl-4 pr-3 text-left text-[15px] leading-none transition-colors hover:bg-[#eceef2] disabled:bg-[#e7e7e7] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#f4f5f8]`}
      >
        <CalendarIcon className="size-4 shrink-0 text-[#878787]" />
        <span
          className={`min-w-0 flex-1 truncate ${
            displayLabel ? "text-[#222125]" : "text-[#878787]"
          }`}
        >
          {displayLabel || datePlaceholder || "Start Date - End Date"}
        </span>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Select date range"
          className="absolute right-0 top-full z-20 mt-2 flex w-[220px] md:w-[320px] flex-col gap-3 rounded-xl border border-line bg-white p-4 shadow-lg"
        >
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-ink-secondary">
              Start Date
            </label>
            <input
              type="date"
              value={range.start}
              max={range.end || undefined}
              onChange={(e) => {
                const next = e.target.value;
                setRange((r) => {
                  if (next && r.end && next > r.end) return r;
                  return { ...r, start: next };
                });
              }}
              className="h-10 w-full rounded-lg bg-[#f4f5f8] px-3 text-sm text-[#222125] focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-ink-secondary">
              End Date
            </label>
            <input
              type="date"
              value={range.end}
              min={range.start || undefined}
              onChange={(e) => {
                const next = e.target.value;
                setRange((r) => {
                  if (next && r.start && next < r.start) return r;
                  return { ...r, end: next };
                });
              }}
              className="h-10 w-full rounded-lg bg-[#f4f5f8] px-3 text-sm text-[#222125] focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={clear}
              className="h-9 rounded-lg px-3 text-sm font-medium text-ink-secondary transition-colors hover:bg-[#f4f5f8]"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={apply}
              disabled={!range.start && !range.end}
              className="h-9 rounded-lg bg-brand px-4 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
