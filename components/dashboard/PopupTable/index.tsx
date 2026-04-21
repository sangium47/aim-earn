import { Table, type TableColumn } from "@/components/shared";
import { StatCard } from "./StatCard";
import { type AffiliateMember, type TableSummary } from "./data";
import type { ReactNode } from "react";
import { XIcon } from "@/components/icons";

type PopupTableProps = {
  summary?: TableSummary;
  stats?: { label: string; value: string }[];
  table?: ReactNode;
  onClose?: () => void;
};

/**
 * "Agent Lists" — product-detail card showing summary metrics and a table
 * of affiliate members for a given product.
 *
 * Composition:
 *   header (title + description + close)  →  4 StatCards  →  Table
 *
 * Pure presentational; pass `onClose` to wire the X button.
 */
export function PopupTable({
  summary,
  stats = [],
  table,
  onClose,
}: PopupTableProps) {
  return (
    <section className="flex flex-col gap-3 md:gap-6 rounded-2xl border border-[#d9d9d9] bg-white p-3 md:p-6">
      {/* Header */}
      <header className="flex items-start gap-6">
        <div className="flex flex-1 flex-col gap-2.5">
          <h2 className="text-[24px] font-medium leading-[1.2] tracking-[0.48px] text-[#1e1e1e]">
            {summary?.name}
          </h2>
          <p className="text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#5f5f5f]">
            {summary?.description}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex size-6 shrink-0 items-center justify-center text-[#222125] transition-opacity hover:opacity-70"
        >
          <XIcon />
        </button>
      </header>
      {/* Stat strip */}
      <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>
      {table ? table : null}
    </section>
  );
}

export default PopupTable;
