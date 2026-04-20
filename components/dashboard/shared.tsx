import type { ReactNode } from "react";
import { ArrowUp, ChevronDown } from "lucide-react";

export function SelectPill({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center justify-between gap-6 rounded-lg border border-[#cacaca] bg-white pl-4 pr-3 py-3 text-base font-medium tracking-[0.02em] text-[#222125] hover:border-[#b5b5b5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b1610c] focus-visible:ring-offset-2"
    >
      <span>{label}</span>
      <ChevronDown className="size-4 shrink-0" />
    </button>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-medium leading-[1.2] tracking-[0.02em] text-[#1e1e1e] text-xl">
      {children}
    </h2>
  );
}

export function ChangeChip({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-lg bg-[#eef6f3] px-1 py-[3px] text-xs font-semibold leading-[1.4] text-[#00ab64]">
      <ArrowUp className="size-[14px]" aria-hidden />
      <span>{value}</span>
    </span>
  );
}

export function Card({
  children,
  className = "",
  radius = "rounded-2xl",
}: {
  children: ReactNode;
  className?: string;
  radius?: string;
}) {
  return (
    <div className={`border border-[#e7e7e7] bg-white ${radius} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div className="flex h-10 w-full items-center justify-between">
      <SectionTitle>{title}</SectionTitle>
      {right}
    </div>
  );
}