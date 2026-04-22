import type { Metadata } from "next";
import "@fontsource-variable/urbanist";
import "@fontsource-variable/nunito-sans";
import "./globals.css";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...buildMetadata("Aim Earn", "Aim Earn — Distributor & Affiliator Platform"),
  icons: { icon: "/images/logo-black.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-surface-page text-ink font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
