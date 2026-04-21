import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  leading?: ReactNode;
  trailing?: ReactNode;
  wrapperClassName?: string;
};

export function Input({
  leading,
  trailing,
  wrapperClassName = "",
  className = "",
  ...rest
}: InputProps) {
  return (
    <div
      className={[
        "inline-flex h-10 w-full items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm text-ink transition-colors focus-within:border-ink-secondary",
        wrapperClassName,
      ].join(" ")}
    >
      {leading ? (
        <span className="flex shrink-0 items-center text-ink-tertiary">
          {leading}
        </span>
      ) : null}
      <input
        className={[
          "h-full w-full flex-1 bg-transparent outline-none placeholder:text-ink-tertiary",
          className,
        ].join(" ")}
        {...rest}
      />
      {trailing ? (
        <span className="flex shrink-0 items-center text-ink-tertiary">
          {trailing}
        </span>
      ) : null}
    </div>
  );
}
