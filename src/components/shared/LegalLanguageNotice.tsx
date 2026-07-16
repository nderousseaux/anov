"use client";

import { useLanguage } from "@/context/LanguageContext";

export function LegalLanguageNotice() {
  const { locale, t } = useLanguage();
  if (locale === "fr") return null;
  return (
    <div className="mb-6 px-4 py-3 rounded-md border border-yellow-500/40 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 text-sm">
      {t.legal.frenchOnly}
    </div>
  );
}
