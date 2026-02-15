import type { Metadata } from "next";
import Link from "next/link";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AnimatedBackground from "@/components/AnimatedBackground";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Forward Adjustable Rent Offers",
  description: "Demo: credit-informed rent offer bundles for landlords and tenants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakarta.variable}`}>
      <body className="antialiased min-h-screen text-slate-900 flex flex-col font-sans relative">
        <AnimatedBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
        <DisclaimerBanner />
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
          <nav className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold font-heading text-slate-800 hover:text-green-600 transition-colors">
              Forward
            </Link>
            <div className="flex items-center gap-6 sm:gap-8">
              <Link href="/how-it-works" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                How it works
              </Link>
              <Link href="/demo/match" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Find matches
              </Link>
              <Link href="/docs" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Documentation
              </Link>
              <Link href="/demo/listing" className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
                Start demo
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200/80 bg-white/60 backdrop-blur-sm py-6">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-sm text-slate-500">
            Forward · Adjustable rent offers · Demo only
          </div>
        </footer>
        </div>
      </body>
    </html>
  );
}

function DisclaimerBanner() {
  return (
    <div className="bg-amber-50/90 backdrop-blur-sm border-b border-amber-200/80 text-amber-800 text-sm px-4 py-2.5 text-center">
      <span className="font-medium">Demo only.</span> Not financial or legal advice. Credit data use requires consent and permissible purpose. Sandbox data only.
    </div>
  );
}
