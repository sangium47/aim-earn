import { forwardRef, type InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  /**
   * Optional id override. If omitted, derived from the label so the
   * <label htmlFor> association stays correct.
   */
  id?: string;
};

/**
 * Labeled text input.
 *
 * Figma source: `data-name="Input Field"` — a vertical stack of a Label and
 * a filled Input box. Padding, radius, and colors are driven by tokens in
 * `tailwind.config.ts` (see `surface.input`, `line`, `ink.tertiary`).
 */
export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField({ label, id, className, ...props }, ref) {
    const inputId =
      id ?? `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

    return (
      <div className="flex w-full flex-col items-start gap-2">
        <label
          htmlFor={inputId}
          className="text-base font-medium leading-[1.4] tracking-figma text-ink"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={[
            "w-full rounded-lg bg-surface-input px-4 py-3 border border-line",
            "text-[16px] font-medium leading-none tracking-figma text-ink",
            "placeholder:text-ink-tertiary placeholder:font-medium",
            "outline-none transition-colors",
            "focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-surface-card",
            className ?? "",
          ].join(" ")}
          {...props}
        />
      </div>
    );
  },
);
