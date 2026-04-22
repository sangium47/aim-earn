import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata(
  "Aim Earn — Login",
  "Sign in to your Aim Earn account to access your distributor, affiliate, or admin dashboard.",
);

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
