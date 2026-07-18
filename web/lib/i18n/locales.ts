export type Locale = "en" | "zh" | "hi" | "es" | "fr" | "ar" | "bn" | "ru" | "pt" | "ur";

export const LOCALES: { code: Locale; label: string; native: string; flag: string; rtl: boolean }[] = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧", rtl: false },
  { code: "zh", label: "Chinese", native: "中文", flag: "🇨🇳", rtl: false },
  { code: "hi", label: "Hindi", native: "हिन्दी", flag: "🇮🇳", rtl: false },
  { code: "es", label: "Spanish", native: "Español", flag: "🇪🇸", rtl: false },
  { code: "fr", label: "French", native: "Français", flag: "🇫🇷", rtl: false },
  { code: "ar", label: "Arabic", native: "العربية", flag: "🇸🇦", rtl: true },
  { code: "bn", label: "Bengali", native: "বাংলা", flag: "🇧🇩", rtl: false },
  { code: "ru", label: "Russian", native: "Русский", flag: "🇷🇺", rtl: false },
  { code: "pt", label: "Portuguese", native: "Português", flag: "🇵🇹", rtl: false },
  { code: "ur", label: "Urdu", native: "اردو", flag: "🇵🇰", rtl: true },
];

export const RTL_LOCALES: Locale[] = ["ar", "ur"];

export function isRTL(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

export function detectBrowserLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem("brickfund-locale");
  if (stored && LOCALES.some((l) => l.code === stored)) return stored as Locale;
  const browserLangs = navigator.languages ?? [navigator.language];
  for (const bl of browserLangs) {
    const code = bl.split("-")[0].toLowerCase();
    const match = LOCALES.find((l) => l.code === code);
    if (match) return match.code;
  }
  return "en";
}
