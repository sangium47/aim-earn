import type { ButtonHTMLAttributes, ReactNode } from "react";

type SocialButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  children: ReactNode;
};

/**
 * Outlined pill button used for "Continue with {provider}".
 *
 * Figma source: three instances (Gmail, Facebook, Apple ID) with
 * `rounded-[var(--sds-size-radius-full,9999px)]` and a 1px border in
 * `--sds-color-border-default-default`. The wide px-[76px] from the source
 * is centering-padding — replaced here with flex centering so the label is
 * always visually centered regardless of label length.
 */
export function SocialButton({
  icon,
  children,
  className,
  type = "button",
  ...props
}: SocialButtonProps) {
  return (
    <button
      type={type}
      className={[
        "flex h-[46px] w-full items-center justify-center gap-2 rounded-full",
        "border border-line-muted bg-surface-card px-4 py-3",
        "text-base font-normal leading-none text-ink-base",
        "transition-colors hover:bg-surface-input",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className ?? "",
      ].join(" ")}
      {...props}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center">
        {icon}
      </span>
      <span>{children}</span>
    </button>
  );
}
