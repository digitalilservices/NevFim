import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050707",
};

export const metadata: Metadata = {
  title: {
    default: "NevFim.grup",
    template: "%s | NevFim.grup",
  },
  description:
    "NevFim — AI-конструктор мебели, каталог, личный кабинет и заказы.",
  applicationName: "NevFim.grup",
  icons: {
    icon: "/images/logo/logo.png",
    shortcut: "/images/logo/logo.png",
    apple: "/images/logo/logo.png",
  },
  openGraph: {
    title: "NevFim.grup",
    description: "AI-конструктор и каталог мебели NevFim.",
    siteName: "NevFim.grup",
    type: "website",
    images: ["/images/logo/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
