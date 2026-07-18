"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { detectBrowserLocale, isRTL, type Locale } from "./locales";
import { en, type TranslationDict } from "./en";
import { pt } from "./pt";
import { es } from "./es";
import { fr } from "./fr";
import { zh } from "./zh";
import { hi } from "./hi";
import { ar } from "./ar";
import { bn } from "./bn";
import { ru } from "./ru";
import { ur } from "./ur";

const DICTS: Record<Locale, TranslationDict> = { en, pt, es, fr, zh, hi, ar, bn, ru, ur };
const STORAGE_KEY = "brickfund-locale";

function getSnapshot(): Locale {
  if (typeof window === "undefined") return "en";
  return (localStorage.getItem(STORAGE_KEY) as Locale) || detectBrowserLocale();
}

function getServerSnapshot(): Locale {
  return "en";
}

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("brickfund-locale-change", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("brickfund-locale-change", onStoreChange);
  };
}

type I18nContextValue = {
  locale: Locale;
  t: TranslationDict;
  rtl: boolean;
  setLocale: (l: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const safeLocale = DICTS[locale] ? locale : "en";
  const t = DICTS[safeLocale];
  const rtl = isRTL(safeLocale);

  useEffect(() => {
    document.documentElement.lang = safeLocale;
    document.documentElement.dir = isRTL(safeLocale) ? "rtl" : "ltr";
  }, [safeLocale]);

  const setLocale = useCallback((l: Locale) => {
    localStorage.setItem(STORAGE_KEY, l);
    window.dispatchEvent(new Event("brickfund-locale-change"));
    document.documentElement.lang = l;
    document.documentElement.dir = isRTL(l) ? "rtl" : "ltr";
  }, []);

  const value = useMemo(
    () => ({ locale: safeLocale, t, rtl, setLocale }),
    [safeLocale, t, rtl, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
