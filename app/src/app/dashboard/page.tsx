"use client";

import GridLayout, { Layout as RGLLayout } from "react-grid-layout";
import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";

import MaizeWidget from "@/components/MaizeWidget";
import CurrentWeatherWidget from "@/components/CurrentWeatherWidget";
import Forecast3dWidget from "@/components/Forecast3dWidget";
import RadarWidget from "@/components/RadarWidget";
import WindGustWidget from "@/components/WindGustWidget";

import ThemeToggle from "@/components/ThemeToggle";
import LangToggle from "@/components/LangToggle";
import { useI18n } from "@/components/I18nProvider";

import {
  loadOrCreateDashboard,
  saveLayoutDebounced,
  getDefaultLayout,
} from "@/lib/dashboardStore";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export default function DashboardPage() {
  const { t } = useI18n();

  // Daten + Layout-State
  const [maize, setMaize] = useState<any>(null);
  const [layout, setLayout] = useState<RGLLayout[]>(getDefaultLayout() as any);
  const [dashId, setDashId] = useState<string | null>(null);
  const [saving, setSaving] = useState<"idle" | "dirty" | "saving">("idle");

  // NEU: Speichern temporär deaktivieren & Grid neu montieren
  const [suspendSave, setSuspendSave] = useState(false);
  const [gridKey, setGridKey] = useState(0);

  // Mais-Indikator initial + live
  useEffect(() => {
    let unsub: (() => void) | undefined;

    pb.collection("maize_indicator")
      .getList(1, 1, { sort: "-updated" })
      .then((r) => setMaize(r.items[0] ?? null))
      .catch(() => {});

    pb.collection("maize_indicator")
      .subscribe("*", (e) => {
        if (e.action !== "delete") setMaize(e.record);
      })
      .then((u) => (unsub = u))
      .catch(() => {});

    return () => unsub?.();
  }, []);

  // Dashboard-Layout laden/erstellen
  useEffect(() => {
    loadOrCreateDashboard()
      .then((rec) => {
        setDashId(rec.id);
        if (Array.isArray(rec.layout_json) && rec.layout_json.length) {
          setLayout(rec.layout_json as any);
        } else {
          setLayout(getDefaultLayout() as any); // Default enthält "gusts"
        }
      })
      .catch((e) => console.error("load dashboard failed:", e));
  }, []);

  // Änderungen am Grid speichern (debounced)
  const handleLayoutChange = (l: RGLLayout[]) => {
    if (suspendSave) return; // Reset läuft → Ignorieren
    setLayout(l);
    setSaving("dirty");
    if (dashId) {
      setSaving("saving");
      saveLayoutDebounced(dashId, l);
      setTimeout(() => setSaving("idle"), 800);
    }
  };

  // Layout zurücksetzen
  const handleReset = async () => {
    const def = getDefaultLayout() as any;

    // 1) Speichern aus
    setSuspendSave(true);

    // 2) Grid auf Default setzen
    setLayout(def);

    // 3) DB überschreiben (falls vorhanden)
    try {
      if (dashId) {
        // optional: evtl. ausstehende Debounce-Calls abbrechen, falls unterstützt
        // (saveLayoutDebounced as any)?.cancel?.();
        await pb.collection("dashboards").update(dashId, { layout_json: def });
      }
    } finally {
      // 4) Grid remounten & Speichern wieder an
      setGridKey((k) => k + 1);
      setSuspendSave(false);
      setSaving("idle");
    }
  };

  return (
    <main className="p-6">
      {/* Topbar */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("dashboard.title")}</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs opacity-60">
            {saving === "saving" ? t("layout.saving") : ""}
          </span>
          <button
            onClick={handleReset}
            className="text-sm px-3 py-1 border rounded-lg opacity-80"
          >
            {t("layout.reset")}
          </button>
          <LangToggle />
          <ThemeToggle />
          <button
            onClick={() => {
              pb.authStore.clear();
              location.href = "/login";
            }}
            className="text-sm opacity-70"
          >
            {t("common.logout")}
          </button>
        </div>
      </div>

      {/* Grid */}
      <GridLayout
        key={gridKey}              // <- Remount erzwingen
        className="layout"
        layout={layout as any}
        cols={12}
        rowHeight={90}
        width={1200}
        isResizable
        isDraggable
        onLayoutChange={handleLayoutChange}
      >
        <div key="maize" className="p-4 rounded-2xl border">
          <MaizeWidget data={maize} />
        </div>

        <div key="weather" className="p-4 rounded-2xl border">
          <CurrentWeatherWidget />
        </div>

        <div key="forecast" className="p-4 rounded-2xl border">
          <Forecast3dWidget />
        </div>

        <div key="gusts" className="p-4 rounded-2xl border">
          <WindGustWidget />
        </div>

        <div key="radar" className="p-4 rounded-2xl border">
          <RadarWidget />
        </div>
      </GridLayout>
    </main>
  );
}

