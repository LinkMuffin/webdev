// src/app/layout.tsx
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

import ThemeProvider from "@/components/ThemeProvider";
import I18nProvider from "@/components/I18nProvider";

export const metadata: Metadata = {
  title: "Landwetter",
  description: "Wetter-Dashboard für Landwirtschaft",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
   <html lang="de" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
       <ThemeProvider>
        <I18nProvider>
          <main id="content">{children}</main>

          <footer className="mt-12 p-6 border-t text-sm">
            <nav aria-label="Rechtliches" className="flex gap-4 flex-wrap">
              <a className="underline" href="/impressum">Impressum</a>
              <a className="underline" href="/datenschutz">Datenschutz</a>
              <a className="underline" href="/barrierefreiheit">Barrierefreiheit</a>
            </nav>
          </footer>
        </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

