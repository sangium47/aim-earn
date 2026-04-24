"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/components/type";
import { getSession, landingPathForUser } from "./session";

/**
 * Guard a role-scoped page. Redirects unauthenticated users to /login and
 * authenticated users with a mismatched role — or a PENDING distributor —
 * to their own landing page. Returns true once the current session is
 * confirmed to match `required` and (for distributors) APPROVED.
 */
export function useRoleGuard(required: UserRole): boolean {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.role !== required) {
      router.replace(landingPathForUser(session));
      return;
    }
    if (
      session.role === "distributor" &&
      session.status &&
      session.status !== "APPROVED"
    ) {
      router.replace(landingPathForUser(session));
      return;
    }
    setAllowed(true);
  }, [required, router]);

  return allowed;
}

/**
 * Guard a public auth page (login, register-affiliate). Redirects already
 * signed-in users back to their role landing page. Returns true once the
 * absence of a session is confirmed.
 */
export function useRedirectIfAuthed(): boolean {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session) {
      router.replace(landingPathForUser(session));
      return;
    }
    setReady(true);
  }, [router]);

  return ready;
}
