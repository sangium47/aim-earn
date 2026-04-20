"use client";

import { redirect } from "next/navigation";

/**
 * Demo page for the RegistrationForm component.
 *
 * In a real app this component would be dropped into wherever you need
 * distributor sign-up — a modal, a marketing landing page, an auth route.
 */
export default function DemoPage() {
  redirect("/login");
}
