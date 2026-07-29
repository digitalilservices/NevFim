import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteMotion } from "@/components/Site/SiteMotion";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: "NevFim.grup",
    template: "%s | NevFim.grup",
  },
  description:
    "Каталог мебели NevFim и интерактивный 2D/3D-конструктор.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        {children}

        <Suspense fallback={null}>
          <SiteMotion />
        </Suspense>
      </body>
    </html>
  );
}
