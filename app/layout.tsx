import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Italianno } from "next/font/google";
import { UIProvider } from "@/context/UIContext";
import AudioPlayer from "@/components/AudioPlayer";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const italianno = Italianno({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-romantic",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nuestro Álbum de Aniversario",
  description: "Álbum de aniversario de Liana y Adick — nuestros mejores momentos juntos.",
  openGraph: {
    title: "Nuestro Álbum de Aniversario",
    description: "Álbum de aniversario de Liana y Adick — nuestros mejores momentos juntos.",
    type: "website",
    locale: "es_AR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <UIProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${italianno.variable} antialiased`}
        >
          <SmoothScroll>
            <AudioPlayer />
            {children}
          </SmoothScroll>
        </body>
      </UIProvider>
    </html>
  );
}
