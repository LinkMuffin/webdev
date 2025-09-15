"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Lang = "de" | "en";

const MESSAGES: Record<Lang, Record<string, string>> = {
  de: {
    "dashboard.title": "Dashboard",
    "common.logout": "Logout",
    "common.system": "System",
    "layout.reset": "Layout zurücksetzen",
    "layout.saving": "Speichern…",

    "maize.title": "Mais-Gesundheit",
    "maize.status": "Status",
    "status.ok": "ok",
    "status.warnung": "warnung",
    "status.kritisch": "kritisch",
    "plant.vital": "vital",
    "plant.gestresst": "gestresst",
    "plant.vertrocknet": "vertrocknet",

    "weather.current": "Aktuelles Wetter",
    "weather.temp": "Temperatur",
    "weather.rain": "Niederschlag",
    "weather.eto": "ET₀",
    "weather.time": "Zeit",

    "forecast.title": "3-Tage-Prognose",
    "radar.title": "Niederschlagsradar",
    
    "gusts.title": "Wind & Böen",
	"gusts.gust": "Böe",
	"gusts.wind": "Wind",
	"gusts.unit.kmh": "km/h",
	"gusts.unit.ms": "m/s",

	"common.noData": "Keine Daten",


    "lang.de": "Deutsch",
    "lang.en": "Englisch",
  },
  en: {
    "dashboard.title": "Dashboard",
    "common.logout": "Logout",
    "common.system": "System",
    "layout.reset": "Reset layout",
    "layout.saving": "Saving…",

    "maize.title": "Maize health",
    "maize.status": "Status",
    "status.ok": "ok",
    "status.warnung": "warning",
    "status.kritisch": "critical",
    "plant.vital": "vital",
    "plant.gestresst": "stressed",
    "plant.vertrocknet": "withered",

    "weather.current": "Current weather",
    "weather.temp": "Temperature",
    "weather.rain": "Precipitation",
    "weather.eto": "ET₀",
    "weather.time": "Time",
    
    "gusts.title": "Wind & Gusts",
	"gusts.gust": "Gust",
	"gusts.wind": "Wind",
	"gusts.unit.kmh": "km/h",
	"gusts.unit.ms": "m/s",

	"common.noData": "No data",

    "forecast.title": "3-day forecast",
    "radar.title": "Precipitation radar",

    "lang.de": "German",
    "lang.en": "English",
  },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: string) => string;
};

const I18nCtx = createContext<Ctx | null>(null);

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "de";
    return (localStorage.getItem("lang") as Lang) || "de";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
    // <html lang="…"> setzen
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", lang);
    }
  }, [lang]);

  const value = useMemo<Ctx>(() => ({
    lang,
    setLang,
    toggle: () => setLang((p) => (p === "de" ? "en" : "de")),
    t: (key: string) => MESSAGES[lang][key] ?? key,
  }), [lang]);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

