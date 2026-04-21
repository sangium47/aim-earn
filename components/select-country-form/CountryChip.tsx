"use client";

import { XIcon } from "@/components/icons";

type CountryChipProps = {
  label: string;
};

/**
 * Selected-country pill. Matches the Figma "chip" pattern at
 * `surface.chip` (#f1f1f1), `rounded-[32px]`, 14px label text, and a
 * 16×16 × icon with a clickable hit-area.
 */
export function CountryChip({ label }: CountryChipProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-[32px] bg-surface-chip p-2 font-body text-sm leading-none text-ink">
      {label}
    </span>
  );
}
