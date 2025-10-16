import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lookbook",
  description: "A simple lookbook for people and projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Navigation bar */}
        <nav className="border-b border-gray-300 px-8 py-4 flex gap-8 items-center bg-white">
          <Link
            href="/"
            className="font-bold text-xl text-gray-900 hover:text-gray-700 transition-colors"
          >
            Lookbook
          </Link>
          <div className="flex gap-4">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              People
            </Link>
            <Link
              href="/projects"
              className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              Projects
            </Link>
          </div>
        </nav>

        {/* Main content */}
        <main className="p-8">
          {children}
        </main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
