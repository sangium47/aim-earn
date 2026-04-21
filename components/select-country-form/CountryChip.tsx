"use client";

import { XIcon } from "@/components/icons";

type CountryChipProps = {
  label: string;
  /** Fired when the user clicks the ✕ button. When omitted, no remove button renders. */
  onRemove?: () => void;
};

/**
 * Selected-country pill. Matches the Figma "chip" pattern at
 * `surface.chip` (#f1f1f1), `rounded-[32px]`, 14px label text, and a
 * 16×16 × icon with a clickable hit-area.
 */
export function CountryChip({ label, onRemove }: CountryChipProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-[32px] bg-surface-chip p-2 font-body text-sm leading-none text-ink">
      {label}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-ink hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <XIcon className="size-4" />
        </button>
      ) : null}
    </span>
  );
}
