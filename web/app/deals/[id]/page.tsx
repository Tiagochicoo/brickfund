import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, ShieldCheck, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { getPb } from "@/lib/pb";
import type { DealEventRow, DealRow } from "@/lib/server/types";
import { formatCurrency } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { StateBadge } from "@/components/deals/StateBadge";
import { DealActions } from "@/components/deals/DealActions";
import { DealTimeline } from "@/components/deals/DealTimeline";

export const dynamic = "force-dynamic";

async function loadDeal(dealId: string): Promise<{ deal: DealRow; events: DealEventRow[]; userId: string } | null> {
  try {
    const pb = getPb();
    // Server-side, we read cookies from the request via headers()
    const cookieHeader = await readCookieHeader();
    pb.authStore.loadFromCookie(cookieHeader ?? "");
    if (!pb.authStore.isValid) return null;
    const userId = (pb.authStore.model as { id?: string } | null)?.id;
    if (!userId) return null;

    const deal = await pb.collection("deals").getOne<DealRow>(dealId, {
      expand: "business,buyer,seller",
    });
    if (deal.buyer !== userId && deal.seller !== userId) return null;

    const events = await pb.collection("deal_events").getFullList<DealEventRow>({
      filter: `deal = "${dealId}"`,
      sort: "created",
      expand: "actor",
    });

    return { deal, events, userId };
  } catch {
    return null;
  }
}

// headers() is async in Next.js 16.
async function readCookieHeader(): Promise<string | null> {
  const { headers } = await import("next/headers");
  const h = await headers();
  return h.get("cookie");
}

export default async function DealRoom({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await loadDeal(id);
  if (!data) notFound();

  const { deal, events, userId } = data;
  const role = deal.buyer === userId ? "buyer" : "seller";

  const business = deal.expand?.business;
  const counterparty = role === "buyer" ? deal.expand?.seller : deal.expand?.buyer;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        href="/deals"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 transition-colors hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" />
        All deals
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-ink/55">
            <FileText className="h-4 w-4" />
            <span>You are the <b>{role}</b></span>
            {counterparty && <span>· with {counterparty.name}</span>}
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-950 sm:text-4xl">
            {deal.name}
          </h1>
          {business && (
            <Link
              href={`/businesses/${business.id}`}
              className="mt-1 inline-block text-sm text-brand-700 underline-offset-2 hover:underline"
            >
              {business.name} · {business.location}
            </Link>
          )}
        </div>
        <StateBadge state={deal.state} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          {deal.description && (
            <div className="rounded-2xl border border-cream-200 bg-white p-5">
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink/70">{deal.description}</p>
            </div>
          )}

          <DealActions
            deal={{
              id: deal.id,
              state: deal.state,
              role,
              hasLoi: !!deal.loiDocumentId,
              hasApa: !!deal.apaDocumentId,
              buyerConfirmedAt: deal.buyerConfirmedAt,
              sellerConfirmedAt: deal.sellerConfirmedAt,
            }}
          />

          <DealTimeline events={events} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-cream-200 bg-white p-5 shadow-soft">
            <p className="text-xs font-medium uppercase tracking-wider text-ink/45">Investment</p>
            <p className="mt-1 font-display text-2xl font-semibold text-brand-900">
              {formatCurrency(deal.priceCents / 100)}
            </p>
            <dl className="mt-4 space-y-2 border-t border-cream-200 pt-4 text-sm">
              <Row label="Platform fee" value={formatCurrency(deal.platformFeeCents / 100)} />
              <Row label="You pay (as buyer)" value={formatCurrency((deal.priceCents + deal.platformFeeCents) / 100)} />
              <Row label="Currency" value={deal.currency.toUpperCase()} />
              <Row label="Created" value={formatDate(deal.created)} />
              {deal.fundsHeldAt && <Row label="Escrow funded" value={formatDate(deal.fundsHeldAt)} />}
              {deal.transferId && (
                <Row
                  label="Released"
                  value={<span className="font-medium text-brand-700">Transfer {deal.transferId.slice(0, 14)}…</span>}
                />
              )}
            </dl>
          </div>

          <div className="rounded-2xl border border-cream-200 bg-cream-50 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-brand-900">
              <ShieldCheck className="h-4 w-4 text-brand-600" />
              How escrow protects you
            </h3>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-ink/65">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-brand-600" />
                Funds held on Stripe platform balance — not released until both confirm.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-brand-600" />
                Legally binding LOI + APA signed via Documenso (ESIGN / eIDAS compliant).
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 text-gold-600" />
                Open a dispute any time before release to freeze funds for review.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-ink/55">{label}</dt>
      <dd className="font-medium text-brand-900">{value}</dd>
    </div>
  );
}
