/**
 * Inline status pill — colored dot + label. Callers resolve their own
 * status config (label + dotColor) and pass the matched entry.
 */
export function StatusPill({
  label,
  dotColor,
}: {
  label: string;
  dotColor: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-[14px] font-medium text-[#222125]">
      <span
        aria-hidden
        className="inline-block size-2 rounded-full"
        style={{ backgroundColor: dotColor }}
      />
      {label}
    </span>
  );
}
