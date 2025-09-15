"use client";
import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";

type Day = { ts: string; t2m_K: number; rr_mm: number; eto_mm: number };

export default function Forecast3dWidget() {
  const [days, setDays] = useState<Day[]>([]);

  function load() {
    pb.collection("weather_snapshots")
      .getList(1, 3, { sort: "ts", filter: `ts >= @now` }) // @today gibt es nicht -> @now
      .then((r) => setDays(r.items as any))
      .catch(() => setDays([]));
  }

  useEffect(() => {
    let unsub: (() => void) | undefined;
    load();
    pb.collection("weather_snapshots")
      .subscribe("*", () => load())
      .then((u) => (unsub = u))
      .catch(() => {});
    return () => unsub?.();
  }, []);

  if (!days.length) return <div className="text-sm opacity-70">Keine Prognose</div>;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">3-Tage-Prognose</h3>
      <div className="grid grid-cols-3 gap-3">
        {days.map((d) => {
          const tC = (d.t2m_K ?? 273.15) - 273.15;
          const day = new Date(d.ts);
          const label = day.toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "2-digit" });
          return (
            <div key={d.ts} className="rounded-xl border p-3 text-sm">
              <div className="font-medium">{label}</div>
              <div>Temp: <span className="font-mono">{tC.toFixed(1)} °C</span></div>
              <div>Regen: <span className="font-mono">{(d.rr_mm ?? 0).toFixed(1)} mm</span></div>
              <div>ET₀: <span className="font-mono">{(d.eto_mm ?? 0).toFixed(1)} mm</span></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

