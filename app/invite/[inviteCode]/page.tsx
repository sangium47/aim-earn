"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { InputField } from "@/components/registration-form/InputField";
import { SocialButton } from "@/components/registration-form/SocialButton";
import { OtpForm } from "@/components/otp-form";
import { SelectCountryForm } from "@/components/select-country-form";
import { AppleIcon, GoogleIcon } from "@/components/icons";
import { USERS } from "@/components/mock";
import { setSession } from "@/lib/session";
import type { User } from "@/components/type";

type DistributorStatus = "APPROVED" | "PENDING" | "REJECTED";

type Invite = {
  inviterFirstName: string;
  inviterLastName: string;
  inviterEmail: string;
  /** Root distributor status — only APPROVED invites may onboard affiliates. */
  distributorStatus: DistributorStatus;
};

// Mock invite lookup. Real implementation: fetch user by inviteCode, then
// resolve root distributor via distributorId and read Distributor.status.
const INVITES: Record<string, Invite> = {
  "DANA-2024": {
    inviterFirstName: "Dana",
    inviterLastName: "Wong",
    inviterEmail: "distributor@example.com",
    distributorStatus: "APPROVED",
  },
  "MARCUS-2024": {
    inviterFirstName: "Marcus",
    inviterLastName: "Lim",
    inviterEmail: "marcus@example.com",
    distributorStatus: "APPROVED",
  },
  "PENDING-01": {
    inviterFirstName: "Kim",
    inviterLastName: "Park",
    inviterEmail: "kim@example.com",
    distributorStatus: "PENDING",
  },
};

type FlowState =
  | "form"
  | "email-country"
  | "otp"
  | "social-country"
  | "creating";

type SocialProvider = "google" | "apple";

export default function InvitePage() {
  const router = useRouter();
  const params = useParams<{ inviteCode: string }>();
  const inviteCode = params?.inviteCode ?? "";
  const invite = useMemo<Invite | undefined>(
    () => INVITES[inviteCode],
    [inviteCode],
  );

  const [flow, setFlow] = useState<FlowState>("form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState<string>("");
  const [socialProvider, setSocialProvider] = useState<SocialProvider | null>(
    null,
  );
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [otpError, setOtpError] = useState<string | undefined>(undefined);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [otpSubmitting, setOtpSubmitting] = useState(false);

  // --- Invalid or unapproved invite ----------------------------------------
  if (!invite || invite.distributorStatus !== "APPROVED") {
    const title = !invite
      ? "Invite link not found"
      : "Invite link unavailable";
    const description = !invite
      ? "This invite link is invalid or has expired. Please ask your inviter for a new one."
      : "The distributor who sent this invite is not yet approved. Please check back once their account is active.";

    return (
      <main className="flex min-h-screen items-center justify-center bg-surface-card p-6">
        <section
          className="w-full max-w-[480px] text-center"
          aria-labelledby="invite-error-heading"
        >
          <div className="flex flex-col items-center gap-4">
            <div
              aria-hidden="true"
              className="flex size-[88px] items-center justify-center rounded-full bg-[#fdecec] text-[#ef4444]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-10"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
            </div>
            <h1
              id="invite-error-heading"
              className="text-2xl font-medium leading-[1.2] tracking-figma text-ink-heading"
            >
              {title}
            </h1>
            <p className="text-base font-medium leading-[1.4] tracking-figma text-ink-secondary">
              {description}
            </p>
            <Link
              href="/login"
              className="mt-2 text-sm font-medium underline text-ink hover:text-ink-secondary"
            >
              Back to login
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // --- Shared: finalize registration ---------------------------------------
  const completeRegistration = async (selectedCountry: string) => {
    // Mock createUser Lambda: creates affiliate User, inherits distributorId
    // from inviter, increments depth, adds to AFFILIATE Cognito group, then
    // auto sign-in.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const user: User = {
      profileImageURL: "https://i.pravatar.cc/128?img=32",
      email: email.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      countries: [selectedCountry],
      role: "affiliate",
    };
    setSession(user);
    router.push("/affiliate");
  };

  // --- Option A: Email OTP --------------------------------------------------
  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailError(undefined);

    const normalized = email.trim().toLowerCase();
    if (USERS.some((u) => u.email.toLowerCase() === normalized)) {
      setEmailError("An account with this email already exists.");
      return;
    }
    setFlow("email-country");
  };

  const handleEmailCountrySubmit = async (codes: string[]) => {
    const picked = codes[0] ?? "";
    if (!picked) return;
    setCountry(picked);
    setFormSubmitting(true);
    try {
      // Mock Amplify signUp + SendGrid OTP email.
      await new Promise((resolve) => setTimeout(resolve, 800));
      setFlow("otp");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOtpSubmit = async (code: string) => {
    setOtpError(undefined);
    setOtpSubmitting(true);
    try {
      // Mock confirmSignUp. "000000" = rejected, everything else = accepted.
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (code === "000000") {
        setOtpError("Invalid OTP. Please try again.");
        return;
      }
      setFlow("creating");
      await completeRegistration(country);
    } finally {
      setOtpSubmitting(false);
    }
  };

  // --- Option B: Social sign-in --------------------------------------------
  const handleSocialClick = (provider: SocialProvider) => {
    setSocialProvider(provider);
    setFlow("social-country");
  };

  const handleSocialCountrySubmit = async (codes: string[]) => {
    const picked = codes[0] ?? "";
    if (!picked) return;
    setCountry(picked);
    setFlow("creating");
    // Mock signInWithRedirect → OAuth callback. Real flow would round-trip
    // through the provider and return to a callback route. We pre-fill a
    // synthetic email if the user hasn't typed one.
    if (!email) {
      const suffix = socialProvider === "apple" ? "icloud.com" : "gmail.com";
      setEmail(`invitee@${suffix}`);
    }
    if (!firstName) setFirstName("Alex");
    if (!lastName) setLastName("Nguyen");
    await completeRegistration(picked);
  };

  // --- Render per-state -----------------------------------------------------
  if (flow === "creating") {
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
            Creating your affiliate account…
          </p>
        </div>
      </main>
    );
  }

  if (flow === "otp") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface-card p-6">
        <div className="w-full max-w-[1024px]">
          <OtpForm
            onBack={() => {
              setOtpError(undefined);
              setFlow("email-country");
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

  if (flow === "email-country" || flow === "social-country") {
    const onSubmit =
      flow === "email-country"
        ? handleEmailCountrySubmit
        : handleSocialCountrySubmit;
    return (
      <main className="flex flex-col gap-4 md:gap-6 p-4 md:p-6 lg:p-8 bg-white min-h-screen items-center justify-center">
        <SelectCountryForm
          defaultValue={country ? [country] : []}
          maxSelection={1}
          isSubmitting={formSubmitting}
          onSubmit={onSubmit}
        />
      </main>
    );
  }

  // flow === "form"
  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <section
        className="w-full max-w-[1024px]"
        aria-labelledby="invite-heading"
      >
        <div className="flex flex-col items-center justify-center gap-8 px-6 pb-24 pt-8">
          <header className="flex w-full flex-col items-center justify-center gap-2 text-center">
            <h2
              id="invite-heading"
              className="text-2xl font-medium leading-[1.2] tracking-figma text-ink-heading"
            >
              You&apos;re invited to join Aim Earn
            </h2>
            <p className="text-base font-medium leading-[1.4] tracking-figma text-ink-secondary">
              {invite.inviterFirstName} {invite.inviterLastName} invited you to
              register as an affiliate.
            </p>
          </header>

          <div className="flex w-full max-w-[354px] flex-col items-start gap-4">
            <form
              onSubmit={handleFormSubmit}
              className="flex w-full flex-col items-start gap-6"
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

              <button
                type="submit"
                className={[
                  "flex w-full min-w-[100px] items-center justify-center gap-2 rounded-lg bg-brand p-3",
                  "text-[15px] font-medium leading-none tracking-figma text-brand-foreground",
                  "transition-opacity hover:opacity-90",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-border focus-visible:ring-offset-2",
                ].join(" ")}
              >
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
              </button>
            </form>

            <p
              className="w-full text-center font-body text-base font-normal leading-[1.4] text-ink-secondary"
              role="separator"
              aria-label="or"
            >
              Or
            </p>

            <div className="flex w-full flex-col items-start gap-4">
              <SocialButton
                icon={<GoogleIcon className="h-6 w-6" />}
                onClick={() => handleSocialClick("google")}
                aria-label="Continue with Gmail"
              >
                Continue with Gmail
              </SocialButton>
              <SocialButton
                icon={<AppleIcon className="h-[22px] w-[22px] text-black" />}
                onClick={() => handleSocialClick("apple")}
                aria-label="Continue with Apple ID"
              >
                Continue with Apple ID
              </SocialButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
