"use client";

import { useId, type ReactNode } from "react";
import { Search as SearchIcon } from "lucide-react";

type SearchInputProps = {
  label?: ReactNode;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
};

export function SearchInput({
  label,
  searchValue,
  searchPlaceholder = "Search by keyword...",
  onSearchChange,
}: SearchInputProps) {
  const fieldId = useId();

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-2">
      {label ? (
        <label
          htmlFor={fieldId}
          className="text-[14px] md:text-[16px] font-medium leading-[1.4] tracking-[0.32px] text-[#222125]"
        >
          {label}
        </label>
      ) : null}
      <div className="flex h-10 w-full items-center gap-2 rounded-lg bg-[#f4f5f8] py-3 pl-4 pr-3">
        <SearchIcon className="size-4 shrink-0 text-[#878787]" />
        <input
          id={fieldId}
          type="search"
          value={searchValue ?? ""}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder={searchPlaceholder}
          className="min-w-0 flex-1 bg-transparent text-[16px] leading-none text-[#222125] placeholder:text-[#878787] focus:outline-none"
        />
      </div>
    </div>
  );
}
