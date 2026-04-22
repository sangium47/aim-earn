type FieldProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
  /**
   * "form" (default): 16px editable-form label, stacked above children with gap-3.
   * "display": 15px muted label above a 15px value block; used on detail/review pages.
   */
  variant?: "form" | "display";
  /** Leading icon box. Forces a horizontal row layout regardless of variant. */
  icon?: React.ReactNode;
};

export function Field({
  label,
  children,
  className = "",
  labelClassName,
  variant = "form",
  icon,
}: FieldProps) {
  if (icon) {
    return (
      <div
        className={`flex w-full items-center gap-3 text-[15px] font-medium leading-[1.4] text-[#222125] ${className}`}
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#e7e7e7] text-[#878787]">
          {icon}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <label
            className={
              labelClassName ??
              "text-[15px] font-medium leading-[1.4] text-[#5f5f5f]"
            }
          >
            {label}
          </label>
          <div className="text-[15px] font-medium leading-[1.4] text-[#222125]">
            {children}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "display") {
    return (
      <div className={`flex w-full flex-col items-start gap-2 ${className}`}>
        <label
          className={
            labelClassName ??
            "text-[15px] font-medium leading-[1.4] text-[#5f5f5f]"
          }
        >
          {label}
        </label>
        <div className="text-[15px] font-medium leading-[1.4] text-[#222125]">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex w-full flex-col gap-2 md:gap-3 ${className}`}>
      <label
        className={
          labelClassName ??
          "text-[16px] font-medium leading-[1.4] tracking-[0.32px] text-[#222125]"
        }
      >
        {label}
      </label>
      {children}
    </div>
  );
}
