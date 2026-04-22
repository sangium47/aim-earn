"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { InputField } from "./InputField";
import { SocialButton } from "./SocialButton";
import { AppleIcon, GoogleIcon } from "@/components/icons";
import type { RegistrationFormProps } from "@/components/type";

/**
 * Registration form component.
 *
 * Source: Figma node 137:56199 ("Register as a distributor") in the
 * Aim Earn UI Design file. Split into this container + `InputField` +
 * `SocialButton` primitives. Client component because it owns input state.
 *
 * Copy is kept verbatim from the Figma frame.
 */
export function RegistrationForm({
  onSubmit,
  onGoogleSignIn,
  onAppleSignIn,
  isSubmitting = false,
  error,
  className,
}: RegistrationFormProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit?.({ email });
  };

  return (
    <section
      className={["w-full overflow-hidden", className ?? ""].join(" ")}
      aria-labelledby="registration-heading"
    >
      <div className="flex flex-col items-center justify-center gap-8 px-6 pb-24 pt-8">
        {/* Heading */}
        <header className="flex w-full flex-col items-center justify-center gap-2 text-center">
          <h2
            id="registration-heading"
            className="text-2xl font-medium leading-[1.2] tracking-figma text-ink-heading"
          >
            Login
          </h2>
        </header>

        {/* Form + social buttons stack */}
        <div className="flex w-full max-w-[354px] flex-col items-start gap-4">
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col items-start gap-4"
            noValidate
          >
            <InputField
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "email-error" : undefined}
              required
            />
            {/* Register links — land on the register pages with a return-to
                query so those pages can send the user back to /login. */}
            <div className="flex w-full flex-col md:flex-row md:items-center md:justify-between gap-2">
              <Link
                href="/register-distributor?page=/login"
                className="text-sm font-medium underline flex-1 leading-[1.4] tracking-figma text-ink hover:underline"
              >
                Register to be Distributor
              </Link>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={[
                "flex w-full min-w-[100px] items-center justify-center gap-2 rounded-lg bg-brand p-3",
                "text-[15px] font-medium leading-none tracking-figma text-brand-foreground",
                "transition-opacity hover:opacity-90",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-border focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-60",
              ].join(" ")}
            >
              {isSubmitting ? "Sending OTP.." : "Login"}
            </button>

            {error ? (
              <p
                id="email-error"
                role="alert"
                className="-mt-2 text-sm font-medium leading-[1.4] text-[#ef4444]"
              >
                {error}
              </p>
            ) : null}
          </form>

          {/* "Or" divider */}
          <p
            className="w-full text-center font-body text-base font-normal leading-[1.4] text-ink-secondary"
            role="separator"
            aria-label="or"
          >
            Or
          </p>

          {/* Social sign-in buttons */}
          <div className="flex w-full flex-col items-start gap-4">
            <SocialButton
              icon={<GoogleIcon className="h-6 w-6" />}
              onClick={onGoogleSignIn}
              aria-label="Continue with Gmail"
            >
              Continue with Gmail
            </SocialButton>
            <SocialButton
              icon={<AppleIcon className="h-[22px] w-[22px] text-black" />}
              onClick={onAppleSignIn}
              aria-label="Continue with Apple ID"
            >
              Continue with Apple ID
            </SocialButton>
          </div>
        </div>
      </div>
    </section>
  );
}
