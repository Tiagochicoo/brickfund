"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, FileText, Loader2, ShieldCheck, TrendingUp } from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { formatCurrency } from "@/lib/constants";
import { DEAL_STATE_LABELS } from "@/lib/deal-labels";
import type { DealRow } from "@/lib/server/types";
import { StateBadge } from "@/components/deals/StateBadge";
import { DealActionsClient } from "@/components/deals/DealActionsClient";

function DealsPageInner() {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const sp = useSearchParams();
  const created = sp.get("created");
  const [deals, setDeals] = useState<DealRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/api/deals");
        const data = (await res.json()) as { deals?: DealRow[]; error?: string };
        if (!res.ok) throw new Error(data.error ?? t.deals.loadError);
        if (!cancelled) setDeals(data.deals ?? []);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : t.deals.loadError);
          setDeals([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
      </div>
    );
  }

  const list = deals ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t.deals.pageBadge}
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-brand-950">
            {t.deals.pageTitle}
          </h1>
          <p className="mt-1 text-ink/60">
            {t.deals.pageSubtitle}
          </p>
        </div>
        <Link
          href="/businesses"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-800"
        >
          <TrendingUp className="h-4 w-4" />
          {t.deals.findOpportunity}
        </Link>
      </div>

      {created && (
        <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-800">
          {t.deals.dealCreated}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {deals === null ? (
        <div className="mt-8 flex items-center justify-center py-14">
          <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
        </div>
      ) : list.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-cream-200 bg-white py-14 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <FileText className="h-6 w-6" />
          </div>
          <p className="mt-3 font-display text-lg font-semibold text-brand-900">{t.deals.emptyTitle}</p>
          <p className="mt-1 text-sm text-ink/55">
            {t.deals.emptyBody}
          </p>
          <Link
            href="/businesses"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white"
          >
            {t.deals.browseBusinesses}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {list.map((d) => {
            const role = d.buyer === user.id ? "buyer" : "seller";
            const counterparty = role === "buyer" ? d.expand?.seller : d.expand?.buyer;
            return (
              <Link
                key={d.id}
                href={`/deals/${d.id}`}
                className="block rounded-2xl border border-cream-200 bg-white p-5 shadow-soft transition-all hover:border-brand-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-display text-lg font-semibold text-brand-900">{d.name}</div>
                    <div className="mt-1 text-sm text-ink/55">
                      {formatCurrency(d.priceCents / 100)} {(d.currency || "eur").toUpperCase()} ·
                      {t.deals.youAreThe} <b>{role}</b>
                      {counterparty && <> · {t.deals.with} {counterparty.name}</>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StateBadge state={d.state} />
                    <span className="text-xs text-ink/40">{DEAL_STATE_LABELS[d.state]}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <DealActionsClient />
    </div>
  );
}

export default function DealsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
        </div>
      }
    >
      <DealsPageInner />
    </Suspense>
  );
}
