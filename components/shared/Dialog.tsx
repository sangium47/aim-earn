"use client";

import { useEffect, type ReactNode } from "react";

export function Dialog({
  open,
  onClose,
  children,
  className = "",
  width = "max-w-3xl",
}: {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
  className?: string;
  width?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 w-full flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className={`min-h-[240px] w-full ${width} rounded-2xl bg-white shadow-xl ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
