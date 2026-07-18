"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Store, TrendingUp, Plus, ArrowRight, Briefcase } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { getPb } from "@/lib/pb";
import BusinessCard from "@/components/BusinessCard";
import MyListingCard from "@/components/MyListingCard";
import { formatCurrency } from "@/lib/constants";
import type { Business } from "@/lib/types";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [mine, setMine] = useState<Business[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    const pb = getPb();
    (async () => {
      try {
        if (user.role === "business") {
          const res = await pb.collection("businesses").getList<Business>(1, 50, {
            filter: `owner = "${user.id}"`,
            sort: "-created",
          });
          setMine(res.items as unknown as Business[]);
        } else {
          const res = await pb.collection("businesses").getList<Business>(1, 3, {
            filter: "published = true",
            sort: "-fundingRaised",
          });
          setMine(res.items as unknown as Business[]);
        }
      } catch {
        setMine([]);
      } finally {
        setFetching(false);
      }
    })();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
      </div>
    );
  }

  const isBusiness = user.role === "business";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
            {isBusiness ? <Store className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
            {isBusiness ? t.dashboard.businessAccount : t.dashboard.investorAccount}
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-brand-950">
            {t.dashboard.welcome.replace("{name}", user.name.split(" ")[0])}
          </h1>
          <p className="mt-1 text-ink/60">
            {isBusiness ? t.dashboard.businessSubtitle : t.dashboard.investorSubtitle}
          </p>
        </div>
        {isBusiness && (
          <button
            disabled
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white opacity-70"
            title={t.dashboard.newListingHint}
          >
            <Plus className="h-4 w-4" />
            {t.dashboard.newListing}
          </button>
        )}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label={t.dashboard.accountType} value={isBusiness ? t.dashboard.businessAccount : t.dashboard.investorAccount} />
        <Card label={isBusiness ? t.dashboard.company : t.dashboard.firm} value={user.company || "—"} />
        {isBusiness ? (
          <>
            <Card label={t.dashboard.listings} value={String(mine.length)} />
            <Card label={t.dashboard.published} value={`${mine.filter((b) => b.published).length} / ${mine.length}`} />
          </>
        ) : (
          <>
            <Card label={t.dashboard.location} value={user.location || "—"} />
            <Card label={t.dashboard.budget} value={user.budgetMin || user.budgetMax ? `${formatCurrency(user.budgetMin ?? 0)}–${formatCurrency(user.budgetMax ?? 0)}` : "—"} />
          </>
        )}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-brand-900">
            {isBusiness ? t.dashboard.yourListings : t.dashboard.recommended}
          </h2>
          <Link href="/businesses" className="group inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800">
            {t.dashboard.exploreAll}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {fetching ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl border border-cream-200 bg-white" />
            ))}
          </div>
        ) : mine.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {isBusiness
              ? mine.map((b) => <MyListingCard key={b.id} business={b} onDelete={(id) => setMine((prev) => prev.filter((b) => b.id !== id))} />)
              : mine.map((b) => <BusinessCard key={b.id} business={b} />)}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-cream-200 bg-white py-14 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Briefcase className="h-6 w-6" />
            </div>
            <p className="mt-3 font-display text-lg font-semibold text-brand-900">
              {isBusiness ? t.dashboard.emptyBusinessTitle : t.dashboard.emptyInvestorTitle}
            </p>
            <p className="mt-1 text-sm text-ink/55">
              {isBusiness ? t.dashboard.emptyBusinessBody : t.dashboard.emptyInvestorBody}
            </p>
            <Link href="/businesses" className="mt-4 inline-block rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white">
              {isBusiness ? t.dashboard.exploreExamples : t.dashboard.browseOpportunities}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-cream-200 bg-white p-4 shadow-soft">
      <p className="text-xs font-medium uppercase tracking-wider text-ink/45">{label}</p>
      <p className="mt-1 truncate font-display text-lg font-semibold text-brand-900">{value}</p>
    </div>
  );
}
