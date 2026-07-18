import Link from "next/link";
import { ArrowRight, FileText, ShieldCheck, TrendingUp } from "lucide-react";
import { listBusinesses } from "@/lib/api";
import { formatCurrency } from "@/lib/constants";
import { getPb } from "@/lib/pb";
import type { DealRow } from "@/lib/server/types";
import { DEAL_STATE_LABELS } from "@/lib/server/deals";
import { StateBadge } from "@/components/deals/StateBadge";
import { DealActionsClient } from "@/components/deals/DealActionsClient";

export const dynamic = "force-dynamic";

async function getDeals(authCookie: string | null): Promise<DealRow[]> {
  if (!authCookie) return [];
  try {
    const pb = getPb();
    pb.authStore.loadFromCookie(authCookie);
    if (!pb.authStore.isValid) return [];
    const userId = (pb.authStore.model as { id?: string } | null)?.id;
    if (!userId) return [];
    const res = await pb.collection("deals").getList<DealRow>(1, 100, {
      filter: `buyer = "${userId}" || seller = "${userId}"`,
      sort: "-updated",
      expand: "business,buyer,seller",
    });
    return res.items as DealRow[];
  } catch {
    return [];
  }
}

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const sp = await searchParams;
  const cookieHeader = typeof document === "undefined" ? null : document.cookie;
  const deals = await getDeals(cookieHeader);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            Escrow-protected deals
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-brand-950">
            Your deals
          </h1>
          <p className="mt-1 text-ink/60">
            LOI → APA → escrow → handover. Funds held by Stripe until both parties confirm.
          </p>
        </div>
        <Link
          href="/businesses"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-800"
        >
          <TrendingUp className="h-4 w-4" />
          Find an opportunity
        </Link>
      </div>

      {sp.created && (
        <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-800">
          Deal created. Send the Letter of Intent to get started.
        </div>
      )}

      {deals.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-cream-200 bg-white py-14 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <FileText className="h-6 w-6" />
          </div>
          <p className="mt-3 font-display text-lg font-semibold text-brand-900">No active deals</p>
          <p className="mt-1 text-sm text-ink/55">
            Browse businesses and start a deal to begin the escrow flow.
          </p>
          <Link
            href="/businesses"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Browse businesses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {deals.map((d) => {
            const role = (d.expand?.buyer?.id ?? d.buyer) ? "buyer" : "seller";
            const counterparty =
              role === "buyer" ? d.expand?.seller : d.expand?.buyer;
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
                      {formatCurrency(d.priceCents / 100)} USD ·
                      You are the <b>{role}</b>
                      {counterparty && <> · with {counterparty.name}</>}
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
