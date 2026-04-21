"use client";

import { useState } from "react";
import {
  RegistrationForm,
  type RegistrationValues,
} from "@/components/registration-form";
import { SelectCountryForm } from "@/components/select-country-form";
import { OtpForm } from "@/components/otp-form";
import { ConfirmationScreen } from "@/components/confirmation-screen";
import { redirect } from "next/navigation";

type LoginState = "login" | "otp" | "country" | "confirm";

type User = {
  email: string;
};

/**
 * Login page that transitions to dashboard after successful authentication.
 */
export default function LoginPage() {
  const [loginState, setLoginState] = useState<LoginState>("login");
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: RegistrationValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // On successful login, set user data and transition to dashboard
      setUser({
        email: values.email,
      });
      setLoginState("otp");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    console.log(`${provider} sign-in`);
    // Simulate successful social login
    setUser({
      email: "john.doe@example.com",
    });
    setLoginState("otp");
  };

  const handleLogout = () => {
    setUser(null);
    setLoginState("login");
  };

  if (loginState === "otp") {
    return (
      <OtpForm
        onBack={() => setLoginState("login")}
        autoSubmit
        onSubmit={() => {
          setLoginState("country");
        }}
      />
    );
  }

  if (loginState === "country") {
    return (
      <main className="flex flex-col gap-4 md:gap-6 p-4 md:p-6 lg:p-8 bg-white min-h-screen items-center justify-center">
        <SelectCountryForm
          defaultValue={[]}
          onSubmit={() => {
            redirect(
              `/confirmation?email=${encodeURIComponent(user?.email || "admin@aimearn.com")}`,
            );
          }}
        />
      </main>
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
        />
      </div>
    </main>
  );
}
