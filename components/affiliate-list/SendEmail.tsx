"use client";

import { useId, useState } from "react";
import { Button } from "@/components/shared/Button";
import { ChevronDownIcon } from "../icons";
import type { EmailTemplate } from "@/components/type";

type SendEmailProps = {
  recipientCount: number;
  templates: EmailTemplate[];
  /** Controlled: currently selected template id. Omit to use internal state. */
  value?: string;
  onChange?: (templateId: string) => void;
  onCancel?: () => void;
  /** Fires with the chosen template id; disabled until one is selected. */
  onSend?: (templateId: string) => void;
  className?: string;
};

/**
 * "Send Email" confirmation card — Figma node 137:51345.
 *
 * Presentational only: render it inline, inside a <dialog>, or inside a
 * Radix/HeadlessUI modal — up to the parent. The Send button is disabled
 * until a template is chosen, matching the copy ("Please select an email
 * template before sending").
 */
export function SendEmail({
  recipientCount,
  templates,
  value,
  onChange,
  onCancel,
  onSend,
  className = "",
}: SendEmailProps) {
  const selectId = useId();
  const [internal, setInternal] = useState("");
  const isControlled = value !== undefined;
  const selected = isControlled ? value : internal;

  const handleChange = (next: string) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const canSend = Boolean(selected);

  return (
    <section
      aria-labelledby={`${selectId}-title`}
      className={`flex flex-col items-start justify-center gap-4 md:gap-12 rounded-2xl border border-[#d9d9d9] bg-white p-4 md:p-6 ${className}`}
    >
      {/* Heading + description + select */}
      <div className="flex w-full flex-col items-start gap-2 md:gap-4">
        <div className="flex w-full flex-col items-start gap-2 md:gap-4">
          <h2
            id={`${selectId}-title`}
            className="w-full text-[18px] md:text-[24px] font-medium leading-[1.2] tracking-[0.48px] text-[#1e1e1e]"
          >
            Send Email
          </h2>
          <p className="w-full text-[14px] md:text-[16px] leading-[1.4] tracking-[0.32px] text-[#5f5f5f]">
            You are about to send an email to{" "}
            <span className="font-medium text-[#222125]">
              {recipientCount}{" "}
              {recipientCount === 1 ? "recipient" : "recipients"}
            </span>
            . Please select an email template before sending.
          </p>
        </div>

        {/* Select field */}
        <div className="flex w-full flex-col items-start gap-2">
          <label
            htmlFor={selectId}
            className="text-[14px] md:text-[16px] font-medium leading-[1.4] tracking-[0.32px] text-[#222125]"
          >
            Email Template
          </label>
          <div className="relative w-full">
            <select
              id={selectId}
              value={selected ?? ""}
              onChange={(event) => handleChange(event.target.value)}
              className={`h-10 w-full appearance-none rounded-lg border border-[#e7e7e7] bg-[#f4f5f8] py-3 pl-4 pr-9 text-[15px] font-medium leading-none tracking-[0.3px] focus:outline-none focus:ring-2 focus:ring-[#f8d237] ${
                selected ? "text-[#222125]" : "text-[#878787]"
              }`}
            >
              <option value="" disabled hidden>
                Select Template
              </option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
            {/* Custom chevron — appearance-none hides the native one */}
            <ChevronDownIcon className="absolute right-0 top-1 -translate-x-1/2 translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex w-full items-start justify-end gap-2 md:gap-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          disabled={!canSend}
          onClick={() => selected && onSend?.(selected)}
        >
          Send
        </Button>
      </div>
    </section>
  );
}

export default SendEmail;
