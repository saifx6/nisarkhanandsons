import type { Metadata } from "next";
import { Inter, Rajdhani, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-inter" });
const rajdhani = Rajdhani({ weight: ["600", "700"], subsets: ["latin"], variable: "--font-rajdhani" });
const jetbrainsMono = JetBrains_Mono({ weight: ["600"], subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Nisar Khan & Sons - Shop Management System",
  description: "Tiles Shop Management System",
  manifest: "/manifest.json",
};

import { Toaster } from "@/components/ui/toaster";
import PwaRegister from "@/components/PwaRegister";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#39FF14" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="NKS" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="NKS" />
      </head>
      <body className={`${inter.variable} ${rajdhani.variable} ${jetbrainsMono.variable} font-sans antialiased text-text-primary bg-bg-base`}>
        <PwaRegister />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
