"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, landingPathForRole } from "@/lib/session";

/**
 * Root redirect: send signed-in users to their role landing page, otherwise
 * route to /login. Session state lives in localStorage, so this runs on the
 * client.
 */
export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session) {
      router.replace(landingPathForRole(session.role));
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
}
