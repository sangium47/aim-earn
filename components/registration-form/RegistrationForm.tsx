"use client";

import { useState, type FormEvent } from "react";
import { InputField } from "./InputField";
import { SocialButton } from "./SocialButton";
import { AppleIcon, FacebookIcon, GoogleIcon } from "./icons";

export type RegistrationValues = {
  email: string;
};

export type RegistrationFormProps = {
  /** Called with form values when the user submits the email form. */
  onSubmit?: (values: RegistrationValues) => void | Promise<void>;
  /** Called when the user clicks "Continue with Gmail". */
  onGoogleSignIn?: () => void;
  /** Called when the user clicks "Continue with Facebook". */
  onFacebookSignIn?: () => void;
  /** Called when the user clicks "Continue with Apple ID". */
  onAppleSignIn?: () => void;
  /** Disables the primary submit button and shows pending state. */
  isSubmitting?: boolean;
  /** Optional override for the outer wrapper. */
  className?: string;
};

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
  onFacebookSignIn,
  onAppleSignIn,
  isSubmitting = false,
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
              required
            />
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
              icon={<FacebookIcon className="h-6 w-6" />}
              onClick={onFacebookSignIn}
              aria-label="Continue with Facebook"
            >
              Continue with Facebook
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
