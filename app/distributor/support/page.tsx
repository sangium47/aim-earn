"use client";

import { useEffect, useRef, useState } from "react";
import { Breadcrumb, Card, PageTitle } from "@/components/shared";
import { CheckIcon, CopyIcon } from "@/components/icons";

const COMPANY_NAME = "Aimearn CO., LTD.";
const COMPANY_ADDRESS =
  "123 Galactic Avenue, Suite 456, Nova Station, Kepler-186f";
const SUPPORT_EMAIL = "support@aimearn.com";
const SUPPORT_PHONE = "+65 092 9222";

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
      className="inline-flex size-8 items-center justify-center rounded-lg text-[#222125] transition-colors hover:bg-[#f4f5f8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f8d237] focus-visible:ring-offset-1"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}

export default function SupportPage() {
  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb items={[{ label: "Support" }]} />
      <PageTitle title="Support" />
      <div className="flex flex-col gap-2 md:gap-4 md:flex-row justify-between">
        <Card className="md:flex-1 h-[120px] md:h-[165px] flex items-start gap-3 p-4 md:p-6">
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <h2 className="text-[18px] md:text-[20px] font-medium leading-[1.2] tracking-[0.02em] text-[#1e1e1e]">
              {COMPANY_NAME}
            </h2>
            <p className="text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#5f5f5f]">
              {COMPANY_ADDRESS}
            </p>
          </div>
        </Card>

        <Card className="md:flex-1 h-[120px] md:h-[165px] flex items-start gap-3 p-4 md:p-6">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <h2 className="text-[18px] md:text-[20px] font-medium leading-[1.2] tracking-[0.02em] text-[#1e1e1e]">
              Email
            </h2>
            <div className="flex space-x-1 items-center">
              <p className="text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#5f5f5f]">
                {SUPPORT_EMAIL}
              </p>
              <CopyButton value={SUPPORT_EMAIL} label="email" />
            </div>
          </div>
        </Card>

        <Card className="md:flex-1 h-[120px] md:h-[165px] flex items-start gap-3 p-4 md:p-6">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <h2 className="text-[18px] md:text-[20px] font-medium leading-[1.2] tracking-[0.02em] text-[#1e1e1e]">
              Phone Number
            </h2>
            <div className="flex space-x-1 items-center">
              <p className="text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#5f5f5f]">
                {SUPPORT_PHONE}
              </p>
              <CopyButton value={SUPPORT_PHONE} label="phone number" />
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
