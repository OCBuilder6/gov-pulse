import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GovPulse — AI DAO Governance Intelligence",
  description: "AI-powered summaries of real DAO proposals. Understand what you're voting on in seconds, not hours.",
  openGraph: {
    title: "GovPulse — AI DAO Governance Intelligence",
    description: "Never miss a DAO vote again. Live proposals + AI summaries from Uniswap, Aave, Compound and hundreds more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
