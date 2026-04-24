"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ConfirmationScreen } from "@/components/confirmation-screen";
import { maskEmail } from "@/lib/mask-email";
import { clearSession } from "@/lib/session";

/**
 * Demo page for ConfirmationScreen.
 *
 * Reads the recipient address from a `?email=` query param — in a real app
 * this would come from the authenticated session or a server-rendered value.
 * Falls back to `alex@gmail.com` so the page is demoable in isolation.
 */
function DistributorPendingApprovalPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "alex@gmail.com";
  const masked = maskEmail(email);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

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
      action={
        <div className="flex flex-col items-center justify-center gap-4">
          <Link
            href="/payment-detail"
            className="text-sm font-medium text-ink-secondary text-center underline-offset-4 hover:text-ink"
          >
            <span className="underline">Go to payment detail</span>
            <br />
            <span className="text-red-300 text-xs">
              (For testing UI, not production)
            </span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className={[
              "flex w-full min-w-[100px] items-center justify-center gap-2 rounded-lg border border-line bg-surface-card p-3",
              "text-[15px] font-medium leading-none tracking-figma text-ink",
              "transition-colors hover:bg-surface-input",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
            ].join(" ")}
          >
            Logout
          </button>
        </div>
      }
    />
  );
}

export default function ConfirmationDemoPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-card p-6">
      <div className="w-full max-w-[1024px] overflow-hidden bg-surface-card">
        <Suspense fallback={null}>
          <DistributorPendingApprovalPage />
        </Suspense>
      </div>
    </main>
  );
}
