"use client";

import { XIcon } from "./icons";

type CountryChipProps = {
  label: string;
  /** Fires when the user clicks the × icon. */
  onRemove: () => void;
  disabled?: boolean;
};

/**
 * Selected-country pill. Matches the Figma "chip" pattern at
 * `surface.chip` (#f1f1f1), `rounded-[32px]`, 14px label text, and a
 * 16×16 × icon with a clickable hit-area.
 */
export function CountryChip({ label, onRemove, disabled }: CountryChipProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-[32px] bg-surface-chip p-2 font-body text-sm leading-none text-ink">
      {label}
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remove ${label}`}
        className="-m-1 flex h-6 w-6 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-border disabled:cursor-not-allowed disabled:opacity-60"
      >
        <XIcon className="h-4 w-4" />
      </button>
    </span>
  );
}
