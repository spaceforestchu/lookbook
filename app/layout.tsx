import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
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
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/pursuit-wordmark.png"
              alt="Pursuit Logo"
              width={120}
              height={32}
              priority
            />
            <span className="font-bold text-xl text-gray-900">Lookbook</span>
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
