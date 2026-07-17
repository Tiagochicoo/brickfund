import type { Category, InvestmentType } from "./types";

export const INVESTMENT_TYPES: Record<
  InvestmentType,
  { label: string; short: string; pill: string; dot: string; blurb: string }
> = {
  seed: {
    label: "Seed",
    short: "Seed",
    pill: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    dot: "bg-indigo-500",
    blurb: "Early-stage capital to launch.",
  },
  growth: {
    label: "Growth",
    short: "Growth",
    pill: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
    blurb: "Funds to expand an existing business.",
  },
  loan: {
    label: "Loan",
    short: "Loan",
    pill: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
    blurb: "Debt financing repaid over time.",
  },
  equity: {
    label: "Equity",
    short: "Equity",
    pill: "bg-sky-50 text-sky-700 ring-sky-200",
    dot: "bg-sky-500",
    blurb: "Ownership stake in exchange for capital.",
  },
  revenue_share: {
    label: "Revenue Share",
    short: "Rev-share",
    pill: "bg-violet-50 text-violet-700 ring-violet-200",
    dot: "bg-violet-500",
    blurb: "Investors earn a % of monthly revenue.",
  },
  convertible_note: {
    label: "Convertible Note",
    short: "Conv. Note",
    pill: "bg-rose-50 text-rose-700 ring-rose-200",
    dot: "bg-rose-500",
    blurb: "Debt that converts to equity later.",
  },
};

export const CATEGORIES: Record<Category, { label: string; emoji: string }> = {
  restaurant: { label: "Restaurant", emoji: "🍽️" },
  barber: { label: "Barbershop", emoji: "💈" },
  gym: { label: "Gym & Fitness", emoji: "🏋️" },
  cafe: { label: "Café", emoji: "☕" },
  retail: { label: "Retail", emoji: "🛍️" },
  salon: { label: "Salon", emoji: "💇" },
  bakery: { label: "Bakery", emoji: "🥖" },
  bar: { label: "Bar", emoji: "🍸" },
  other: { label: "Other", emoji: "🏢" },
};

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
