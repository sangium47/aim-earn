import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata(
  "Aim Earn — Check Your Email",
  "We've sent a confirmation email to complete your Aim Earn registration.",
);

export default function ConfirmationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
