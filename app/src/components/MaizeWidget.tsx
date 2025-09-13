"use client";
import { motion } from "framer-motion";

type Data = {
  water_balance_mm: number;
  stress_level: "ok" | "warnung" | "kritisch";
  plant_state: "vital" | "gestresst" | "vertrocknet";
} | null;

export default function MaizeWidget({ data }: { data: Data }) {
  if (!data) return <div className="text-sm opacity-70">Lade Mais-Indikator…</div>;
  const color =
    data.stress_level === "ok" ? "text-green-600" :
    data.stress_level === "warnung" ? "text-amber-600" : "text-red-600";
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">Mais-Gesundheit</h3>
        <span className={`font-mono ${color}`}>{data.water_balance_mm} mm</span>
      </div>
      <motion.div
        animate={{ scale: data.plant_state==="vital"?1.05:data.plant_state==="gestresst"?1.0:0.95,
                   opacity: data.plant_state==="vertrocknet"?0.6:1 }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        className="h-24 rounded-xl border grid place-items-center"
      >
        <span className="text-sm">{data.plant_state}</span>
      </motion.div>
      <p className="text-xs opacity-70">Status: {data.stress_level}</p>
    </div>
  );
}

