"use client";

import { DateRangePicker } from "./DateRangePicker";
import { Dropdown } from "./Dropdown";
import { SearchInput } from "./SearchInput";
import type {
  DateRange,
  FilterBarDateRange,
  FilterBarDropdown,
} from "@/components/type";

type FilterBarProps = {
  searchValue?: string;
  searchPlaceholder?: string;
  datePlaceholder?: string;
  onSearchChange?: (value: string) => void;
  /** Single-date-range convenience props. Ignored when `dateRanges` is set. */
  dateLabel?: string;
  dateValue?: DateRange | null | undefined;
  onDateClick?: (range: DateRange) => void;
  /** Multiple date-range filters — rendered in order before the dropdowns. */
  dateRanges?: FilterBarDateRange[];
  /** One or more dropdown filters. Rendered after the date pickers. */
  dropdowns?: FilterBarDropdown[];
};

/**
 * Search + date range(s) + dropdown(s) filter strip (Figma node 137:51167).
 */
export function FilterBar({
  searchValue,
  searchPlaceholder = "Search by keyword...",
  datePlaceholder = "",
  onSearchChange,
  dateLabel = "Registed Date",
  dateValue,
  onDateClick,
  dateRanges,
  dropdowns,
}: FilterBarProps) {
  const resolvedRanges: FilterBarDateRange[] =
    dateRanges && dateRanges.length > 0
      ? dateRanges
      : dateValue
        ? [
            {
              label: dateLabel,
              placeholder: datePlaceholder,
              value: dateValue,
              onChange: onDateClick,
            },
          ]
        : [];

  return (
    <div className="flex flex-col items-end gap-2 md:gap-3 rounded-2xl bg-white p-3 md:p-6 shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)] md:flex-row md:flex-wrap">
      <SearchInput
        label="Search"
        searchValue={searchValue}
        searchPlaceholder={searchPlaceholder}
        onSearchChange={onSearchChange}
      />
      {resolvedRanges.map((d, i) => (
        <DateRangePicker
          key={`${d.label ?? "date"}-${i}`}
          label={d.label}
          datePlaceholder={d.placeholder ?? ""}
          dateValue={d.value ?? undefined}
          onDateClick={d.onChange}
        />
      ))}
      {dropdowns?.map((d, i) => (
        <Dropdown
          key={`${d.label ?? "dropdown"}-${i}`}
          label={d.label}
          value={d.value}
          onChange={d.onChange}
          options={d.options}
          placeholder={d.placeholder}
        />
      ))}
    </div>
  );
}

export default FilterBar;
