import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata(
  "Aim Earn — Register as Distributor",
  "Become an Aim Earn distributor and build your own affiliate network across new countries.",
);

export default function RegisterDistributorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
