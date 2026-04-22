"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import type { DropdownOption } from "@/components/type";

type DropdownProps = {
  label?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  /** Where the options panel opens relative to the trigger. Defaults to "bottom". */
  position?: "top" | "bottom";
  color?: string;
};

/**
 * Generic single-select dropdown with popover. Uses the same field styling
 * as `DateRangePicker` so they align inside a `FilterBar` row.
 */
export function Dropdown({
  label,
  value,
  onChange,
  options,
  placeholder = "Select…",
  className = "",
  fullWidth = false,
  disabled = false,
  position = "bottom",
  color = "bg-[#f4f5f8]",
}: DropdownProps) {
  const fieldId = useId();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
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

  const selected = options.find((o) => o.value === value);

  return (
    <div
      ref={wrapperRef}
      className={`relative flex w-full flex-none shrink-0 flex-col items-start gap-2 ${fullWidth ? "" : "md:w-[180px]"} ${className}`}
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
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-10 w-full items-center gap-2 ${color} rounded-lg py-3 pl-4 pr-3 text-left text-[15px] leading-none transition-colors hover:bg-[#eceef2] disabled:bg-line disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#f4f5f8]`}
      >
        <span
          className={`min-w-0 flex-1 truncate ${
            selected ? "text-[#222125]" : "text-[#878787]"
          }`}
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-[#878787] transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          className={`absolute left-0 right-0 z-20 max-h-[280px] overflow-y-auto rounded-xl border border-line bg-white p-1 shadow-lg ${
            position === "top" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {options.length === 0 ? (
            <li className="px-3 py-2 text-sm text-ink-secondary">No options</li>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange?.(opt.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      isSelected
                        ? "bg-[#f8d237]/15 text-ink"
                        : "text-ink hover:bg-[#f4f5f8]"
                    }`}
                  >
                    {opt.label}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}
