"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Download, Link2, QrCode } from "lucide-react";
import { QrDownloadDialog } from "@/components/shared";

type ProductActionsProps = {
  shareUrl: string;
  downloadUrl?: string;
  downloadFilename?: string;
  qrFilename?: string;
  qrSubtitle?: ReactNode;
  className?: string;
  disabledDownload?: boolean;
  onCopy?: (url: string) => void;
  onDownload?: (url: string) => void;
};

/**
 * Trio of row-level product actions: Copy Link, show QR (opens
 * `QrDownloadDialog`), and Download. Self-contained — manages its own copy
 * flash and QR dialog state. Each button calls `stopPropagation` so the
 * component is safe to drop inside a clickable row.
 */
export function ProductActions({
  shareUrl,
  downloadUrl,
  downloadFilename = "download",
  qrFilename = "qr.png",
  qrSubtitle,
  className = "",
  disabledDownload = false,
  onCopy,
  onDownload,
}: ProductActionsProps) {
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  const flashCopied = () => {
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1500);
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCopy) {
      onCopy(shareUrl);
      flashCopied();
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      flashCopied();
    } catch {
      // no-op
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabledDownload) return;
    const target = downloadUrl ?? shareUrl;
    if (onDownload) {
      onDownload(target);
      return;
    }
    try {
      const response = await fetch(target);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = downloadFilename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      // no-op
    }
  };

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy link"}
          className={[
            "inline-flex size-9 items-center justify-center rounded-lg border transition-colors",
            copied
              ? "border-[#1f7a3b] bg-[#e8f5ec] text-[#1f7a3b]"
              : "border-[#c1c1c1] text-[#222125] hover:bg-[#f4f5f8]",
          ].join(" ")}
        >
          {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setQrOpen(true);
          }}
          aria-label="Show QR code"
          className="inline-flex size-9 items-center justify-center rounded-lg border border-[#c1c1c1] text-[#222125] transition-colors hover:bg-[#f4f5f8]"
        >
          <QrCode className="size-4" />
        </button>
        {disabledDownload ? null : (
          <button
            type="button"
            onClick={handleDownload}
            aria-label="Download"
            className={[
              "inline-flex size-9 items-center justify-center rounded-lg border transition-colors",
              "border-[#c1c1c1] text-[#222125] hover:bg-[#f4f5f8]",
            ].join(" ")}
          >
            <Download className="size-4" />
          </button>
        )}
      </div>

      <QrDownloadDialog
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        url={shareUrl}
        subtitle={qrSubtitle}
        filename={qrFilename}
      />
    </>
  );
}
