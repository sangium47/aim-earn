import type { ReactNode } from "react";

export function SectionTitle({
  children,
  color,
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <h2
      className={`font-medium leading-[1.2] tracking-[0.02em] text-lg md:text-xl ${color ? color : "text-[#1e1e1e]"}`}
    >
      {children}
    </h2>
  );
}
