import { ChevronDown } from "lucide-react";

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