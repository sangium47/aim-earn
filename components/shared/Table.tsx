"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dropdown } from "./Dropdown";

export type TableColumn<T> = {
  header: string;
  key?: keyof T;
  render?: (item: T, index: number) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  borderRight?: boolean;
};

type TableProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  className?: string;
  minWidth?: string;
  onRowClick?: (item: T, index: number) => void;
  selectable?: boolean;
  selectedIndexes?: number[];
  onSelectionChange?: (selected: T[], indexes: number[]) => void;
  /**
   * Row striping. "odd" (default) alternates between two tinted rows.
   * "simple" leaves even rows plain white, only tinting odd rows.
   */
  variant?: "odd" | "simple";
  /** Show the pagination footer. Defaults to true. */
  pagination?: boolean;
  /** Initial page size. Defaults to 10. */
  initialPageSize?: 10 | 50 | 100;
};

const PAGE_SIZE_OPTIONS = [
  { label: "10", value: "10" },
  { label: "50", value: "50" },
  { label: "100", value: "100" },
];

/**
 * Build a compact page-number list like `[1, 2, 3, '...', 10]`.
 * Always keeps first + last, and ±1 around the current page; inserts
 * a single `'...'` marker where pages are collapsed.
 */
function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let p = start; p <= end; p++) pages.push(p);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

export function Table<T>({
  data,
  columns,
  className = "",
  minWidth,
  onRowClick,
  selectable = false,
  selectedIndexes,
  onSelectionChange,
  variant = "odd",
  pagination = true,
  initialPageSize = 10,
}: TableProps<T>) {
  const rowBg = (rowIndex: number) => {
    if (rowIndex % 2 === 0) {
      return variant === "simple"
        ? `bg-white ${rowIndex !== 0 ? "border-t border-lin" : ""}`
        : `bg-brand-border/20 ${rowIndex !== 0 ? "border-t border-lin" : ""}`;
    }
    return `bg-white ${rowIndex !== 0 ? " border-t border-line" : ""}`;
  };
  const [internal, setInternal] = useState<Set<number>>(new Set());
  const isControlled = selectedIndexes !== undefined;
  const selected = useMemo(
    () => (isControlled ? new Set(selectedIndexes) : internal),
    [isControlled, selectedIndexes, internal],
  );

  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [page, setPage] = useState<number>(1);

  const totalPages = pagination
    ? Math.max(1, Math.ceil(data.length / pageSize))
    : 1;
  const startIdx = pagination ? (page - 1) * pageSize : 0;
  const endIdx = pagination ? startIdx + pageSize : data.length;
  const pageData = pagination ? data.slice(startIdx, endIdx) : data;

  // Clamp the current page if data shrinks.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const emit = (next: Set<number>) => {
    if (!isControlled) setInternal(next);
    const indexes = Array.from(next).sort((a, b) => a - b);
    onSelectionChange?.(
      indexes.map((i) => data[i]).filter((v): v is T => v !== undefined),
      indexes,
    );
  };

  const toggleRow = (rowIndex: number) => {
    const next = new Set(selected);
    if (next.has(rowIndex)) next.delete(rowIndex);
    else next.add(rowIndex);
    emit(next);
  };

  const allSelected = data.length > 0 && selected.size === data.length;
  const someSelected = selected.size > 0 && !allSelected;

  const toggleAll = () => {
    emit(allSelected ? new Set() : new Set(data.map((_, i) => i)));
  };

  const totalCols = columns.length + (selectable ? 1 : 0);

  const edgeClasses = (colIndex: number) =>
    colIndex === 0
      ? "pl-3 pr-2 md:pl-6 md:pr-4"
      : colIndex === totalCols - 1
        ? "px-2 pr-3 md:px-4 md:pr-6"
        : "px-2 md:px-4";

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl">
      <div className="max-w-full overflow-x-auto">
        <table
          className={`w-full border-collapse ${minWidth ? minWidth : ""} ${className}`}
        >
          <thead>
            <tr className="text-left text-xs md:text-sm font-semibold text-[#1e1e1e] bg-surface-brand">
              {selectable ? (
                <th
                  className={`bg-surface-brand py-3 font-semibold ${edgeClasses(0)} w-10`}
                >
                  <input
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={toggleAll}
                    className="size-4 accent-brand cursor-pointer"
                  />
                </th>
              ) : null}
              {columns.map((column, index) => {
                const colIndex = index + (selectable ? 1 : 0);
                return (
                  <th
                    key={column.header}
                    className={`bg-surface-brand py-3 font-semibold ${edgeClasses(colIndex)} ${column.borderRight ? "border-r border-r-black/20" : ""} ${column.headerClassName || ""}`}
                  >
                    {column.header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageData.map((item, sliceIndex) => {
              const rowIndex = startIdx + sliceIndex;
              const isSelected = selected.has(rowIndex);
              return (
                <tr
                  key={rowIndex}
                  className={`align-middle ${onRowClick ? "cursor-pointer transition-colors hover:bg-brand-border/60 focus-within:bg-brand-border/60" : ""}`}
                  onClick={
                    onRowClick ? () => onRowClick(item, rowIndex) : undefined
                  }
                  onKeyDown={
                    onRowClick
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onRowClick(item, rowIndex);
                          }
                        }
                      : undefined
                  }
                  role={onRowClick ? "button" : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                >
                  {selectable ? (
                    <td
                      className={`py-4 text-sm md:text-base text-[#1e1e1e] ${rowBg(rowIndex)} ${edgeClasses(0)} w-10`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        aria-label={`Select row ${rowIndex + 1}`}
                        checked={isSelected}
                        onChange={() => toggleRow(rowIndex)}
                        className="size-4 accent-brand cursor-pointer"
                      />
                    </td>
                  ) : null}
                  {columns.map((column, index) => {
                    const colIndex = index + (selectable ? 1 : 0);
                    return (
                      <td
                        key={column.header}
                        className={`py-4 text-sm md:text-base text-[#1e1e1e] ${rowBg(rowIndex)} ${edgeClasses(colIndex)} ${column.borderRight ? "border-r border-r-black/20" : ""} ${column.cellClassName || ""}`}
                      >
                        {column.render
                          ? column.render(item, rowIndex)
                          : column.key
                            ? String(item[column.key])
                            : null}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination ? (
        <div className="flex flex-col gap-3 border-t border-line bg-white px-3 py-3 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center gap-2 text-sm text-ink-secondary">
            <span>Showing</span>
            <Dropdown
              value={String(pageSize)}
              onChange={(v) => {
                setPageSize(Number(v));
                setPage(1);
              }}
              options={PAGE_SIZE_OPTIONS}
              position="top"
              className="!w-[80px]"
            />
            <span>
              of {data.length} {data.length === 1 ? "result" : "results"}
            </span>
          </div>
          <nav
            aria-label="Pagination"
            className="flex items-center gap-1 self-end md:self-auto"
          >
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              aria-label="Previous page"
              className="inline-flex size-8 items-center justify-center rounded-md text-[#222125] transition-colors hover:bg-[#f4f5f8] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="size-4" />
            </button>
            {pageNumbers.map((p, i) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  aria-hidden
                  className="inline-flex size-8 items-center justify-center text-sm text-ink-secondary"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  aria-current={p === page ? "page" : undefined}
                  className={`inline-flex size-8 items-center justify-center rounded-md text-sm transition-colors ${
                    p === page
                      ? "bg-brand/20 text-brand-foreground font-semibold"
                      : "text-ink hover:bg-[#f4f5f8]"
                  }`}
                >
                  {p}
                </button>
              ),
            )}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              aria-label="Next page"
              className="inline-flex size-8 items-center justify-center rounded-md text-[#222125] transition-colors hover:bg-[#f4f5f8] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronRight className="size-4" />
            </button>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
