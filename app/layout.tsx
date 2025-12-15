import type { Metadata } from "next";
import "./globals.css";
import React from "react";


export const metadata: Metadata = {
  title: {
    default: "Journal - Developer Daily Log",
    template: "%s | Journal",
  },
  description: "A focused daily journal for software developers to track progress, debug timeline, and document learning.",
  keywords: ["Developer", "Journal", "Coding", "Productivity", "DevLog", "Engineering"],
  authors: [{ name: "Shubham Gupta" }], 
  creator: "Shubham Gupta",
  
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    title: "Journal - Developer Daily Log",
    description: "Track your coding journey, debugs, and daily wins.",
    siteName: "Journal",
    images: [
      {
        url: "/og-image.png", 
        width: 1200,
        height: 630,
        alt: "Journal App Preview",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Journal - Developer Daily Log",
    description: "Track your coding journey, debugs, and daily wins.",
    creator: "@yourhandle",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
