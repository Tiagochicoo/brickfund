"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
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
import { ru } from "./ru";
import { de } from "./de";
import { sv } from "./sv";
import { fi } from "./fi";

const DICTS: Record<Locale, TranslationDict> = { en, pt, es, fr, zh, hi, ar, ru, de, sv, fi };
const STORAGE_KEY = "brickfund-locale";
const EVENT_NAME = "brickfund-locale-change";

type I18nContextValue = {
  locale: Locale;
  t: TranslationDict;
  rtl: boolean;
  setLocale: (l: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && DICTS[stored]) {
      setLocale(stored);
      return;
    }
    const detected = detectBrowserLocale();
    if (detected !== "en" && DICTS[detected]) {
      setLocale(detected);
    }
  }, []);

  const handleSetLocale = useCallback((newLocale: Locale) => {
    localStorage.setItem(STORAGE_KEY, newLocale);
    window.dispatchEvent(new CustomEvent<string>(EVENT_NAME, { detail: newLocale }));
    setLocale(newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = isRTL(newLocale) ? "rtl" : "ltr";
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const newLocale = e.newValue as Locale;
        setLocale(newLocale);
        document.documentElement.lang = newLocale;
        document.documentElement.dir = isRTL(newLocale) ? "rtl" : "ltr";
      }
    };

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        const newLocale = customEvent.detail as Locale;
        setLocale(newLocale);
        document.documentElement.lang = newLocale;
        document.documentElement.dir = isRTL(newLocale) ? "rtl" : "ltr";
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(EVENT_NAME, handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(EVENT_NAME, handleCustomEvent);
    };
  }, []);

  useEffect(() => {
    const safeLocale = DICTS[locale] ? locale : "en";
    document.documentElement.lang = safeLocale;
    document.documentElement.dir = isRTL(safeLocale) ? "rtl" : "ltr";
  }, [locale]);

  const safeLocale = DICTS[locale] ? locale : "en";
  const t = DICTS[safeLocale];
  const rtl = isRTL(safeLocale);

  const value = useMemo(
    () => ({ locale: safeLocale, t, rtl, setLocale: handleSetLocale }),
    [safeLocale, t, rtl, handleSetLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
