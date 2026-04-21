import { ArrowUp } from "lucide-react";

export function ChangeChip({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-lg bg-[#eef6f3] px-1 py-[3px] text-xs font-semibold leading-[1.4] text-[#00ab64]">
      <ArrowUp className="size-[14px]" aria-hidden />
      <span>{value}</span>
    </span>
  );
}