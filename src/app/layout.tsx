import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { LanguageProvider } from "@/utils/i18n/LanguageContext";
import PresenceTracker from "@/components/PresenceTracker";

export const metadata: Metadata = {
  title: "Eternity AI - Preserve Memories Forever",
  description: "Connect with the digital embodiment of your loved ones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <PresenceTracker />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

