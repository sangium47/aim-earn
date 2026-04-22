import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/metadata";
import AffiliateShell from "./shell";

export const metadata: Metadata = buildMetadata(
  "Aim Earn — Affiliate",
  "Track your affiliate sales, orders, customers, and payouts on Aim Earn.",
);

export default function AffiliateLayout({ children }: { children: ReactNode }) {
  return <AffiliateShell>{children}</AffiliateShell>;
}
