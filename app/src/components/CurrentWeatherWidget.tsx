"use client";
import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";

type Snap = { ts: string; t2m_K: number; rr_mm: number; eto_mm: number } | null;

export default function CurrentWeatherWidget() {
  const [snap, setSnap] = useState<Snap>(null);
  const [isForecast, setIsForecast] = useState(false);

  const pickCurrentFrom = (items: any[]) => {
    const enriched = items
      .map((it) => ({ ...it, _ts: new Date(it.ts).getTime() }))
      .sort((a, b) => a._ts - b._ts);

    const now = Date.now();
    const past = enriched.filter((it) => it._ts <= now).pop();
    if (past) {
      setSnap(past);
      setIsForecast(false);
      return;
    }
    const fut = enriched.find((it) => it._ts > now) ?? null;
    setSnap(fut);
    setIsForecast(!!fut);
  };

  const load = async () => {
    try {
      const r = await pb.collection("weather_snapshots").getList(1, 20, { sort: "-ts" });
      pickCurrentFrom(r.items as any[]);
    } catch (e: any) {
      // Auto-cancel/Abort? -> ignorieren, State NICHT leeren
      if (e?.status === 0 || e?.isAbort === true || e?.originalError?.name === "AbortError") return;
      setSnap(null);
      setIsForecast(false);
      console.error("load weather_snapshots failed:", e);
    }
  };

  useEffect(() => {
    let unsub: (() => void) | undefined;
    load();

    // bei Änderungen mit kleinem Debounce neu laden
    let t: any;
    pb.collection("weather_snapshots")
      .subscribe("*", () => {
        clearTimeout(t);
        t = setTimeout(load, 150);
      })
      .then((u) => (unsub = u))
      .catch(() => {});

    return () => {
      clearTimeout(t);
      unsub?.();
    };
  }, []);

  if (!snap) return <div className="text-sm opacity-70">Keine Daten</div>;

  const tC = (snap.t2m_K ?? 273.15) - 273.15;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">
        {isForecast ? "Nächster Wert (Prognose)" : "Aktuelles Wetter"}
      </h3>
      <div className="text-sm">
        <div>Temperatur: <span className="font-mono">{tC.toFixed(1)} °C</span></div>
        <div>Niederschlag: <span className="font-mono">{(snap.rr_mm ?? 0).toFixed(1)} mm</span></div>
        <div>ET₀: <span className="font-mono">{(snap.eto_mm ?? 0).toFixed(1)} mm</span></div>
        <div className="opacity-70 text-xs">Zeit: {new Date(snap.ts).toLocaleString()}</div>
      </div>
    </div>
  );
}

