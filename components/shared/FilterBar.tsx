"use client";

import { DateRangePicker, type DateRange } from "./DateRangePicker";
import { Dropdown, type DropdownOption } from "./Dropdown";
import { SearchInput } from "./SearchInput";

export type { DateRange };

export type FilterBarDropdown = {
  label?: string;
  placeholder?: string;
  value?: string;
  options: DropdownOption[];
  onChange?: (value: string) => void;
};

type FilterBarProps = {
  searchValue?: string;
  searchPlaceholder?: string;
  datePlaceholder?: string;
  onSearchChange?: (value: string) => void;
  dateLabel?: string;
  dateValue?: DateRange | null | undefined;
  onDateClick?: (range: DateRange) => void;
  /** One or more dropdown filters. Rendered between Search and DateRangePicker. */
  dropdowns?: FilterBarDropdown[];
};

/**
 * Search + dropdown(s) + date-range filter strip (Figma node 137:51167).
 */
export function FilterBar({
  searchValue,
  searchPlaceholder = "Search by keyword...",
  datePlaceholder = "",
  onSearchChange,
  dateLabel = "Registed Date",
  dateValue,
  onDateClick,
  dropdowns,
}: FilterBarProps) {
  return (
    <div className="flex flex-col items-end gap-2 md:gap-3 rounded-2xl bg-white p-3 md:p-6 shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)] md:flex-row">
      <SearchInput
        label="Search"
        searchValue={searchValue}
        searchPlaceholder={searchPlaceholder}
        onSearchChange={onSearchChange}
      />
      {dateValue ? (
        <DateRangePicker
          label={dateLabel}
          datePlaceholder={datePlaceholder}
          dateValue={dateValue}
          onDateClick={onDateClick}
        />
      ) : null}
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
