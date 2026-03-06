import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import environment validation (will run on server startup)
import '@/lib/env-validation'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Legal Excellence - Premier Law Firm in India",
  description: "50+ years of combined legal expertise. Trusted by clients across India for civil, criminal, family, and corporate law. Schedule your consultation today.",
  keywords: "law firm, legal services, advocate, lawyer, India, civil law, criminal law, family law, corporate law, legal consultation",
  authors: [{ name: "Legal Excellence Team" }],
  creator: "Legal Excellence",
  publisher: "Legal Excellence",
  formatDetection: { email: false, address: false, telephone: false },
  metadataBase: new URL('https://legalexcellence.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://legalexcellence.com',
    title: 'Legal Excellence - Premier Law Firm in India',
    description: '50+ years of combined legal expertise. Trusted by clients across India for civil, criminal, family, and corporate law.',
    siteName: 'Legal Excellence',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Legal Excellence - Premier Law Firm',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Legal Excellence - Premier Law Firm',
    description: '50+ years of combined legal expertise. Trusted by clients across India.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
