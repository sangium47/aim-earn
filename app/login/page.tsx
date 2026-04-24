"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegistrationForm } from "@/components/registration-form";
import { OtpForm } from "@/components/otp-form";
import type { RegistrationValues } from "@/components/type";
import { USERS } from "@/components/mock";
import {
  landingPathForUser,
  resolveUser,
  setSession,
} from "@/lib/session";
import { useRedirectIfAuthed } from "@/lib/use-session-guard";

type LoginState = "login" | "otp";

function findUserByEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  return USERS.find((u) => u.email.toLowerCase() === normalized);
}

/**
 * Login page that transitions to dashboard after successful authentication.
 */
export default function LoginPage() {
  const router = useRouter();
  const ready = useRedirectIfAuthed();
  const [loginState, setLoginState] = useState<LoginState>("login");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmit = async (values: RegistrationValues) => {
    setError(undefined);

    if (!findUserByEmail(values.email)) {
      setError("We couldn't find an account with that email.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEmail(values.email);
      setLoginState("otp");
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    console.log(`${provider} sign-in`);
    setError(undefined);
    setEmail("distributor@example.com");
    setLoginState("otp");
  };

  const handleOtpSubmit = () => {
    // Mock flow: any 6-digit code is accepted. Resolve the user by email,
    // write a session, and land on the role-appropriate dashboard. PENDING
    // distributors are routed to /distributor/pending-approval instead.
    const user = resolveUser(email);
    setSession(user);
    router.push(landingPathForUser(user));
  };

  if (!ready) return null;

  if (loginState === "otp") {
    return (
      <OtpForm
        onBack={() => setLoginState("login")}
        autoSubmit
        onSubmit={handleOtpSubmit}
      />
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-card p-6">
      <div className="w-full max-w-[1024px]">
        <RegistrationForm
          onSubmit={handleSubmit}
          onGoogleSignIn={() => handleSocialSignIn("Google")}
          onAppleSignIn={() => handleSocialSignIn("Apple")}
          isSubmitting={isSubmitting}
          error={error}
        />
      </div>
    </main>
  );
}
