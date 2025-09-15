"use client";
import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";

type Loc = { lat: number; lon: number };

export default function RadarWidget() {
  const [loc, setLoc] = useState<Loc | null>(null);

  useEffect(() => {
    pb.collection("maize_indicator")
      .getList(1, 1, { sort: "-updated" })
      .then((r) => {
        const it: any = r.items[0];
        if (it?.lat && it?.lon) setLoc({ lat: Number(it.lat), lon: Number(it.lon) });
        else setLoc({ lat: 51.1657, lon: 10.4515 }); // Deutschland-Mitte
      })
      .catch(() => setLoc({ lat: 51.1657, lon: 10.4515 }));
  }, []);

  const lat = loc?.lat ?? 51.1657;
  const lon = loc?.lon ?? 10.4515;
  const zoom = 7; // 5–10 je nach Geschmack

  // RainViewer-Embed (Radar animiert, ohne zusätzliche UI)
  const src = `https://www.rainviewer.com/map.html?loc=${lat.toFixed(4)},${lon.toFixed(4)},${zoom}&oFa=0&oC=1&oU=0&oCS=0&oF=1&oAP=1&c=1&layer=radar&sm=1&hu=0`;

  return (
    <div className="w-full h-full">
      <div className="mb-2 text-lg font-semibold">Niederschlagsradar</div>
      <div className="w-full h-[calc(100%-2rem)] rounded-xl overflow-hidden border">
        <iframe
          key={src}
          src={src}
          title="Niederschlagsradar"
          className="w-full h-full"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="mt-1 text-[10px] opacity-60">
        Quelle: RainViewer (Third-Party; lädt externe Inhalte)
      </div>
    </div>
  );
}

