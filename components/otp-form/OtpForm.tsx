"use client";

import { useState, type FormEvent } from "react";
import { OtpInput } from "./OtpInput";
import type { OtpFormProps } from "@/components/type";

/**
 * OTP confirmation form.
 *
 * Source: Figma node 2041:47339 ("Send Otp") in the Aim Earn UI Design file.
 * Shows a heading, subtitle, OTP digit input, and a Submit button.
 *
 * Client component — owns the OTP code state.
 */
export function OtpForm({
  onSubmit,
  onBack,
  length = 6,
  isSubmitting = false,
  autoSubmit = false,
  className,
}: OtpFormProps) {
  const [code, setCode] = useState("");

  const submit = async (value: string) => {
    await onSubmit?.(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.length !== length) return;
    await submit(code);
  };

  const isComplete = code.length === length;

  return (
    <section
      className={["w-full bg-surface-card", className ?? ""].join(" ")}
      aria-labelledby="otp-heading"
    >
      <div className="flex min-h-[840px] flex-col items-center justify-center gap-8 px-6 pb-24 pt-8">
        {/* Heading */}
        <header className="flex w-full flex-col items-center justify-center gap-2 text-center">
          <h2
            id="otp-heading"
            className="font-heading text-2xl font-semibold leading-[1.2] tracking-[-0.02em] text-ink-heading"
          >
            OTP Confirmation
          </h2>
          <p className="font-body text-base font-normal leading-[1.4] text-ink-secondary">
            Check your email and fill in OTP
          </p>
        </header>

        {/* OTP input + submit stack */}
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[354px] flex-col items-start gap-6"
          noValidate
        >
          <div className="flex w-full flex-col items-start gap-2">
            <label
              htmlFor="otp-code"
              className="text-base font-medium leading-[1.4] tracking-figma text-ink"
            >
              OTP
            </label>
            <OtpInput
              id="otp-code"
              value={code}
              onChange={setCode}
              length={length}
              disabled={isSubmitting}
              onComplete={autoSubmit ? submit : undefined}
              ariaLabel="OTP Confirmation code"
            />
          </div>
          <div className="w-full space-y-3">
            <button
              type="submit"
              disabled={!isComplete || isSubmitting}
              className={[
                "flex w-full min-w-[100px] items-center justify-center gap-2 rounded-lg bg-brand p-3",
                "text-[15px] font-medium leading-none tracking-figma text-brand-foreground",
                "transition-opacity hover:opacity-90",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-border focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-60",
              ].join(" ")}
            >
              {isSubmitting ? "Verifying…" : "Submit"}
            </button>

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className={[
                  "flex w-full min-w-[100px] items-center justify-center gap-2 rounded-lg bg-surface-card border border-border p-3",
                  "text-[15px] font-medium leading-none tracking-figma text-ink",
                  "transition-opacity hover:opacity-90",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-border focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                ].join(" ")}
              >
                Back
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
