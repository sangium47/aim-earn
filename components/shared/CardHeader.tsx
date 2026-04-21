import type { ReactNode } from "react";
import { SectionTitle } from "./SectionTitle";

export function CardHeader({
  title,
  right,
  color,
}: {
  title: string;
  right?: ReactNode;
  color?: string;
}) {
  return (
    <div className={`flex h-10 w-full items-center justify-between`}>
      <SectionTitle color={color}>{title}</SectionTitle>
      {right}
    </div>
  );
}