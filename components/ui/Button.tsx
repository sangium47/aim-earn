import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import type { ButtonVariant, ButtonSize } from "@/components/type";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-figma transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  brand:
    "bg-brand text-brand-foreground focus-visible:ring-brand-border rounded-lg",
  outline:
    "border border-line-muted bg-surface-card text-ink-base focus-visible:ring-brand rounded-full",
};

const sizes: Record<ButtonSize, string> = {
  md: "min-w-[100px] p-3 text-[15px] leading-none",
  lg: "h-[46px] px-4 py-3 text-base leading-none",
};

/**
 * Shared button primitive used across auth flows.
 *
 * Variants:
 *   - `brand`   → yellow `#f8d237` CTA (matches "Register", "Submit",
 *                 "Continue" buttons across the Figma auth frames)
 *   - `outline` → pill-shaped outlined button (social sign-in style)
 *
 * This extraction consolidates the brand-button styling that was previously
 * duplicated in RegistrationForm and OtpForm. Those two forms still carry
 * inline copies — migrating them is safe follow-up tech debt.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "brand",
      size = "md",
      leftIcon,
      rightIcon,
      type = "button",
      className,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={[
          base,
          variants[variant],
          sizes[size],
          "w-full",
          className ?? "",
        ].join(" ")}
        {...props}
      >
        {leftIcon ? (
          <span className="flex h-5 w-5 shrink-0 items-center justify-center">
            {leftIcon}
          </span>
        ) : null}
        <span>{children}</span>
        {rightIcon ? (
          <span className="flex h-5 w-5 shrink-0 items-center justify-center">
            {rightIcon}
          </span>
        ) : null}
      </button>
    );
  },
);
