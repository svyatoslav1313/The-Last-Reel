"use client";

import { useSyncExternalStore } from "react";
import type { Movie } from "@/types/tournament";
import { en } from "./en";
import { localizeMovie } from "./localizeMovie";
import { ru } from "./ru";
import { DEFAULT_LOCALE, LOCALES, type Dictionary, type Locale } from "./types";

const STORAGE_KEY = "locale";
const DICTIONARIES: Record<Locale, Dictionary> = { en, ru };

const isLocale = (value: unknown): value is Locale =>
  LOCALES.includes(value as Locale);

/*
 * The locale lives in a tiny external store instead of React state so it can
 * be read during hydration without a setState-in-effect: the server snapshot
 * is always the default, and the client snapshot takes over after hydration.
 */
const listeners = new Set<() => void>();
/** Used when localStorage is unavailable (private mode, blocked storage). */
let memoryChoice: Locale | null = null;

function readLocale(): Locale {
  if (memoryChoice) return memoryChoice;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // Fall through to the browser language.
  }
  return navigator.language.toLowerCase().startsWith("ru") ? "ru" : DEFAULT_LOCALE;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function setLocale(locale: Locale) {
  memoryChoice = locale;
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // The in-memory choice still applies for this session.
  }
  listeners.forEach((listener) => listener());
}

export interface UseLocale {
  locale: Locale;
  t: Dictionary;
  /** Translates a movie's text fields into the current locale. */
  localize: (movie: Movie) => Movie;
}

export function useLocale(): UseLocale {
  const locale = useSyncExternalStore(subscribe, readLocale, () => DEFAULT_LOCALE);
  return {
    locale,
    t: DICTIONARIES[locale],
    localize: (movie) => localizeMovie(movie, locale),
  };
}
