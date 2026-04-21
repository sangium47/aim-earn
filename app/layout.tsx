import type { Metadata } from "next";
import "@fontsource-variable/urbanist";
import "@fontsource-variable/nunito-sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aim Earn",
  description: "Aim Earn — Distributor & Affiliator Platform",
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
