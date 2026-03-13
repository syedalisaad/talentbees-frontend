import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import { AuthProvider } from "../lib/context/AuthContext";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | TalentBees',
    default: 'TalentBees - Global Job Portal | Jobs in UAE, UK, & Pakistan', 
  },
  description: 'Connect with top employers and find high-paying job opportunities in the USA, UK, Pakistan, and UAE. Your gateway to a global career.',
  
  verification: {
    other: {
      "google-adsense-account": "ca-pub-8729012662530579",
    },
  },

  openGraph: {
    title: 'TalentBees - Global Job Portal',
    description: 'Find your next career move in the UAE, UK, and beyond.',
    url: 'https://talentbees.com', 
    siteName: 'TalentBees',
    images: [
      {
        url: '/og-image.jpg', 
        width: 1200,
        height: 630,
        alt: 'TalentBees Job Portal',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'TalentBees - Global Job Portal',
    description: 'Find jobs in USA, UK, Pakistan, and UAE.',
    images: ['/og-image.jpg'], 
  },
};
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta", // This creates a CSS variable
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
       
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8729012662530579"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${jakarta.variable} font-sans`}>
         <AuthProvider>
        <Toaster position="top-right" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-H3QBTJ0VVE"
          strategy="afterInteractive"
        />

        {/* 2. Initialize the dataLayer */}
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-H3QBTJ0VVE');
          `}
        </Script>
        {children}</AuthProvider>
      </body>
    </html>
  );
}
