import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Shift & Overtime Wage Auditor (2026 Edition) • FLSA & Working Time Reconciliation",
  description:
    "Institutional client-side wage calculator and audit protocol. Reconcile regular hours, 1.5x overtime, night shift differentials, weekend premiums, and accrued PTO settlements with instant PDF dispute reports.",
  keywords: [
    "overtime calculator",
    "shift pay auditor",
    "FLSA overtime 1.5x",
    "night shift differential",
    "weekend pay bonus",
    "wage discrepancy detector",
    "unpaid overtime dispute letter",
    "PTO vacation settlement",
    "labor compliance 2026",
  ],
  authors: [{ name: "National Wage Accreditation & Labor Compliance Archive" }],
  other: {
    "google-adsense-account": "ca-pub-1165320002460420",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1165320002460420"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
