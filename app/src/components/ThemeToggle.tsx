"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <button className="px-3 py-1 rounded-lg border text-sm opacity-50">Theme</button>;

  const current = theme === "system" ? systemTheme : theme;
  const isDark = current === "dark";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="px-3 py-1 rounded-lg border text-sm"
      >
        {isDark ? "Dark" : "Light"}
      </button>
      <button
        onClick={() => setTheme("system")}
        className="px-2 py-1 rounded-lg border text-xs opacity-70"
        title="System-Theme"
      >
        System
      </button>
    </div>
  );
}

