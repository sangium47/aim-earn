import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/metadata";
import AdminShell from "./shell";

export const metadata: Metadata = buildMetadata(
  "Aim Earn — Admin",
  "Manage approvals, affiliates, products, payouts, and platform settings for Aim Earn.",
);

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
