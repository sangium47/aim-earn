import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/metadata";
import DistributorShell from "./shell";

export const metadata: Metadata = buildMetadata(
  "Aim Earn — Distributor",
  "Manage your affiliate roster, products, orders, and commissions on Aim Earn.",
);

export default function DistributorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DistributorShell>{children}</DistributorShell>;
}
