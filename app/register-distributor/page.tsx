"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { InputField } from "@/components/registration-form/InputField";
import { OtpForm } from "@/components/otp-form";
import { SelectCountryForm } from "@/components/select-country-form";
import { USERS } from "@/components/mock";
import { setSession } from "@/lib/session";
import type { User } from "@/components/type";

type RegisterState = "form" | "otp" | "country" | "creating";

function RegisterDistributorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cancelHref = searchParams.get("page");
  const [registerState, setRegisterState] = useState<RegisterState>("form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [otpError, setOtpError] = useState<string | undefined>(undefined);
  const [signUpSubmitting, setSignUpSubmitting] = useState(false);
  const [otpSubmitting, setOtpSubmitting] = useState(false);

  const handleCancel = () => {
    if (cancelHref) {
      router.push(cancelHref);
    }
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailError(undefined);

    const normalized = email.trim().toLowerCase();
    if (USERS.some((u) => u.email.toLowerCase() === normalized)) {
      setEmailError("An account with this email already exists.");
      return;
    }

    setSignUpSubmitting(true);
    try {
      // Mock Amplify signUp (custom:role = DISTRIBUTOR) + SendGrid OTP email.
      await new Promise((resolve) => setTimeout(resolve, 800));
      setRegisterState("otp");
    } finally {
      setSignUpSubmitting(false);
    }
  };

  const handleOtpSubmit = async (code: string) => {
    setOtpError(undefined);
    setOtpSubmitting(true);
    try {
      // Mock confirmSignUp. Any 6-digit code is accepted except "000000",
      // which stands in for a rejected OTP for demo/testing.
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (code === "000000") {
        setOtpError("Invalid OTP. Please try again.");
        return;
      }
      setRegisterState("country");
    } finally {
      setOtpSubmitting(false);
    }
  };

  const handleCountrySubmit = async (countries: string[]) => {
    setRegisterState("creating");
    // Mock createUser Lambda: creates User + Distributor (PENDING), sets
    // distributorId, adds user to DISTRIBUTOR Cognito group, then auto
    // sign-in by writing the session and redirecting.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const user: User = {
      profileImageURL: "https://i.pravatar.cc/128?img=12",
      email: email.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      countries,
      role: "distributor",
    };
    setSession(user);
    router.push("/distributor/pending-approval");
  };

  if (registerState === "creating") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white p-6">
        <div
          className="flex flex-col items-center gap-4"
          role="status"
          aria-live="polite"
        >
          <div
            className="size-10 animate-spin rounded-full border-2 border-line border-t-brand"
            aria-hidden="true"
          />
          <p className="text-base font-medium leading-[1.4] tracking-figma text-ink-secondary">
            Creating your distributor account…
          </p>
        </div>
      </main>
    );
  }

  if (registerState === "country") {
    return (
      <main className="flex flex-col gap-4 md:gap-6 p-4 md:p-6 lg:p-8 bg-white min-h-screen items-center justify-center">
        <SelectCountryForm defaultValue={[]} onSubmit={handleCountrySubmit} />
      </main>
    );
  }

  if (registerState === "otp") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface-card p-6">
        <div className="w-full max-w-[1024px]">
          <OtpForm
            onBack={() => {
              setOtpError(undefined);
              setRegisterState("form");
            }}
            isSubmitting={otpSubmitting}
            autoSubmit
            onSubmit={handleOtpSubmit}
          />
          {otpError ? (
            <p
              role="alert"
              className="mx-auto mt-2 max-w-[354px] text-center text-sm font-medium leading-[1.4] tracking-figma text-red-500"
            >
              {otpError}
            </p>
          ) : null}
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <section
        className="w-full max-w-[1024px]"
        aria-labelledby="register-distributor-heading"
      >
        <div className="flex flex-col items-center justify-center gap-8 px-6 pb-24 pt-8">
          <header className="flex w-full flex-col items-center justify-center gap-2 text-center">
            <h2
              id="register-distributor-heading"
              className="text-2xl font-medium leading-[1.2] tracking-figma text-ink-heading"
            >
              Register as a distributor
            </h2>
            <p className="text-base font-medium leading-[1.4] tracking-figma text-ink-secondary">
              Enter your details below to register
            </p>
          </header>

          <form
            onSubmit={handleFormSubmit}
            className="flex w-full max-w-[354px] flex-col items-start gap-6"
            noValidate
          >
            <InputField
              label="First Name"
              name="firstName"
              autoComplete="given-name"
              placeholder="Alex"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <InputField
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              placeholder="Johnson"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <div className="flex w-full flex-col gap-2">
              <InputField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(undefined);
                }}
                aria-invalid={emailError ? true : undefined}
                aria-describedby={emailError ? "email-error" : undefined}
                required
              />
              {emailError ? (
                <p
                  id="email-error"
                  className="text-sm font-medium leading-[1.4] tracking-figma text-red-500"
                >
                  {emailError}
                </p>
              ) : null}
            </div>

            <div className="flex w-full items-start gap-4">
              {cancelHref ? (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={signUpSubmitting}
                  className={[
                    "flex w-[100px] min-w-[100px] items-center justify-center gap-2 rounded-lg border border-line p-3",
                    "text-[15px] font-medium leading-none tracking-figma text-ink",
                    "transition-colors hover:bg-surface-input",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                  ].join(" ")}
                >
                  Cancel
                </button>
              ) : null}
              <button
                type="submit"
                disabled={signUpSubmitting}
                className={[
                  "flex flex-1 min-w-[100px] items-center justify-center gap-2 rounded-lg bg-brand p-3",
                  "text-[15px] font-medium leading-none tracking-figma text-brand-foreground",
                  "transition-opacity hover:opacity-90",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-border focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                ].join(" ")}
              >
                {signUpSubmitting ? (
                  "Sending OTP…"
                ) : (
                  <>
                    Continue
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="M3.33 8h9.34M8.67 4l4 4-4 4" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default function RegisterDistributorPage() {
  return (
    <Suspense fallback={null}>
      <RegisterDistributorContent />
    </Suspense>
  );
}
