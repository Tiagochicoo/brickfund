import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Sprout,
  LineChart,
  Handshake,
  Store,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { listBusinesses } from "@/lib/api";
import BusinessCard from "@/components/BusinessCard";
import InvestmentPill from "@/components/InvestmentPill";
import { INVESTMENT_TYPES } from "@/lib/constants";
import type { InvestmentType } from "@/lib/types";

export default async function HomePage() {
  const { items } = await listBusinesses({ perPage: 6 });

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-32 top-0 h-[28rem] w-[28rem] rounded-full bg-gold-200/40 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-32 top-40 h-[24rem] w-[24rem] rounded-full bg-brand-200/50 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-brand-700 shadow-soft backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              Main street meets venture capital
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-brand-950 sm:text-5xl lg:text-6xl">
              Invest in the businesses that build your neighborhood
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink/65 sm:text-lg">
              Brickfund connects profitable brick-and-mortar businesses with
              investors — from a restaurant expanding its terrace to a gym
              opening its doors.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/businesses"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-800 sm:w-auto"
              >
                Explore opportunities
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cream-200 bg-white px-6 py-3.5 text-sm font-semibold text-brand-800 shadow-soft transition-all hover:bg-cream-100 sm:w-auto"
              >
                Raise capital
              </Link>
            </div>
          </div>

          {/* Stat strip */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat value="€4.2M" label="Capital raised" />
            <Stat value="120+" label="Businesses funded" />
            <Stat value="800+" label="Active investors" />
            <Stat value="63%" label="Avg. fill rate" />
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-600">
              Live opportunities
            </p>
            <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-brand-950">
              Featured businesses
            </h2>
          </div>
          <Link
            href="/businesses"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((b) => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>
      </section>

      {/* Investment types */}
      <section className="border-y border-cream-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-brand-950">
              Every kind of deal, clearly labeled
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink/60">
              Each listing carries an investment-type pill so you always know
              what you&apos;re funding.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(INVESTMENT_TYPES) as InvestmentType[]).map((t) => (
              <div
                key={t}
                className="flex items-start gap-4 rounded-2xl border border-cream-200 bg-cream-50 p-5"
              >
                <InvestmentPill type={t} />
                <p className="text-sm leading-relaxed text-ink/60">
                  {INVESTMENT_TYPES[t].blurb}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-gold-600">
            How it works
          </p>
          <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-brand-950">
            From pitch to funding in three steps
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Step
            n="01"
            icon={<Store className="h-6 w-6" />}
            title="Businesses list"
            body="Owners create a listing with their story, numbers, and the type of capital they're raising."
          />
          <Step
            n="02"
            icon={<Handshake className="h-6 w-6" />}
            title="Investors connect"
            body="Browse vetted opportunities by category, location, and investment type — then reach out."
          />
          <Step
            n="03"
            icon={<Wallet className="h-6 w-6" />}
            title="Capital deployed"
            body="Agree terms and fund the growth. Track milestones and updates from your dashboard."
          />
        </div>
      </section>

      {/* For investors */}
      <section id="for-investors" className="border-y border-cream-200 bg-brand-950 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-400">
              For investors
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Build a portfolio of real, local businesses
            </h2>
            <p className="mt-4 max-w-md text-white/65">
              Back businesses you can actually visit. Diversify across loans,
              equity, and revenue share — with transparent terms and real-world
              assets behind every deal.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gold-400 px-6 py-3.5 text-sm font-semibold text-brand-950 transition-all hover:bg-gold-300"
            >
              Start investing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Perk
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Vetted listings"
              body="Every business is reviewed before going live."
            />
            <Perk
              icon={<LineChart className="h-5 w-5" />}
              title="Transparent returns"
              body="Clear terms, milestones, and reporting."
            />
            <Perk
              icon={<Sprout className="h-5 w-5" />}
              title="Local impact"
              body="Fund the main street you walk every day."
            />
            <Perk
              icon={<TrendingUp className="h-5 w-5" />}
              title="Flexible deals"
              body="From seed equity to short-term loans."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 px-6 py-14 text-center shadow-card sm:px-12">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-400/20 blur-3xl"
            aria-hidden="true"
          />
          <h2 className="relative font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ready to grow on main street?
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-white/70">
            Whether you&apos;re raising or investing, your next move starts here.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="w-full rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-brand-800 transition-all hover:bg-cream-100 sm:w-auto"
            >
              Create your account
            </Link>
            <Link
              href="/businesses"
              className="w-full rounded-xl border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10 sm:w-auto"
            >
              Browse listings
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

function Step({
  n,
  icon,
  title,
  body,
}: {
  n: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="relative rounded-2xl border border-cream-200 bg-white p-6 shadow-soft">
      <span className="absolute right-5 top-5 font-display text-3xl font-semibold text-cream-200">
        {n}
      </span>
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-brand-900">
        {title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{body}</p>
    </div>
  );
}

function Perk({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold-400/20 text-gold-300">
        {icon}
      </div>
      <h3 className="mt-3 font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-white/55">{body}</p>
    </div>
  );
}
