import type { Category, InvestmentType } from "./types";
import type { TranslationDict } from "./i18n/en";

export const INVESTMENT_TYPE_STYLES: Record<
  InvestmentType,
  { pill: string; dot: string }
> = {
  seed: {
    pill: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    dot: "bg-indigo-500",
  },
  growth: {
    pill: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  loan: {
    pill: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
  },
  equity: {
    pill: "bg-sky-50 text-sky-700 ring-sky-200",
    dot: "bg-sky-500",
  },
  revenue_share: {
    pill: "bg-violet-50 text-violet-700 ring-violet-200",
    dot: "bg-violet-500",
  },
  convertible_note: {
    pill: "bg-rose-50 text-rose-700 ring-rose-200",
    dot: "bg-rose-500",
  },
};

export const CATEGORIES: Record<Category, { emoji: string }> = {
  restaurant: { emoji: "🍽️" },
  barber: { emoji: "💈" },
  gym: { emoji: "🏋️" },
  cafe: { emoji: "☕" },
  retail: { emoji: "🛍️" },
  salon: { emoji: "💇" },
  bakery: { emoji: "🥖" },
  bar: { emoji: "🍸" },
  other: { emoji: "🏢" },
};

export function getInvestmentTypeMeta(type: InvestmentType, t: TranslationDict) {
  const style = INVESTMENT_TYPE_STYLES[type];
  const label = t.investmentTypes[type];
  const blurb = t.investmentTypes[`${type}Blurb` as keyof typeof t.investmentTypes] as string;
  return { label, blurb, pill: style.pill, dot: style.dot };
}

export function getCategoryLabel(cat: Category, t: TranslationDict): string {
  return t.categories[cat];
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function pct(raised: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
}
