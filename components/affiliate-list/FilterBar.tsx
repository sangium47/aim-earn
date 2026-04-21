"use client";

import {
  DateRangePicker,
  SearchInput,
  type DateRange,
} from "@/components/shared";

export type { DateRange };

type FilterBarProps = {
  searchValue?: string;
  searchPlaceholder?: string;
  datePlaceholder?: string;
  onSearchChange?: (value: string) => void;
  dateLabel?: string;
  dateValue?: DateRange;
  onDateClick?: (range: DateRange) => void;
};

/**
 * Search + date-range filter strip (Figma node 137:51167).
 */
export function FilterBar({
  searchValue,
  searchPlaceholder = "Search by keyword...",
  datePlaceholder = "",
  onSearchChange,
  dateLabel = "Registed Date",
  dateValue,
  onDateClick,
}: FilterBarProps) {
  return (
    <div className="flex flex-col items-end gap-2 md:gap-4 rounded-2xl bg-white p-3 md:p-6 shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)] md:flex-row">
      <SearchInput
        label="Search"
        searchValue={searchValue}
        searchPlaceholder={searchPlaceholder}
        onSearchChange={onSearchChange}
      />
      <DateRangePicker
        label={dateLabel}
        datePlaceholder={datePlaceholder}
        dateValue={dateValue}
        onDateClick={onDateClick}
      />
    </div>
  );
}

export default FilterBar;
