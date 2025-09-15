"use client";
import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import { useI18n } from "@/components/I18nProvider";

type Snap = {
  ts: string;
  gust_kmh?: number | null;
  wind_ms?: number | null;
} | null;

export default function WindGustWidget() {
  const { t } = useI18n();
  const [snap, setSnap] = useState<Snap>(null);

  const load = async () => {
    try {
      // ein paar Einträge holen und den neuesten bis jetzt wählen
      const r = await pb.collection("weather_snapshots").getList(1, 5, { sort: "-ts" });
      const items = (r.items as any[]) ?? [];
      const now = new Date();
      const current = items.find((it) => new Date(it.ts) <= now) ?? items[0] ?? null;
      setSnap(current);
    } catch {
      setSnap(null);
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

  if (!snap) return <div className="text-sm opacity-70">{t("common.noData")}</div>;

  const fmt = (v?: number | null, frac = 1) =>
    v === null || v === undefined ? "—" : v.toFixed(frac);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{t("gusts.title")}</h3>
      <div className="text-sm">
        <div>
          {t("gusts.gust")}:{" "}
          <span className="font-mono">
            {fmt(snap.gust_kmh, 0)} {t("gusts.unit.kmh")}
          </span>
        </div>
        <div>
          {t("gusts.wind")}:{" "}
          <span className="font-mono">
            {fmt(snap.wind_ms, 1)} {t("gusts.unit.ms")}
          </span>
        </div>
        <div className="opacity-70 text-xs">
          {t("weather.time")}: {new Date(snap.ts).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

