"use client";
import { useI18n } from "@/components/I18nProvider";

type Level = "ok" | "warnung" | "kritisch";
type State = "vital" | "gestresst" | "vertrocknet";

type Data = {
  water_balance_mm?: number;
  stress_level?: Level;
  plant_state?: State;
} | null;

const levelColor: Record<Level, string> = {
  ok: "text-emerald-600",
  warnung: "text-amber-600",
  kritisch: "text-red-600",
};

export default function MaizeWidget({ data }: { data: Data }) {
  const { t } = useI18n();

  if (!data) return <div className="text-sm opacity-70">{t("maize.title")}: …</div>;

  const balance = data.water_balance_mm ?? null;
  const level = (data.stress_level ?? "ok") as Level;
  const state = (data.plant_state ?? "vital") as State;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="font-semibold">{t("maize.title")}</div>
        {balance !== null && (
          <div className={`${levelColor[level]} font-mono`}>
            {balance.toFixed(1)} <span className="opacity-60">mm</span>
          </div>
        )}
      </div>

      {/* größerer Icon-Container (vorher h-36) */}
      <div className="mt-2 grid place-items-center rounded-xl border h-48 p-2">
        {/* größeres SVG (vorher w-24 h-24) */}
        <MaizeIcon state={state} className="w-36 h-36 md:w-40 md:h-40" />
      </div>

      <div className="mt-2 text-xs opacity-70">
        {t("maize.status")}: <span className={levelColor[level]}>{t(`status.${level}`)}</span>
      </div>
    </div>
  );
}

/** Schlanke, einfache Vektor-Maispflanze mit Zustandsfarben */
function MaizeIcon({ state, className = "w-36 h-36" }: { state: State; className?: string }) {
  // Farben pro Zustand
  const theme =
    state === "vital"
      ? { stalk: "#059669", leaf: "#10B981", soil: "#7C3E1D" }
      : state === "gestresst"
      ? { stalk: "#D97706", leaf: "#F59E0B", soil: "#7C3E1D" }
      : { stalk: "#6B7280", leaf: "#9CA3AF", soil: "#7C3E1D" }; // vertrocknet

  return (
    <svg viewBox="0 0 120 120" className={className} aria-label={`corn-${state}`}>
      {/* Boden */}
      <rect x="20" y="86" width="80" height="16" rx="2" fill={theme.soil} opacity="0.25" />
      {/* Stängel */}
      <rect x="58" y="46" width="4" height="42" rx="2" fill={theme.stalk} />
      {/* Blätter */}
      <path d="M58 60 C42 58, 38 50, 38 46 C46 50, 52 52, 58 54 Z" fill={theme.leaf} opacity={state === "vertrocknet" ? 0.45 : 1} />
      <path d="M62 70 C78 68, 82 60, 82 56 C74 60, 68 62, 62 64 Z" fill={theme.leaf} opacity={state === "vertrocknet" ? 0.45 : 1} />
      {/* Kolben */}
      <ellipse cx="60" cy="44" rx="11" ry="13" fill={theme.leaf} opacity={state === "gestresst" ? 0.85 : 1} />

      {/* kleines Gesicht je Zustand */}
      {state === "vital" && (
        <>
          <circle cx="56" cy="42" r="2" fill="#064E3B" />
          <circle cx="64" cy="42" r="2" fill="#064E3B" />
          <path d="M55 47 Q60 50, 65 47" stroke="#064E3B" strokeWidth="2" fill="none" />
        </>
      )}
      {state === "gestresst" && (
        <>
          <circle cx="56" cy="42" r="2" fill="#78350F" />
          <circle cx="64" cy="42" r="2" fill="#78350F" />
          <path d="M55 48 Q60 47, 65 48" stroke="#78350F" strokeWidth="2" fill="none" />
        </>
      )}
      {state === "vertrocknet" && (
        <>
          <circle cx="56" cy="42" r="2" fill="#374151" />
          <circle cx="64" cy="42" r="2" fill="#374151" />
          <path d="M55 48 Q60 45, 65 48" stroke="#374151" strokeWidth="2" fill="none" />
        </>
      )}
    </svg>
  );
}

