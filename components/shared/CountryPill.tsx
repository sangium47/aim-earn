/**
 * Yellow ISO-code country chip used across admin/distributor/affiliate lists.
 */
export function CountryPill({ code }: { code: string }) {
  return (
    <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[rgba(248,210,55,0.35)] px-2 text-xs font-medium tracking-[0.02em] text-ink">
      {code}
    </span>
  );
}
