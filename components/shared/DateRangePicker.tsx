"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import DatePicker from "react-date-picker";
import { Dialog } from "./Dialog";
import type { DateRange } from "@/components/type";

type DateRangePickerProps = {
  label?: ReactNode;
  datePlaceholder?: string;
  dateValue?: DateRange;
  onDateClick?: (range: DateRange) => void;
  disabled?: boolean;
};

function formatDisplayDate(value: string) {
  if (!value) return "";
  const [y, m, d] = value.split("-");
  if (!y || !m || !d) return value;
  return `${d}/${m}/${y}`;
}

function formatRange(range: DateRange) {
  const start = formatDisplayDate(range.start);
  const end = formatDisplayDate(range.end);
  if (!start && !end) return "";
  if (start && end) return `${start} → ${end}`;
  return start || end;
}

function parseISO(value: string): Date | null {
  if (!value) return null;
  const parts = value.split("-").map(Number);
  const [y, m, d] = parts;
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function toISO(date: Date | null | undefined): string {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// react-date-picker's onChange value is Date | null | [Date | null, Date | null].
function pickSingle(value: unknown): Date | null {
  if (value instanceof Date) return value;
  if (Array.isArray(value)) {
    const first = value[0];
    return first instanceof Date ? first : null;
  }
  return null;
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
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (popoverRef.current.contains(target)) return;
      // The calendar popup is rendered via a portal outside popoverRef;
      // don't treat clicks inside it (or the portal host) as "outside".
      if (
        target.closest(
          ".react-date-picker__calendar, .react-calendar, .date-range-datepicker",
        )
      ) {
        return;
      }
      setOpen(false);
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

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Portal to <body> only on mobile — there the popover is the `Dialog`
  // modal and the calendar is centered via global CSS. On desktop let
  // react-fit anchor the calendar below the input inline.
  const portalContainer =
    isMobile && typeof document !== "undefined" ? document.body : null;

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

  const startDate = parseISO(range.start);
  const endDate = parseISO(range.end);

  const pickerBody = (
    <>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-ink-secondary">
          Start Date
        </label>
        <DatePicker
          className="date-range-datepicker w-full"
          value={startDate}
          maxDate={endDate ?? undefined}
          format="dd/MM/y"
          locale="en-GB"
          clearIcon={null}
          portalContainer={portalContainer}
          calendarAriaLabel="Toggle start date calendar"
          dayAriaLabel="Day"
          monthAriaLabel="Month"
          yearAriaLabel="Year"
          onChange={(v) => {
            const next = toISO(pickSingle(v));
            setRange((r) => {
              if (next && r.end && next > r.end) return r;
              return { ...r, start: next };
            });
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-ink-secondary">
          End Date
        </label>
        <DatePicker
          className="date-range-datepicker w-full"
          value={endDate}
          minDate={startDate ?? undefined}
          format="dd/MM/y"
          locale="en-GB"
          clearIcon={null}
          portalContainer={portalContainer}
          calendarAriaLabel="Toggle end date calendar"
          dayAriaLabel="Day"
          monthAriaLabel="Month"
          yearAriaLabel="Year"
          onChange={(v) => {
            const next = toISO(pickSingle(v));
            setRange((r) => {
              if (next && r.start && next < r.start) return r;
              return { ...r, end: next };
            });
          }}
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
    </>
  );

  return (
    <div
      ref={popoverRef}
      className="flex-none relative flex w-full shrink-0 flex-col items-start gap-2 md:w-[220px]"
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

      {/* Desktop: anchored popover (tooltip) */}
      {open ? (
        <div
          role="dialog"
          aria-label="Select date range"
          className="absolute right-0 top-full z-20 mt-2 hidden w-[320px] flex-col gap-3 rounded-xl border border-line bg-white p-4 shadow-lg md:flex"
        >
          {pickerBody}
        </div>
      ) : null}

      {/* Mobile: centered modal dialog */}
      <div className="md:hidden">
        <Dialog open={open} onClose={() => setOpen(false)} width="max-w-sm">
          <div
            aria-label="Select date range"
            className="flex flex-col gap-3 p-4"
          >
            {pickerBody}
          </div>
        </Dialog>
      </div>
    </div>
  );
}
