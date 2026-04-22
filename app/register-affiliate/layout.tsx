import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata(
  "Aim Earn — Register as Affiliate",
  "Join Aim Earn as an affiliate and start earning commissions from distributor products.",
);

export default function RegisterAffiliateLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
