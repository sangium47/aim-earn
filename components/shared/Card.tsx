import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  color = "bg-white",
  radius = "rounded-2xl",
}: {
  children: ReactNode;
  className?: string;
  color?: string;
  radius?: string;
}) {
  return (
    <div className={`border border-[#e7e7e7] ${color} ${radius} ${className}`}>
      {children}
    </div>
  );
}
