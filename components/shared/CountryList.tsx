import { CountryPill } from "./CountryPill";

type CountryListProps = {
  codes: string[];
  /**
   * Maximum number of country pills to show before collapsing the rest
   * into a "+N" overflow circle. Omit to render every code.
   */
  max?: number;
};

/**
 * Renders a row of `CountryPill`s. When `max` is set and the list is
 * longer than that, the first `max` pills are shown and the remaining
 * codes are collapsed into a single "+N" circle whose title/aria-label
 * still surfaces the hidden codes.
 */
export function CountryList({ codes, max = 2 }: CountryListProps) {
  const visibleLimit = typeof max === "number" ? max : codes.length;
  const visible = codes.slice(0, visibleLimit);
  const overflow = Math.max(0, codes.length - visible.length);
  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((code) => (
        <CountryPill key={code} code={code} />
      ))}
      {overflow > 0 ? (
        <span
          aria-label={`+${overflow} more countries`}
          title={codes.slice(visibleLimit).join(", ")}
          className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[rgba(248,210,55,0.35)] px-2 text-xs font-medium tracking-[0.02em] text-ink"
        >
          +{overflow}
        </span>
      ) : null}
    </div>
  );
}
