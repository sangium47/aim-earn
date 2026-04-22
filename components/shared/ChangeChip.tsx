import { ArrowUp } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Inline "change" pill used on dashboard stat tiles.
 *
 * When `tooltip` is provided a Figma-styled popover (node 137:137661) is
 * shown above the chip on hover/focus with a matching downward beak.
 */
export function ChangeChip({
  value,
  tooltip,
}: {
  value: string;
  tooltip?: ReactNode;
}) {
  const chip = (
    <span className="inline-flex items-center gap-0.5 rounded-lg bg-[#fff] px-1 py-[3px] text-xs font-semibold leading-[1.4] text-[#00ab64]">
      <ArrowUp className="size-[14px]" aria-hidden />
      <span>{value}</span>
    </span>
  );

  if (!tooltip) return chip;

  return (
    <span
      tabIndex={0}
      className="group relative inline-flex outline-none"
    >
      {chip}
      <span
        role="tooltip"
        className={[
          "pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2",
          "whitespace-nowrap rounded-lg border border-[#d9d9d9] bg-white px-3 py-2",
          "text-xs font-semibold leading-[1.4] text-[#00ab64]",
          "shadow-[0_1px_4px_rgba(12,12,13,0.1),0_1px_4px_rgba(12,12,13,0.05)]",
          "opacity-0 transition-opacity duration-150",
          "group-hover:opacity-100 group-focus-visible:opacity-100",
        ].join(" ")}
      >
        {tooltip}
        {/* Downward beak — rotated square with only the bottom/right edges bordered */}
        <span
          aria-hidden
          className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 border-b border-r border-[#d9d9d9] bg-white"
        />
      </span>
    </span>
  );
}
