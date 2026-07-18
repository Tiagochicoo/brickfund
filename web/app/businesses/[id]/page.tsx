"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowLeft, Target, TrendingUp, CheckCircle2, ShieldCheck } from "lucide-react";
import { getBusiness } from "@/lib/api";
import { CATEGORIES, formatCurrency, pct } from "@/lib/constants";
import InvestmentPill from "@/components/InvestmentPill";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { StartDealButton } from "@/components/deals/StartDealButton";
import type { Business, User } from "@/lib/types";

const BANNERS: Record<string, string> = {
  restaurant: "from-amber-500 to-rose-500",
  barber: "from-slate-600 to-slate-800",
  gym: "from-zinc-600 to-zinc-800",
  cafe: "from-orange-400 to-amber-600",
  retail: "from-pink-500 to-fuchsia-600",
  salon: "from-rose-400 to-pink-600",
  bakery: "from-yellow-500 to-orange-600",
  bar: "from-violet-600 to-indigo-700",
  other: "from-brand-500 to-brand-700",
};

export default function BusinessDetailPage() {
  const params = useParams<{ id: string }>();
  const { t } = useI18n();
  const { user } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    getBusiness(params.id).then((b) => {
      setBusiness(b);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <p className="font-display text-2xl font-semibold text-brand-900">{t.notFound.title}</p>
        <Link href="/businesses" className="mt-6 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white">
          {t.businessDetail.backToOpportunities}
        </Link>
      </div>
    );
  }

  const cat = CATEGORIES[business.category] ?? CATEGORIES.other;
  const catLabel = t.categories[business.category];
  const percent = pct(business.fundingRaised, business.fundingGoal);
  const remaining = Math.max(0, business.fundingGoal - business.fundingRaised);
  const owner = business.expand?.owner as User | undefined;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link href="/businesses" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 transition-colors hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" />
        {t.businessDetail.backToOpportunities}
      </Link>

      <div className={`relative mt-4 flex h-48 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br ${BANNERS[business.category] ?? BANNERS.other} sm:h-64`}>
        <div className="bg-grid absolute inset-0 opacity-20" aria-hidden="true" />
        <span className="text-6xl drop-shadow sm:text-7xl" aria-hidden="true">{cat.emoji}</span>
        <div className="absolute left-5 top-5">
          <InvestmentPill type={business.investmentType} />
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-ink/55">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {business.city ? `${business.city}${business.country ? ", " + business.country : ""}` : business.location}
            </span>
            <span className="text-ink/30">•</span>
            <span>{catLabel}</span>
          </div>

          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-950 sm:text-4xl">{business.name}</h1>
          <p className="mt-3 text-lg leading-relaxed text-ink/70">{business.pitch}</p>

          {business.description && (
            <div className="mt-6">
              <h2 className="font-display text-lg font-semibold text-brand-900">{t.businessDetail.about}</h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-ink/70">{business.description}</p>
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-cream-200 bg-cream-50 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-brand-900">
              <ShieldCheck className="h-4 w-4 text-brand-600" />
              {t.businessDetail.whatInvestorsGet}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-ink/65">
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-600" />{t.businessDetail.whatInvestorsgetBody1}</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-600" />{t.businessDetail.whatInvestorsgetBody2}</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-600" />{t.businessDetail.whatInvestorsgetBody3}</li>
            </ul>
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-cream-200 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/55">{t.businessDetail.raised}</span>
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{percent}{t.businessDetail.funded}</span>
            </div>
            <p className="mt-1 font-display text-3xl font-semibold text-brand-900">{formatCurrency(business.fundingRaised)}</p>
            <p className="text-sm text-ink/50">{t.businessDetail.goalOf} {formatCurrency(business.fundingGoal)}</p>

            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-cream-200">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700" style={{ width: `${percent}%` }} />
            </div>

            <dl className="mt-5 space-y-3 border-t border-cream-200 pt-5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1.5 text-ink/55"><Target className="h-4 w-4" /> {t.businessDetail.remaining}</dt>
                <dd className="font-semibold text-brand-900">{formatCurrency(remaining)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1.5 text-ink/55"><TrendingUp className="h-4 w-4" /> {t.businessDetail.dealType}</dt>
                <dd><InvestmentPill type={business.investmentType} size="sm" /></dd>
              </div>
            </dl>

            {user?.role === "investor" ? (
              <StartDealButton
                businessId={business.id}
                businessName={business.name}
                suggestedAmount={Math.max(1000, business.fundingGoal - business.fundingRaised)}
              />
            ) : (
              <Link href="/register" className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-800">
                {t.businessDetail.expressInterest}
              </Link>
            )}
            <p className="mt-2 text-center text-xs text-ink/40">
              {user?.role === "investor"
                ? "Escrow-protected. Funds released only after both parties confirm handover."
                : t.businessDetail.expressInterestHint}
            </p>
          </div>

          {owner && (
            <div className="mt-4 rounded-2xl border border-cream-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">{t.businessDetail.listedBy}</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-brand-700 font-display text-sm font-bold text-white">
                  {initials(owner.name)}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-brand-900">{owner.name}</p>
                  {owner.company && <p className="text-ink/55">{owner.company}</p>}
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function initials(name?: string) {
  if (!name) return "?";
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}
