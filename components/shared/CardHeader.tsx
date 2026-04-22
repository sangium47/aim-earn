import type { ReactNode } from "react";
import { SectionTitle } from "./SectionTitle";

export function CardHeader({
  title,
  subtitle,
  right,
  color,
}: {
  title: string;
  subtitle?: ReactNode;
  right?: ReactNode;
  color?: string;
}) {
  return (
    <div
      className={`flex w-full justify-between gap-2 ${
        subtitle ? "items-start" : "h-10 items-center"
      }`}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <SectionTitle color={color}>{title}</SectionTitle>
        {subtitle ? (
          <p className="text-sm font-medium leading-[1.4]">{subtitle}</p>
        ) : null}
      </div>
      {right}
    </div>
  );
}
