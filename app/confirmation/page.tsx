"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ConfirmationScreen } from "@/components/confirmation-screen";
import { maskEmail } from "@/lib/mask-email";

/**
 * Demo page for ConfirmationScreen.
 *
 * Reads the recipient address from a `?email=` query param — in a real app
 * this would come from the authenticated session or a server-rendered value.
 * Falls back to `alex@gmail.com` so the page is demoable in isolation.
 */
function ConfirmationContent() {
  const params = useSearchParams();
  const email = params.get("email") ?? "alex@gmail.com";
  const masked = maskEmail(email);

  return (
    <ConfirmationScreen
      title="Confirmation Email Sent"
      description={
        <>
          A confirmation email has been successfully sent to {masked}.
          <br />
          Please follow the instructions in the email to proceed.
        </>
      }
    />
  );
}

export default function ConfirmationDemoPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-card p-6">
      <div className="w-full max-w-[1024px] overflow-hidden bg-surface-card">
        <Suspense fallback={null}>
          <ConfirmationContent />
        </Suspense>
      </div>
    </main>
  );
}
