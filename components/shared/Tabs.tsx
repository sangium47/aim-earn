"use client";

import type { TabItem } from "@/components/type";

type TabsProps<TValue extends string> = {
  items: TabItem<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
  className?: string;
};

/**
 * Pill-style tabs (Figma 137:52648) — the active tab has a yellow pill
 * background, inactive tabs are grey text only. Rendered as real
 * <button role="tab"> elements inside a tablist for accessibility.
 */
export function Tabs<TValue extends string>({
  items,
  value,
  onChange,
  className = "",
}: TabsProps<TValue>) {
  return (
    <div
      role="tablist"
      className={`flex items-start overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {items.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={`inline-flex shrink-0 items-center justify-center rounded-xl px-4 py-1.5 text-[16px] font-medium leading-[1.4] tracking-[0.32px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f8d237] focus-visible:ring-offset-2 ${
              active
                ? "bg-[#f8d237] text-[#222125]"
                : "text-[#5f5f5f] hover:text-[#222125]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
