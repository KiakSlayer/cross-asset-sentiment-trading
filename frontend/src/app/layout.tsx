import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";

import "./globals.css";

export const metadata: Metadata = {
  title: "Cross-Asset Event-Driven Sector Trading Platform",
  description:
    "Retail-friendly investing assistant for strategy testing, opportunities, portfolio tracking, and paper bot control.",
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
