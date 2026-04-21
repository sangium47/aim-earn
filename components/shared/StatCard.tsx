import type { ReactNode } from "react";

type StatCardProps = {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  className?: string;
};

export function StatCard({ label, value, hint, className = "" }: StatCardProps) {
  return (
    <div
      className={[
        "flex flex-1 min-w-[160px] flex-col gap-1.5 rounded-lg border border-[#cecece] bg-[#f5f5f5] p-3 md:p-4",
        className,
      ].join(" ")}
    >
      <p className="text-xs md:text-sm font-semibold leading-[1.4] tracking-[0.02em] text-[#434343]">
        {label}
      </p>
      <p className="text-lg md:text-[24px] font-medium leading-[1.2] tracking-[0.02em] text-ink-heading">
        {value}
      </p>
      {hint ? (
        <p className="text-xs font-medium leading-[1.4] text-ink-secondary">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
