import { ReactNode } from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import Script from "next/script";
import { UserDataProvider } from "@/contexts/UserDataContext";

import "./globals.css";

const GADSENSE_CLIENT_ID = "ca-pub-6542623777003381";

const poppins = localFont({
  src: "./fonts/Poppins.woff2",
  variable: "--font-poppins",
  weight: "400",
  preload: false,
});
const raleway = localFont({
  src: "./fonts/Raleway.woff2",
  variable: "--font-raleway",
  weight: "100 900",
});

const opensans = localFont({
  src: "./fonts/Open Sans.woff2",
  variable: "--font-open-sans",
  weight: "100 800",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://sajidmahamud.vercel.app"),
  title: {
    template: "%s | EasyCom - Capstone E-Commerce Project",
    default: "EasyCom - Capstone E-Commerce Project",
  },
  description:
    "EasyCom is a capstone e-commerce project (not production-grade). Some features are under development.",
  keywords: [
    "online shopping",
    "e-commerce",
    "buy online",
    "shop online",
    "electronics",
    "fashion",
    "home goods",
    "deals",
    "discounts",
    "EasyCom",
  ],
  authors: [{ name: "EasyCom" }],
  creator: "EasyCom",
  publisher: "EasyCom",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://sajidmahamud.vercel.app",
    siteName: "EasyCom",
    title: "EasyCom - Capstone E-Commerce Project",
    description:
      "EasyCom is a capstone e-commerce project (not production-grade). Some features are under development.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EasyCom - Capstone Project",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EasyCom - Capstone E-Commerce Project",
    description:
      "EasyCom is a capstone e-commerce project (not production-grade).",
    images: ["/og-image.jpg"],
    creator: "@easycom",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    // Add other verification codes as needed
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || "https://sajidmahamud.vercel.app",
  },
  other: {
    "google-adsense-account": GADSENSE_CLIENT_ID,
  },
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${poppins.variable} ${raleway.variable} ${opensans.variable} antialiased`}
        >
          <UserDataProvider>{children}</UserDataProvider>

          <Toaster
            position="bottom-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                background: "#ffffff",
                color: "#1f2937",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
              },
              className: "sonner-toast",
            }}
          />

          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GADSENSE_CLIENT_ID}`}
            strategy="beforeInteractive"
          />
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
