"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { LinkIcon, QrCodeIcon } from "./Icons";

type AffiliateUrlCardProps = {
  url: string;
  onCopy?: (url: string) => void;
  onDownloadQr?: (url: string) => void;
};

/**
 * Top strip of the affiliate dashboard: the "Affiliate URL" read-only
 * display paired with Copy Link and Download QR Code actions.
 *
 * Matches Figma node 137:51159 — white card, 16px radius, 24px padding,
 * soft drop shadow. Input strip is #f4f5f8 / 8px radius / 40px tall.
 */
export function AffiliateUrlCard({
  url,
  onCopy,
  onDownloadQr,
}: AffiliateUrlCardProps) {
  const [copied, setCopied] = useState(false);
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

  const handleDownloadQr = async () => {
    if (onDownloadQr) {
      onDownloadQr(url);
      return;
    }
    try {
      const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(url)}`;
      const response = await fetch(apiUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = "affiliate-qr.png";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      // no-op — parents wanting error feedback should pass `onDownloadQr`.
    }
  };

  return (
    <div className="flex flex-col items-end gap-2 md:gap-4 rounded-2xl bg-white p-3 md:p-6 shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)] sm:flex-row">
      <div className="flex h-10 w-full min-w-0 flex-1 items-center gap-4 overflow-hidden rounded-lg bg-[#f4f5f8] px-2 md:px-4 py-3">
        <span className="hidden md:block shrink-0 text-[16px] leading-none text-[#222125]">
          Affiliate URL :
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
          {copied ? (
            <Check className="size-4" />
          ) : (
            <LinkIcon className="size-4" />
          )}
          <span className="whitespace-nowrap">
            {copied ? "Copied" : "Copy Link"}
          </span>
        </button>

        <button
          type="button"
          onClick={handleDownloadQr}
          className="flex min-w-[100px] flex-1 items-center justify-center gap-2 rounded-lg border border-[#c1c1c1] p-3 text-[15px] font-medium leading-none tracking-[0.3px] text-[#222125] transition-colors hover:bg-[#f4f5f8] sm:flex-initial"
        >
          <QrCodeIcon className="size-4" />
          <span className="whitespace-nowrap">Download QR Code</span>
        </button>
      </div>
    </div>
  );
}

export default AffiliateUrlCard;
