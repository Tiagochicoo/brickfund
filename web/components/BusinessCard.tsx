import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Business } from "@/lib/types";
import { CATEGORIES, formatCurrency, pct } from "@/lib/constants";
import InvestmentPill from "./InvestmentPill";

const BANNERS: Record<string, string> = {
  restaurant: "from-amber-500/90 to-rose-500/90",
  barber: "from-slate-600/90 to-slate-800/90",
  gym: "from-zinc-600/90 to-zinc-800/90",
  cafe: "from-orange-400/90 to-amber-600/90",
  retail: "from-pink-500/90 to-fuchsia-600/90",
  salon: "from-rose-400/90 to-pink-600/90",
  bakery: "from-yellow-500/90 to-orange-600/90",
  bar: "from-violet-600/90 to-indigo-700/90",
  other: "from-brand-500/90 to-brand-700/90",
};

export default function BusinessCard({ business }: { business: Business }) {
  const cat = CATEGORIES[business.category] ?? CATEGORIES.other;
  const percent = pct(business.fundingRaised, business.fundingGoal);
  const funded = percent >= 100;
  return (
    <Link
      href={`/businesses/${business.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
    >
      <div
        className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${
          BANNERS[business.category] ?? BANNERS.other
        }`}
      >
        <span className="text-4xl drop-shadow-sm" aria-hidden="true">
          {cat.emoji}
        </span>
        <div className="absolute left-3 top-3">
          <InvestmentPill type={business.investmentType} size="sm" />
        </div>
        {funded && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-brand-700 ring-1 ring-white/60">
            Funded
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-lg font-semibold leading-snug text-brand-900 transition-colors group-hover:text-brand-600">
            {business.name}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-ink/55">
            <MapPin className="h-3.5 w-3.5" />
            {business.location}
            <span className="mx-1 text-ink/30">•</span>
            {cat.label}
          </p>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-ink/70">
          {business.pitch}
        </p>

        <div className="mt-auto">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-brand-800">
              {formatCurrency(business.fundingRaised)}
            </span>
            <span className="text-ink/50">
              of {formatCurrency(business.fundingGoal)}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-cream-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] font-medium text-ink/45">
            {percent}% raised
          </p>
        </div>
      </div>
    </Link>
  );
}
