"use client";
import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import { useI18n } from "@/components/I18nProvider";

type Snap = {
  ts: string;       // ISO date (00:00Z)
  t2m_K: number;    // mean temp in Kelvin
  rr_mm: number;    // rain (mm)
  eto_mm: number;   // ET0 (mm)
};

export default function Forecast3dWidget() {
  const { t } = useI18n();
  const [days, setDays] = useState<Snap[]>([]);

  const load = async () => {
    try {
      // erst Zukunft (aufsteigend)
      const fut = await pb.collection("weather_snapshots").getList(1, 10, {
        sort: "ts",
        filter: 'ts >= @now',
      });
      const items = fut.items as Snap[];
      if (items.length) {
        setDays(items.slice(0, 3));
        return;
      }

      // Fallback: letzte 3 Tage (absteigend → umdrehen)
      const past = await pb.collection("weather_snapshots").getList(1, 3, {
        sort: "-ts",
      });
      setDays((past.items as Snap[]).reverse());
    } catch {
      setDays([]);
    }
  };

  useEffect(() => {
    let unsub: (() => void) | undefined;
    load();
    pb.collection("weather_snapshots")
      .subscribe("*", () => load())
      .then((u) => (unsub = u))
      .catch(() => {});
    return () => unsub?.();
  }, []);

  return (
    <div>
      <div className="text-lg font-semibold mb-2">{t("forecast.title")}</div>
      <div className="flex gap-3">
        {days.length === 0 && (
          <div className="text-sm opacity-70">{/* leer */}</div>
        )}
        {days.map((d) => {
          const dt = new Date(d.ts);
          const label = dt.toLocaleDateString(undefined, {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
          });
          const tC = (d.t2m_K ?? 273.15) - 273.15;
          return (
            <div key={d.ts} className="rounded-xl border px-3 py-2 text-sm w-40">
              <div className="font-medium">{label}</div>
              <div>{t("weather.temp")}: <span className="font-mono">{tC.toFixed(1)} °C</span></div>
              <div>{t("weather.rain")}: <span className="font-mono">{(d.rr_mm ?? 0).toFixed(1)} mm</span></div>
              <div>ET₀: <span className="font-mono">{(d.eto_mm ?? 0).toFixed(1)} mm</span></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

