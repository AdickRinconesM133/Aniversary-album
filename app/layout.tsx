import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AudioPlayer from "@/components/AudioPlayer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aniversary Album",
  description: "Aniversary Album for Liana and Adick",
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
        <AudioPlayer />
        {children}
      </body>
    </html>
  );
}
