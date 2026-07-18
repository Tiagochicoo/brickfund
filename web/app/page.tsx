"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sprout, LineChart, Handshake, Store, Wallet, TrendingUp } from "lucide-react";
import { listBusinesses } from "@/lib/api";
import BusinessCard from "@/components/BusinessCard";
import { INVESTMENT_TYPE_STYLES, getInvestmentTypeMeta } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";
import type { Business, InvestmentType } from "@/lib/types";

export default function HomePage() {
  const { t } = useI18n();
  const [items, setItems] = useState<Business[]>([]);

  useEffect(() => {
    listBusinesses({ perPage: 6 }).then((d) => setItems(d.items));
  }, []);

  const types = Object.keys(INVESTMENT_TYPE_STYLES) as InvestmentType[];

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-32 top-0 h-[28rem] w-[28rem] rounded-full bg-gold-200/40 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-32 top-40 h-[24rem] w-[24rem] rounded-full bg-brand-200/50 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-brand-700 shadow-soft backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              {t.home.badge}
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-brand-950 sm:text-5xl lg:text-6xl">
              {t.home.heroTitle}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink/65 sm:text-lg">
              {t.home.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/businesses" className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-800 sm:w-auto">
                {t.home.exploreOpportunities}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/register" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cream-200 bg-white px-6 py-3.5 text-sm font-semibold text-brand-800 shadow-soft transition-all hover:bg-cream-100 sm:w-auto">
                {t.home.raiseCapital}
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat value="€4.2M" label={t.home.statRaised} />
            <Stat value="120+" label={t.home.statBusinesses} />
            <Stat value="800+" label={t.home.statInvestors} />
            <Stat value="63%" label={t.home.statFillRate} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-600">{t.home.liveOpportunities}</p>
            <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-brand-950">{t.home.featuredTitle}</h2>
          </div>
          <Link href="/businesses" className="group inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800">
            {t.home.viewAll}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((b) => <BusinessCard key={b.id} business={b} />)}
        </div>
      </section>

      <section className="border-y border-cream-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-brand-950">{t.home.typesTitle}</h2>
            <p className="mx-auto mt-3 max-w-xl text-ink/60">{t.home.typesSubtitle}</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {types.map((type) => {
              const meta = getInvestmentTypeMeta(type, t);
              return (
                <div key={type} className="flex flex-col items-center rounded-2xl border border-cream-200 bg-cream-50 p-5 text-center">
                  <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset px-3 py-1.5 text-xs ${meta.pill}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-ink/60">{meta.blurb}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-gold-600">{t.home.howStep}</p>
          <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-brand-950">{t.home.howTitle}</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Step n="01" icon={<Store className="h-6 w-6" />} title={t.home.step1Title} body={t.home.step1Body} />
          <Step n="02" icon={<Handshake className="h-6 w-6" />} title={t.home.step2Title} body={t.home.step2Body} />
          <Step n="03" icon={<Wallet className="h-6 w-6" />} title={t.home.step3Title} body={t.home.step3Body} />
        </div>
      </section>

      <section id="for-investors" className="border-y border-cream-200 bg-brand-950 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-400">{t.home.investorBadge}</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t.home.investorTitle}</h2>
            <p className="mt-4 max-w-md text-white/65">{t.home.investorBody}</p>
            <Link href="/register" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gold-400 px-6 py-3.5 text-sm font-semibold text-brand-950 transition-all hover:bg-gold-300">
              {t.home.startInvesting}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Perk icon={<ShieldCheck className="h-5 w-5" />} title={t.home.perkVetted} body={t.home.perkVettedBody} />
            <Perk icon={<LineChart className="h-5 w-5" />} title={t.home.perkReturns} body={t.home.perkReturnsBody} />
            <Perk icon={<Sprout className="h-5 w-5" />} title={t.home.perkImpact} body={t.home.perkImpactBody} />
            <Perk icon={<TrendingUp className="h-5 w-5" />} title={t.home.perkFlexible} body={t.home.perkFlexibleBody} />
          </div>
        </div>
      </section>

      <section id="for-businesses" className="border-y border-cream-200 bg-brand-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-400">{t.home.businessBadge}</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl text-white">{t.home.businessTitle}</h2>
            <p className="mt-4 max-w-2xl mx-auto text-white/65">{t.home.businessBody}</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, 3).map((b) => <BusinessCard key={b.id} business={b} />)}
          </div>
          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register" className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold-400 px-6 py-3.5 text-sm font-semibold text-brand-950 shadow-soft transition-all hover:bg-gold-300 sm:w-auto">
              {t.home.startRaising}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/businesses" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gold-400/30 bg-white/5 px-6 py-3.5 text-sm font-semibold text-gold-400 shadow-soft transition-all hover:bg-white/10 sm:w-auto">
              {t.home.viewAll}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 px-6 py-14 text-center shadow-card sm:px-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-400/20 blur-3xl" aria-hidden="true" />
          <h2 className="relative font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">{t.home.ctaTitle}</h2>
          <p className="relative mx-auto mt-3 max-w-md text-white/70">{t.home.ctaBody}</p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register" className="w-full rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-brand-800 transition-all hover:bg-cream-100 sm:w-auto">
              {t.home.ctaCreate}
            </Link>
            <Link href="/businesses" className="w-full rounded-xl border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10 sm:w-auto">
              {t.home.ctaBrowse}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-cream-200 bg-white/70 px-4 py-4 text-center shadow-soft backdrop-blur">
      <p className="font-display text-2xl font-semibold text-brand-800">{value}</p>
      <p className="mt-0.5 text-xs text-ink/55">{label}</p>
    </div>
  );
}

function Step({ n, icon, title, body }: { n: string; icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="relative rounded-2xl border border-cream-200 bg-white p-6 shadow-soft">
      <span className="absolute right-5 top-5 font-display text-3xl font-semibold text-cream-200">{n}</span>
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700">{icon}</div>
      <h3 className="mt-4 font-display text-lg font-semibold text-brand-900">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{body}</p>
    </div>
  );
}

function Perk({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold-400/20 text-gold-300">{icon}</div>
      <h3 className="mt-3 font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-white/55">{body}</p>
    </div>
  );
}
