import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";

import "./globals.css";

export const metadata: Metadata = {
  title: "Cross-Asset Sentiment Trading Platform",
  description:
    "Retail-friendly systematic trading dashboard with validation-first controls.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-app antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
