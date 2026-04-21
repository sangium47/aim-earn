"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link2, QrCode } from "lucide-react";
import { QrDownloadDialog } from "./QrDownloadDialog";

type ReferalUrlCardProps = {
  label?: string;
  url: string;
  onCopy?: (url: string) => void;
  onDownloadQr?: (url: string) => void;
};

/**
 * Read-only URL strip paired with Copy Link and Download QR Code actions.
 * Matches Figma node 137:51159 — white card, 16px radius, 24px padding,
 * soft drop shadow. Input strip is #f4f5f8 / 8px radius / 40px tall.
 */
export function ReferalUrlCard({
  label = "Referral URL",
  url,
  onCopy,
  onDownloadQr,
}: ReferalUrlCardProps) {
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    },
    [],
  );

  const flashCopied = () => {
    setCopied(true);
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  const handleCopy = async () => {
    if (onCopy) {
      onCopy(url);
      flashCopied();
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      flashCopied();
    } catch {
      // no-op — parents wanting error feedback should pass `onCopy`.
    }
  };

  return (
    <div className="flex flex-col items-end gap-2 md:gap-4 rounded-2xl bg-white p-3 md:p-6 shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)] sm:flex-row">
      <div className="flex h-10 w-full min-w-0 flex-1 items-center gap-4 overflow-hidden rounded-lg bg-[#f4f5f8] px-2 md:px-4 py-3">
        <span className="hidden md:block shrink-0 text-[16px] leading-none text-[#222125]">
          {label} :
        </span>
        <span className="min-w-0 flex-1 truncate text-[16px] leading-none text-[#5f5f5f]">
          {url}
        </span>
      </div>

      <div className="flex flex-col md:flex-row w-full shrink-0 gap-2 md:gap-4 sm:w-auto">
        <button
          type="button"
          onClick={handleCopy}
          aria-live="polite"
          className={[
            "flex min-w-[100px] flex-1 items-center justify-center gap-2 rounded-lg border p-3 text-[15px] font-medium leading-none tracking-[0.3px] transition-colors sm:flex-initial",
            copied
              ? "border-[#1f7a3b] bg-[#e8f5ec] text-[#1f7a3b]"
              : "border-[#c1c1c1] text-[#222125] hover:bg-[#f4f5f8]",
          ].join(" ")}
        >
          {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
          <span className="whitespace-nowrap">
            {copied ? "Copied" : "Copy Link"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setQrOpen(true)}
          className="flex min-w-[100px] flex-1 items-center justify-center gap-2 rounded-lg border border-[#c1c1c1] p-3 text-[15px] font-medium leading-none tracking-[0.3px] text-[#222125] transition-colors hover:bg-[#f4f5f8] sm:flex-initial"
        >
          <QrCode className="size-4" />
          <span className="whitespace-nowrap">Download QR Code</span>
        </button>
      </div>

      <QrDownloadDialog
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        url={url}
        filename="referral-qr.png"
        onDownload={onDownloadQr}
      />
    </div>
  );
}
