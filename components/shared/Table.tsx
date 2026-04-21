"use client";

import { useMemo, useState, type ReactNode } from "react";

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
};

export function Table<T>({
  data,
  columns,
  className = "",
  minWidth,
  onRowClick,
  selectable = false,
  selectedIndexes,
  onSelectionChange,
}: TableProps<T>) {
  const [internal, setInternal] = useState<Set<number>>(new Set());
  const isControlled = selectedIndexes !== undefined;
  const selected = useMemo(
    () => (isControlled ? new Set(selectedIndexes) : internal),
    [isControlled, selectedIndexes, internal],
  );

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

  return (
    <div className={`max-w-full overflow-x-auto rounded-2xl`}>
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
          {data.map((item, rowIndex) => {
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
                    className={`py-4 text-sm md:text-base text-[#1e1e1e] ${rowIndex % 2 === 0 ? "bg-brand-border/20" : "bg-brand-border"} ${edgeClasses(0)} w-10`}
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
                      className={`py-4 text-sm md:text-base text-[#1e1e1e] ${rowIndex % 2 === 0 ? "bg-brand-border/20" : "bg-brand-border"} ${edgeClasses(colIndex)} ${column.borderRight ? "border-r border-r-black/20" : ""} ${column.cellClassName || ""}`}
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
  );
}
