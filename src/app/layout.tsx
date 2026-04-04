import type { Metadata } from "next";
import { Inter, Rajdhani, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-inter" });
const rajdhani = Rajdhani({ weight: ["600", "700"], subsets: ["latin"], variable: "--font-rajdhani" });
const jetbrainsMono = JetBrains_Mono({ weight: ["600"], subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Nisar Khan & Sons - Shop Management System",
  description: "Tiles Shop Management System",
};

import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${rajdhani.variable} ${jetbrainsMono.variable} font-sans antialiased text-text-primary bg-bg-base`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
