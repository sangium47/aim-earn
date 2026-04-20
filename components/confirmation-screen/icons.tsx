import type { SVGProps } from "react";

/**
 * Outline-style check-in-circle success icon.
 *
 * Inlined SVG matching the Figma source in node 137:56267 — 72×72 viewBox
 * with a circle and tick, using `currentColor` so Tailwind `text-*` classes
 * drive the stroke color. Default stroke weight reads as ~2.5px at the
 * Figma's 88px rendered size; `strokeWidth` can be overridden via props.
 */
export function CheckCircleIcon({
  strokeWidth = 2.5,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 72 72"
      width="72"
      height="72"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="36" cy="36" r="33" />
      <path d="M22 37 L32 47 L52 23" />
    </svg>
  );
}
