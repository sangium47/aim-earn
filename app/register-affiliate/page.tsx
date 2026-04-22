"use client";

import { Suspense, useState } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { InputField } from "@/components/registration-form/InputField";
import { SelectCountryForm } from "@/components/select-country-form";
import { useRedirectIfAuthed } from "@/lib/use-session-guard";

type RegisterState = "form" | "country";

function RegisterAffiliateContent() {
  const router = useRouter();
  const ready = useRedirectIfAuthed();
  const searchParams = useSearchParams();
  const cancelHref = searchParams.get("page");
  const [registerState, setRegisterState] = useState<RegisterState>("form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const handleCancel = () => {
    if (cancelHref) {
      router.push(cancelHref);
    }
  };

  if (!ready) return null;

  if (registerState === "country") {
    return (
      <main className="flex flex-col gap-4 md:gap-6 p-4 md:p-6 lg:p-8 bg-white min-h-screen items-center justify-center">
        <SelectCountryForm
          defaultValue={[]}
          maxSelection={1}
          onSubmit={() => {
            redirect(
              `/confirmation?email=${encodeURIComponent(email || "admin@aimearn.com")}`,
            );
          }}
        />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <section
        className="w-full max-w-[1024px]"
        aria-labelledby="register-affiliate-heading"
      >
        <div className="flex flex-col items-center justify-center gap-8 px-6 pb-24 pt-8">
          <header className="flex w-full flex-col items-center justify-center gap-2 text-center">
            <h2
              id="register-affiliate-heading"
              className="text-2xl font-medium leading-[1.2] tracking-figma text-ink-heading"
            >
              Register as an Affiliate
            </h2>
            <p className="text-base font-medium leading-[1.4] tracking-figma text-ink-secondary">
              Enter your details below to register
            </p>
          </header>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              setRegisterState("country");
            }}
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
            <InputField
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="flex w-full items-start gap-4">
              {cancelHref ? (
                <button
                  type="button"
                  onClick={handleCancel}
                  className={[
                    "flex w-[100px] min-w-[100px] items-center justify-center gap-2 rounded-lg border border-line p-3",
                    "text-[15px] font-medium leading-none tracking-figma text-ink",
                    "transition-colors hover:bg-surface-input",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
                  ].join(" ")}
                >
                  Cancel
                </button>
              ) : null}
              <button
                type="submit"
                className={[
                  "flex flex-1 min-w-[100px] items-center justify-center gap-2 rounded-lg bg-brand p-3",
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
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default function RegisterAffiliatePage() {
  return (
    <Suspense fallback={null}>
      <RegisterAffiliateContent />
    </Suspense>
  );
}
