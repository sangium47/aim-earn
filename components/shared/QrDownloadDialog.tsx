"use client";

import { useState, type ReactNode } from "react";
import { Download, X } from "lucide-react";
import { Dialog } from "./Dialog";

type QrDownloadDialogProps = {
  open: boolean;
  onClose: () => void;
  url: string;
  title?: string;
  subtitle?: ReactNode;
  filename?: string;
  onDownload?: (url: string) => void;
};

export function QrDownloadDialog({
  open,
  onClose,
  url,
  title = "Download QR Code",
  subtitle,
  filename = "qr.png",
  onDownload,
}: QrDownloadDialogProps) {
  const [downloading, setDownloading] = useState(false);
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(url)}`;

  const handleDownload = async () => {
    if (onDownload) {
      onDownload(url);
      onClose();
      return;
    }
    setDownloading(true);
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      // no-op
    } finally {
      setDownloading(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} width="max-w-md" onClose={onClose}>
      <div className="flex flex-col gap-4 md:gap-6 py-4 md:py-6">
        <header className="flex items-center justify-between gap-4 border-b px-4 md:px-6 pb-2 md:pb-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-[18px] md:text-[24px] font-medium leading-[1.2] tracking-[0.02em] text-[#1e1e1e]">
              {title}
            </h2>
            {subtitle ? (
              <p className="text-sm font-medium leading-[1.4] tracking-[0.02em] text-[#5f5f5f]">
                {subtitle}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[#222125] transition-colors hover:bg-[#f4f5f8]"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="flex flex-col items-center gap-3 px-4 md:px-6">
          <div className="rounded-xl bg-white p-4">
            {/* Remote QR preview — the QR server renders deterministically from the URL. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrImageUrl}
              alt="QR code preview"
              className="size-[220px] md:size-[260px]"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-center md:gap-3 px-4 md:px-6">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className={[
              "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-opacity hover:opacity-90",
              downloading
                ? "bg-brand-border text-brand-foreground/40 cursor-not-allowed"
                : "bg-brand text-brand-foreground",
            ].join(" ")}
          >
            <Download className="size-4" />
            Download QR Code
          </button>
        </div>
      </div>
    </Dialog>
  );
}
