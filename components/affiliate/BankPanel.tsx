"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/icons";
import type { Distributor } from "@/components/type";

type BankPanelProps = {
  member: Distributor;
};

export function BankPanel({ member }: BankPanelProps) {
  const bank = member.bank;

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-[#cbcfd5] bg-white p-4 md:p-6 md:min-h-[50vh]">
      <h3 className="text-[18px] md:text-[20px] font-medium leading-[1.2] tracking-[0.4px] text-[#1e1e1e]">
        Bank Details
      </h3>

      {bank ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-x-8 md:gap-y-6">
          <Field label="Bank Name:" value={bank.name} logoUrl={bank.logoUrl} />
          <Field label="SWIFT:" value={bank.swift} />
          <Field label="Account Name:" value={bank.accountName} />
          <Field label="Account Number:" value={bank.accountNumber} />
        </div>
      ) : (
        <p className="text-[14px] font-medium leading-[1.4] text-ink-secondary">
          No bank details on file.
        </p>
      )}
    </section>
  );
}

function Field({
  label,
  value,
  logoUrl,
}: {
  label: string;
  value: string;
  logoUrl?: string;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-[16px] font-medium leading-[1.4] tracking-[0.32px] text-[#757575]">
        {label}
      </p>
      <div className="flex items-center gap-2">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt=""
            className="size-[18px] rounded-full object-cover"
          />
        ) : null}
        <p className="text-[16px] font-medium leading-[1.4] tracking-[0.32px] text-[#222125]">
          {value}
        </p>
        <CopyButton value={value} label={label.replace(":", "")} />
      </div>
    </div>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
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
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can reject in insecure contexts / permission denied.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : `Copy ${label}`}
      className="inline-flex size-5 items-center justify-center text-[#222125] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f8d237] focus-visible:ring-offset-1"
    >
      {copied ? (
        <CheckIcon className="size-4" />
      ) : (
        <CopyIcon className="size-4" />
      )}
    </button>
  );
}
