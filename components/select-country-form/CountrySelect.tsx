"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { ChevronDownIcon } from "@/components/icons";
import { COUNTRIES, type Country } from "./countries";

export type CountrySelectProps = {
  /** Currently selected country codes. */
  value: string[];
  /** Fires with the new array when selection changes. */
  onChange: (next: string[]) => void;
  /** Override the country list. Defaults to the project's standard list. */
  countries?: readonly Country[];
  /** Placeholder shown when no country is selected. */
  placeholder?: string;
  /** Accessible label linking the listbox to its visible <label>. */
  labelId?: string;
  /** Field id used by <label htmlFor>. */
  id?: string;
  disabled?: boolean;
  /** Maximum number of countries that can be selected. Defaults to 4. */
  maxSelection?: number;
};

/**
 * Multi-select dropdown matching the Figma "Select" field in node 137:56229.
 *
 * Implements the WAI-ARIA combobox pattern:
 *   - button trigger with `role="combobox"`, `aria-expanded`, `aria-controls`
 *   - listbox popup with `role="listbox"`, `aria-multiselectable="true"`
 *   - each option carries `aria-selected`
 *   - keyboard: ArrowDown opens and moves focus into list, Up/Down navigate,
 *     Enter/Space toggle, Escape closes, typing filters
 *   - clicking outside the component closes the popup
 *
 * Visual spec: 40px tall trigger with `surface.card` fill, `line` border,
 * `rounded-lg`, chevron-down on the right. The popup matches the trigger's
 * width and reuses the same border + radius for consistency.
 */
export function CountrySelect({
  value,
  onChange,
  countries = COUNTRIES,
  placeholder = "Select Country",
  labelId,
  id,
  disabled = false,
  maxSelection = 4,
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const generatedId = useId();
  const listboxId = `${id ?? generatedId}-listbox`;

  const selectedSet = useMemo(() => new Set(value), [value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q),
    );
  }, [query, countries]);

  // Reset active row when filter changes
  useEffect(() => {
    setActiveIndex(filtered.length > 0 ? 0 : -1);
  }, [filtered]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close dropdown when max countries are selected
  useEffect(() => {
    if (value.length >= maxSelection) {
      setOpen(false);
    }
  }, [value.length, maxSelection]);

  // Focus the search field when opening
  useEffect(() => {
    if (open) {
      // Defer so the input exists in the DOM
      queueMicrotask(() => searchRef.current?.focus());
    } else {
      setQuery("");
    }
  }, [open]);

  const toggle = useCallback(
    (code: string) => {
      if (selectedSet.has(code)) {
        onChange(value.filter((v) => v !== code));
      } else if (value.length < maxSelection) {
        onChange([...value, code]);
      }
    },
    [onChange, selectedSet, value, maxSelection],
  );

  const handleTriggerKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || value.length >= maxSelection) return;
    if (
      e.key === "ArrowDown" ||
      e.key === "Enter" ||
      e.key === " " ||
      e.key === "ArrowUp"
    ) {
      e.preventDefault();
      setOpen(true);
    }
  };

  const handleListKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (filtered.length ? (i + 1) % filtered.length : -1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) =>
        filtered.length ? (i - 1 + filtered.length) % filtered.length : -1,
      );
      return;
    }
    if ((e.key === "Enter" || e.key === " ") && activeIndex >= 0) {
      e.preventDefault();
      const country = filtered[activeIndex];
      if (country) toggle(country.code);
      return;
    }
    if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-labelledby={labelId}
        disabled={disabled}
        onClick={() =>
          !disabled && value.length < maxSelection && setOpen((v) => !v)
        }
        onKeyDown={handleTriggerKey}
        className={[
          "flex h-10 w-full items-center gap-2 rounded-lg border border-line bg-surface-card",
          "py-3 pl-4 pr-3 text-left",
          "font-body text-base font-normal leading-none",
          "transition-shadow outline-none",
          "focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-60",
        ].join(" ")}
      >
        <span className="min-w-0 flex-1 truncate text-ink-tertiary">
          {placeholder}
        </span>
        <ChevronDownIcon
          className={[
            "h-4 w-4 shrink-0 text-ink transition-transform",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      {open ? (
        <div
          className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-line bg-surface-card shadow-lg"
          onKeyDown={handleListKey}
        >
          <div className="border-b border-line p-2">
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search countries"
              aria-label="Search countries"
              className="w-full rounded bg-transparent px-2 py-1.5 font-body text-[16px] text-ink outline-none placeholder:text-ink-tertiary"
            />
          </div>
          <ul
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            aria-labelledby={labelId}
            className="max-h-60 overflow-auto py-1"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-2 text-sm text-ink-tertiary">
                No matches
              </li>
            ) : (
              filtered.map((country, i) => {
                const selected = selectedSet.has(country.code);
                const active = i === activeIndex;
                return (
                  <li
                    key={country.code}
                    role="option"
                    aria-selected={selected}
                    className={[
                      "flex cursor-pointer items-center justify-between px-4 py-2 font-body text-sm",
                      active ? "bg-surface-input" : "",
                      selected ? "text-ink" : "text-ink",
                    ].join(" ")}
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseDown={(e) => {
                      // prevent trigger blur before click
                      e.preventDefault();
                      toggle(country.code);
                    }}
                  >
                    <span>{country.name}</span>
                    {selected ? (
                      <span className="text-xs text-ink-secondary">✓</span>
                    ) : null}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
