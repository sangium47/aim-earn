import type { SVGProps } from "react";

/**
 * Icons for the Select Country component.
 *
 * Inlined as SVG React components rather than downloaded from the Figma CDN
 * because (a) the signed Figma asset URLs expire in 7 days, and (b) per the
 * figma-implement-design skill we don't install icon packages for two glyphs.
 * Both icons use `currentColor` so Tailwind text-color classes style them.
 */

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}
