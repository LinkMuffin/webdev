"use client";
import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import { useI18n } from "@/components/I18nProvider";

type Loc = { lat: number; lon: number };

export default function RadarWidget() {
  const { t } = useI18n();
  const [loc, setLoc] = useState<Loc>({ lat: 51.1657, lon: 10.4515 }); // DE-Mitte

  useEffect(() => {
    pb.collection("maize_indicator")
      .getList(1, 1, { sort: "-updated" })
      .then((r) => {
        const it: any = r.items[0];
        if (it?.lat && it?.lon) setLoc({ lat: Number(it.lat), lon: Number(it.lon) });
      })
      .catch(() => {});
  }, []);

  const zoom = 7;
  const src = `https://www.rainviewer.com/map.html?loc=${loc.lat.toFixed(4)},${loc.lon.toFixed(4)},${zoom}&oFa=0&oC=1&oU=0&oCS=0&oF=1&oAP=1&c=1&layer=radar&sm=1&hu=0`;

  return (
    <div className="w-full h-full">
      <div className="mb-2 text-lg font-semibold">{t("radar.title")}</div>
      <div className="w-full h-[calc(100%-2rem)] rounded-xl overflow-hidden border">
        <iframe
          key={src}
          src={src}
          title="RainViewer Radar"
          className="w-full h-full"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="mt-1 text-[10px] opacity-60">
        RainViewer embed · external content
      </div>
    </div>
  );
}

