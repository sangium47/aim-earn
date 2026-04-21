import type { ReactNode } from "react";

export function PageTitle({
  title,
  description,
  actions,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[24px] font-medium leading-[1.2] tracking-[0.48px] text-ink-heading md:text-[28px]">
          {title}
        </h1>
        {description ? (
          <div className="text-sm font-medium leading-[1.4] tracking-[0.28px] text-ink-secondary">
            {description}
          </div>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
