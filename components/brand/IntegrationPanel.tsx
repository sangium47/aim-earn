"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Eye, EyeOff, HelpCircle, RefreshCcw } from "lucide-react";
import { Divider, Field, SectionRow } from "@/components/shared";
import type { Brand } from "@/components/type";

const INTEGRATION_TITLE_CLASS =
  "text-[18px] md:text-[20px] font-semibold leading-[1.3] text-[#1e1e1e]";

const WEBHOOK_URL = "https://aimearn.platform.com/api/webhooks/order";
const SYNC_URL = "https://aimearn.platform.com/api/sync/products";
const REFERRAL_URL = "https://aimearn.platform.com/api/referral/events";

type IntegrationPanelProps = {
  brand: Brand;
};

function stripProtocol(url: string) {
  return url.replace(/^https?:\/\//, "");
}

/** Generate a random hex token, optionally prefixed (e.g. "ak_live_"). */
function generateToken(prefix = "", byteLength = 24) {
  const bytes = new Uint8Array(byteLength);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < byteLength; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${prefix}${hex}`;
}

export function IntegrationPanel({ brand }: IntegrationPanelProps) {
  const [platformHost, setPlatformHost] = useState(
    stripProtocol(brand.website),
  );
  const [showSecret, setShowSecret] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [webhookSecret, setWebhookSecret] = useState(() => generateToken());
  const [internalApiKey, setInternalApiKey] = useState(() =>
    generateToken("ak_live_"),
  );

  const refreshWebhookSecret = () => {
    setWebhookSecret(generateToken());
    setShowSecret(false);
  };
  const refreshInternalApiKey = () => {
    setInternalApiKey(generateToken("ak_live_"));
    setShowKey(false);
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex items-center gap-2">
        <h3 className="text-[16px] font-semibold leading-[1.4] tracking-[0.32px] text-[#222125]">
          API-Integration
        </h3>
        <button
          type="button"
          aria-label="Help"
          className="inline-flex items-center justify-center text-[#5f5f5f]"
        >
          <HelpCircle className="size-4" />
        </button>
      </div>

      <section className="flex flex-col gap-3 md:gap-6 rounded-2xl bg-white p-4 md:p-6 shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]">
        <SectionRow
          title="Platform Information"
          titleClassName={INTEGRATION_TITLE_CLASS}
        >
          <Field label="Label">
            <PrefixInput
              value={platformHost}
              onChange={setPlatformHost}
            />
          </Field>
        </SectionRow>

        <Divider />

        <SectionRow
          title="Order Webhooks"
          hint="Send webhooks when orders are completed or refunded. This is how the affiliate system calculates and assigns commissions."
          titleClassName={INTEGRATION_TITLE_CLASS}
        >
          <div className="flex flex-col gap-4 md:gap-6 w-full">
            <Field label="Label">
              <div className="flex items-end gap-3 md:gap-4">
                <PrefixInput value={stripProtocol(WEBHOOK_URL)} disabled />
                <CopyIconButton value={WEBHOOK_URL} label="webhook URL" />
              </div>
            </Field>

            <Field label="Webhook Secret">
              <div className="flex items-end gap-3 md:gap-4">
                <SecretInput
                  value={webhookSecret}
                  visible={showSecret}
                  onToggle={() => setShowSecret((v) => !v)}
                />
                <IconButton
                  aria-label="Regenerate secret"
                  onClick={refreshWebhookSecret}
                >
                  <RefreshCcw className="size-4" />
                </IconButton>
              </div>
            </Field>
          </div>
        </SectionRow>

        <Divider />

        <SectionRow
          title="Sync Product"
          hint="Sync your product catalog before sending order webhooks. Products are matched by externalProductId."
          titleClassName={INTEGRATION_TITLE_CLASS}
        >
          <div className="flex flex-col gap-4 md:gap-6 w-full">
            <Field label="Label">
              <div className="flex items-end gap-3 md:gap-4">
                <PrefixInput value={stripProtocol(SYNC_URL)} disabled />
                <CopyIconButton value={SYNC_URL} label="sync URL" />
              </div>
            </Field>

            <Field label="Internal API Key">
              <div className="flex items-end gap-3 md:gap-4">
                <SecretInput
                  value={internalApiKey}
                  visible={showKey}
                  onToggle={() => setShowKey((v) => !v)}
                  variant="outlined"
                />
                <IconButton
                  aria-label="Regenerate key"
                  onClick={refreshInternalApiKey}
                >
                  <RefreshCcw className="size-4" />
                </IconButton>
              </div>
            </Field>
          </div>
        </SectionRow>

        <Divider />

        <SectionRow
          title="Referral Event Tracking"
          hint="Track referral link clicks for analytics. Commissions are calculated via order webhooks, not this endpoint."
          footnote="(Optional)"
          titleClassName={INTEGRATION_TITLE_CLASS}
        >
          <Field label="Label">
            <div className="flex items-end gap-3 md:gap-4">
              <PrefixInput value={stripProtocol(REFERRAL_URL)} disabled />
              <CopyIconButton value={REFERRAL_URL} label="referral URL" />
            </div>
          </Field>
        </SectionRow>
      </section>
    </div>
  );
}

function PrefixInput({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex h-10 w-full overflow-hidden rounded-lg ${disabled ? "bg-[#f4f5f8]" : "bg-[#f4f5f8]"}`}
    >
      <div
        className={`flex h-full items-center border-r px-4 text-[16px] font-medium leading-[1.4] tracking-[0.32px] ${disabled ? "border-[#8d95a5] text-[#737373]" : "border-[#cbcfd5] text-[#222125]"}`}
      >
        https://
      </div>
      <input
        value={value}
        disabled={disabled}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={!onChange}
        className={`h-full flex-1 bg-transparent px-4 text-[16px] font-medium leading-[1.4] tracking-[0.32px] outline-none ${disabled ? "text-[#878787] cursor-not-allowed" : "text-[#222125]"}`}
      />
    </div>
  );
}

function SecretInput({
  value,
  visible,
  onToggle,
  variant = "filled",
}: {
  value: string;
  visible: boolean;
  onToggle: () => void;
  variant?: "filled" | "outlined";
}) {
  return (
    <div
      className={`flex h-10 w-full items-center gap-2 rounded-lg px-4 ${variant === "filled" ? "bg-[#f4f5f8]" : "border border-[#d9d9d9] bg-white"}`}
    >
      <input
        type={visible ? "text" : "password"}
        value={value}
        readOnly
        className="flex-1 min-w-0 bg-transparent text-[16px] font-medium tracking-[0.02em] text-[#222125] outline-none"
      />
      <button
        type="button"
        aria-label={visible ? "Hide value" : "Show value"}
        onClick={onToggle}
        className="inline-flex size-6 items-center justify-center text-[#5f5f5f] hover:text-[#222125]"
      >
        {visible ? (
          <EyeOff className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
      </button>
    </div>
  );
}

function IconButton({
  children,
  onClick,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  "aria-label": string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#d9d9d9] bg-white text-[#222125] transition-colors hover:bg-[#f4f5f8]"
    >
      {children}
    </button>
  );
}

function CopyIconButton({ value, label }: { value: string; label: string }) {
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
    <IconButton
      aria-label={copied ? "Copied" : `Copy ${label}`}
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="size-4 text-[#00ab64]" />
      ) : (
        <Copy className="size-4" />
      )}
    </IconButton>
  );
}
