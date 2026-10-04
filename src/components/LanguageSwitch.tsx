"use client";

import { en } from "@/i18n/en";
import { ru } from "@/i18n/ru";
import { LOCALES, type Locale } from "@/i18n/types";
import { setLocale, useLocale } from "@/i18n/useLocale";

const CODES: Record<Locale, string> = { en: en.code, ru: ru.code };

export function LanguageSwitch({ className = "" }: { className?: string }) {
  const { locale, t } = useLocale();

  return (
    <div
      role="group"
      aria-label={t.language}
      className={`flex items-center rounded-full border border-zinc-800 p-0.5 text-xs font-medium ${className}`}
    >
      {LOCALES.map((option) => (
        <button
          key={option}
          type="button"
          lang={option}
          aria-pressed={option === locale}
          onClick={() => setLocale(option)}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            option === locale
              ? "bg-zinc-100 text-zinc-950"
              : "text-zinc-400 hover:text-zinc-100"
          }`}
        >
          {CODES[option]}
        </button>
      ))}
    </div>
  );
}
