import type { LucideIcon } from "lucide-react";

type SummaryCardProps = {
  Icon: LucideIcon;
  label: string;
  value: string;
};

export function SummaryCard({ Icon, label, value }: SummaryCardProps) {
  return (
    <article className="flex h-[140px] flex-col justify-between overflow-hidden rounded-3xl border border-[#e7e7e7] bg-white p-4">
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-full bg-[#f1ead9]">
          <Icon className="size-5 text-[#796100]" aria-hidden />
        </span>
        <span className="text-base font-semibold tracking-[0.01em] text-[#222125]">
          {label}
        </span>
      </div>
      <p className="text-[32px] font-medium leading-[1.2] text-[#222125]">
        {value}
      </p>
    </article>
  );
}
