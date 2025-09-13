"use client";
import GridLayout from "react-grid-layout";
import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import MaizeWidget from "@/components/MaizeWidget";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export default function DashboardPage(){
  const [maize, setMaize] = useState<any>(null);

  useEffect(() => {
    pb.collection("maize_indicator").getList(1,1,{ sort: "-updated" })
      .then(r => setMaize(r.items[0] ?? null)).catch(()=>{});
    pb.collection("maize_indicator").subscribe("*", (e) => {
      if (e.action !== "delete") setMaize(e.record);
    });
    return () => pb.collection("maize_indicator").unsubscribe("*");
  }, []);

  const layout = [
    { i: "maize", x: 0, y: 0, w: 4, h: 3 },
    { i: "weather", x: 4, y: 0, w: 8, h: 3 },
  ];

  return (
    <main className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button onClick={()=>{ pb.authStore.clear(); location.href="/login"; }}
          className="text-sm opacity-70">Logout</button>
      </div>
      <GridLayout className="layout" layout={layout} cols={12} rowHeight={90} width={1200}>
        <div key="maize" className="p-4 rounded-2xl border"><MaizeWidget data={maize}/></div>
        <div key="weather" className="p-4 rounded-2xl border text-sm opacity-70">Wetter-Widget (Platzhalter)</div>
      </GridLayout>
    </main>
  );
}

