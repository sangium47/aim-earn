import { MONTHS } from "@/components/mock";

/**
 * Format an ISO `YYYY-MM-DD` date string as `"12 Jan 2026"`.
 * Returns `fallback` when `iso` is falsy, and the raw string if parsing fails.
 */
export function formatDate(
  iso: string | null | undefined,
  fallback = "",
): string {
  if (!iso) return fallback;
  const [y, m, d] = iso.split("-");
  const monthIndex = Number(m) - 1;
  if (!y || !d || Number.isNaN(monthIndex) || !MONTHS[monthIndex]) return iso;
  return `${d} ${MONTHS[monthIndex]} ${y}`;
}

/**
 * Compact admin-style variant: `"12 Jan,2026"` (leading zero on the day is
 * stripped). Returns `fallback` on empty input; raw string on parse failure.
 */
export function formatDateShort(
  iso: string | null | undefined,
  fallback = "",
): string {
  if (!iso) return fallback;
  const [y, m, d] = iso.split("-");
  const monthIndex = Number(m) - 1;
  if (!y || !d || Number.isNaN(monthIndex) || !MONTHS[monthIndex]) return iso;
  return `${Number(d)} ${MONTHS[monthIndex]},${y}`;
}
