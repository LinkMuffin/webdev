"use client";
import { useI18n } from "@/components/I18nProvider";

export default function LangToggle() {
  const { lang, setLang, toggle, t } = useI18n();
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={toggle}
        className="px-3 py-1 rounded-lg border text-sm"
        title={`${t("lang.de")} / ${t("lang.en")}`}
      >
        {lang === "de" ? "DE" : "EN"}
      </button>
      <div className="text-xs opacity-60 hidden sm:block">
        {lang === "de" ? t("lang.de") : t("lang.en")}
      </div>
    </div>
  );
}

