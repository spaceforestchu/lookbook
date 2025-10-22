'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Note: metadata can't be exported from client components
// Move metadata to a separate server component if needed

function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  return (
    <nav className="sticky top-0 z-40 border-b border-gray-300 bg-white">
      <div className="px-4 md:px-8 py-3 md:py-4 flex gap-2 md:gap-8 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1.5 md:gap-3 hover:opacity-80 transition-opacity flex-shrink-0 min-w-0"
        >
          <Image
            src="/pursuit-wordmark.png"
            alt="Pursuit Logo"
            width={70}
            height={18}
            className="md:w-[120px] md:h-[32px] flex-shrink-0"
            priority
          />
          <span className="font-bold text-base md:text-xl text-gray-900 whitespace-nowrap">Lookbook</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4">
          <Link
            href="/"
            className={`${
              pathname === '/' ? 'text-blue-700' : 'text-blue-600'
            } hover:text-blue-800 font-medium transition-colors`}
          >
            People
          </Link>
          <Link
            href="/projects"
            className={`${
              pathname === '/projects' ? 'text-purple-700' : 'text-purple-600'
            } hover:text-purple-800 font-medium transition-colors`}
          >
            Projects
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg ${
                pathname === '/' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-blue-600 hover:bg-blue-50'
              } transition-colors`}
            >
              People
            </Link>
            <Link
              href="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg ${
                pathname === '/projects' ? 'bg-purple-50 text-purple-700 font-medium' : 'text-purple-600 hover:bg-purple-50'
              } transition-colors`}
            >
              Projects
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>The Pursuit Lookbook - Talented Builders & Innovative Projects</title>
        <meta name="description" content="Discover talented software engineers, designers, and innovators from Pursuit's fellowship program. Browse portfolios, skills, and groundbreaking projects across AI, fintech, e-commerce, and more." />
        <meta name="keywords" content="Pursuit, software engineers, tech talent, portfolio, projects, fellowship, coding bootcamp, diverse talent, hire developers" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="The Pursuit Lookbook - Talented Builders & Innovative Projects" />
        <meta property="og:description" content="Discover talented software engineers, designers, and innovators from Pursuit's fellowship program. Browse portfolios and groundbreaking projects." />
        <meta property="og:site_name" content="Pursuit Lookbook" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Pursuit Lookbook - Talented Builders & Innovative Projects" />
        <meta name="twitter:description" content="Discover talented software engineers, designers, and innovators from Pursuit's fellowship program." />
        
        {/* Additional SEO */}
        <meta name="author" content="Pursuit" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://lookbook.pursuit.org" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Navigation />
        
        {/* Main content */}
        <main className="p-4 md:p-8">
          {children}
        </main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
