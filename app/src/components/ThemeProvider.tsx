"use client";
import { ThemeProvider as NextThemes } from "next-themes";
import { ReactNode } from "react";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemes
      attribute="class"      // setzt 'dark' / 'light' Klasse auf <html>
      defaultTheme="system"  // folgt dem OS-Theme
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemes>
  );
}

