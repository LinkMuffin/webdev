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

import I18nProvider from "@/components/I18nProvider";

export const metadata: Metadata = {
  title: "Landwetter",
  description: "Wetter-Dashboard für Landwirtschaft",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* WICHTIG: I18nProvider muss über allen Seiten/Komponenten liegen,
           die useI18n verwenden (z. B. Dashboard). */}
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
      </body>
    </html>
  );
}

