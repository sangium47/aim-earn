"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/icons";

type RefCodeCardProps = {
  label: string;
  code: string;
};

export function RefCodeCard({ label, code }: RefCodeCardProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can reject in insecure contexts / permission denied.
    }
  };

  return (
    <div className="w-full inline-flex flex-col items-start justify-center md:gap-1 rounded-lg bg-white px-4 py-2 shadow-[0_1px_4px_0_rgba(12,12,13,0.1),0_1px_4px_0_rgba(12,12,13,0.05)]">
      <p className="text-[10px] md:text-[12px] font-medium text-[#222125]">
        {label} :
      </p>
      <div className="w-full flex items-center justify-between gap-2">
        <p className="flex-1 text-[12px] md:text-[14px] font-medium text-[#222125]">
          {code}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : `Copy ${label}`}
          className="inline-flex size-4 items-center justify-center text-[#222125] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f8d237] focus-visible:ring-offset-1"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
    </div>
  );
}

