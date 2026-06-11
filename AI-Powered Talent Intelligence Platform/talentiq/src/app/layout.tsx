import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SkipToMain } from "@/components/layout/SkipToMain";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "TalentIQ — AI-Powered Talent Intelligence Platform",
  description:
    "Stop losing great candidates to outdated filters. TalentIQ scores every applicant with explainable AI — so your team makes faster, fairer decisions.",
  metadataBase: new URL("https://talentiq.ai"),
  openGraph: {
    title: "TalentIQ — AI-Powered Talent Intelligence Platform",
    description:
      "AI-powered recruiting platform that scores, ranks, and explains every candidate automatically.",
    images: ["/images/og-image.png"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <SkipToMain />
        {children}
      </body>
    </html>
  );
}
