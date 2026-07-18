"use client";

import { useEffect, useRef, useState } from "react";
import type { Stripe as StripeType } from "@stripe/stripe-js";
import { loadStripe } from "@/lib/stripe-loader";
import { FileText, PenLine, CreditCard, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import type { DealState } from "@/lib/server/types";

type Props = {
  deal: {
    id: string;
    state: DealState;
    role: "buyer" | "seller" | "admin";
    hasLoi: boolean;
    hasApa: boolean;
    buyerConfirmedAt: string | null;
    sellerConfirmedAt: string | null;
  };
};

export function DealActions({ deal }: Props) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fundResult, setFundResult] = useState<{ clientSecret: string; publishableKey: string; amount: number } | null>(null);

  async function call(url: string, body?: unknown, method = "POST"): Promise<{ ok: boolean; data: Record<string, unknown> }> {
    setBusy(url);
    setError(null);
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = (await res.json()) as Record<string, unknown>;
    setBusy(null);
    if (!res.ok) setError(String(data.error ?? "Action failed"));
    return { ok: res.ok, data };
  }

  async function actionSignLoi() {
    await call(`/api/deals/${deal.id}/sign-loi`);
    window.dispatchEvent(new Event("deal-updated"));
    location.reload();
  }
  async function actionSignApa() {
    await call(`/api/deals/${deal.id}/sign-apa`);
    location.reload();
  }
  async function loadSignUrl(doc: "loi" | "apa") {
    setBusy(`sign-${doc}`);
    setError(null);
    const res = await fetch(`/api/deals/${deal.id}/signing-url/${doc}`);
    const data = (await res.json()) as { url?: string; error?: string };
    setBusy(null);
    if (res.ok && data.url) window.open(data.url, "_blank", "noopener,noreferrer");
    else setError(String(data.error ?? "Could not open signing page"));
  }
  async function actionFund() {
    const { ok, data } = await call(`/api/deals/${deal.id}/fund`);
    if (ok) {
      setFundResult({
        clientSecret: String(data.clientSecret),
        publishableKey: String(data.publishableKey),
        amount: Number(data.amount),
      });
    }
  }
  async function actionConfirm() {
    await call(`/api/deals/${deal.id}/confirm-handover`, { role: deal.role });
    location.reload();
  }
  async function actionDispute() {
    if (!confirm("Open a dispute? Funds will be frozen pending review.")) return;
    await call(`/api/deals/${deal.id}/resolve`, { action: "dispute" });
    location.reload();
  }
  async function actionRefund() {
    if (!confirm("Refund the buyer? This returns funds from escrow.")) return;
    await call(`/api/deals/${deal.id}/resolve`, { action: "refund" });
    location.reload();
  }

  return (
    <div className="rounded-2xl border border-cream-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-ink/45">Next step</p>
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}

      {deal.state === "negotiating" && (
        <ActionButton onClick={actionSignLoi} disabled={!!busy} icon={<FileText className="h-4 w-4" />}>
          Send Letter of Intent
        </ActionButton>
      )}

      {deal.state === "loi_sent" && deal.hasLoi && (
        <ActionButton onClick={() => loadSignUrl("loi")} disabled={!!busy} icon={<PenLine className="h-4 w-4" />}>
          Review & sign LOI
        </ActionButton>
      )}

      {deal.state === "loi_signed" && (
        <ActionButton onClick={actionSignApa} disabled={!!busy} icon={<FileText className="h-4 w-4" />}>
          Send Asset Purchase Agreement
        </ActionButton>
      )}

      {deal.state === "apa_sent" && deal.hasApa && (
        <ActionButton onClick={() => loadSignUrl("apa")} disabled={!!busy} icon={<PenLine className="h-4 w-4" />}>
          Review & sign APA
        </ActionButton>
      )}

      {deal.state === "apa_signed" && deal.role === "buyer" && (
        <ActionButton onClick={actionFund} disabled={!!busy} icon={<CreditCard className="h-4 w-4" />}>
          Fund escrow
        </ActionButton>
      )}

      {fundResult && (
        <StripePayment
          clientSecret={fundResult.clientSecret}
          publishableKey={fundResult.publishableKey}
          amount={fundResult.amount}
          dealId={deal.id}
        />
      )}

      {(deal.state === "funds_held" || deal.state === "handover_confirmed") && (
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-cream-50 px-4 py-2 text-sm">
            <span className="flex items-center gap-2 text-ink/65">
              <CheckCircle2 className={`h-4 w-4 ${deal.buyerConfirmedAt ? "text-brand-600" : "text-ink/30"}`} />
              Buyer
            </span>
            <span className="flex items-center gap-2 text-ink/65">
              <CheckCircle2 className={`h-4 w-4 ${deal.sellerConfirmedAt ? "text-brand-600" : "text-ink/30"}`} />
              Seller
            </span>
          </div>
          <ActionButton onClick={actionConfirm} disabled={!!busy} variant="primary">
            {deal.role === "buyer"
              ? deal.buyerConfirmedAt ? "Re-confirm handover" : "I confirm handover"
              : deal.sellerConfirmedAt ? "Re-confirm handover" : "I confirm handover"}
          </ActionButton>
          {deal.state === "funds_held" && (
            <ActionButton onClick={actionDispute} disabled={!!busy} variant="outline">
              <AlertTriangle className="h-4 w-4" /> Open a dispute
            </ActionButton>
          )}
        </div>
      )}

      {deal.state === "completed" && (
        <p className="mt-3 flex items-center gap-2 text-sm font-medium text-brand-700">
          <CheckCircle2 className="h-4 w-4" /> Deal complete — funds released.
        </p>
      )}
      {deal.state === "declined" && <p className="mt-3 text-sm text-rose-600">Deal declined.</p>}
      {deal.state === "refunded" && <p className="mt-3 text-sm text-rose-600">Escrow refunded to buyer.</p>}
      {deal.state === "disputed" && deal.role === "admin" && (
        <ActionButton onClick={actionRefund} disabled={!!busy} variant="outline">
          Refund buyer (admin)
        </ActionButton>
      )}

      {busy && <p className="mt-3 flex items-center gap-1.5 text-xs text-ink/45"><Loader2 className="h-3 w-3 animate-spin" /> Working…</p>}
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  icon,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void | Promise<void>;
  disabled?: boolean;
  icon?: React.ReactNode;
  variant?: "primary" | "outline";
}) {
  const cls = variant === "primary"
    ? "bg-brand-700 text-white shadow-soft hover:bg-brand-800"
    : "border border-cream-200 bg-white text-brand-800 hover:bg-cream-100";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${cls}`}
    >
      {icon}
      {children}
    </button>
  );
}

function StripePayment({
  clientSecret,
  publishableKey,
  amount,
  dealId,
}: {
  clientSecret: string;
  publishableKey: string;
  amount: number;
  dealId: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [stripeInstance, setStripeInstance] = useState<StripeType | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadStripe(publishableKey).then((s) => {
      if (!cancelled && s) setStripeInstance(s);
    });
    return () => { cancelled = true; };
  }, [publishableKey]);

  useEffect(() => {
    if (!stripeInstance || !ref.current) return;
    const els = stripeInstance.elements();
    const pe = els.create("payment");
    pe.mount(ref.current);
    return () => { pe.destroy(); };
  }, [stripeInstance]);

  async function pay() {
    if (!stripeInstance) return;
    setStatus("processing");
    const { error } = await stripeInstance.confirmPayment({
      clientSecret,
      confirmParams: { return_url: `${window.location.origin}/deals/${dealId}?funded=1` },
    });
    if (error) setStatus("error");
    else setStatus("done");
  }

  return (
    <div className="mt-4 space-y-3 border-t border-cream-200 pt-4">
      <div className="text-sm text-ink/65">
        Funding escrow with <b>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100)}</b>.
        Stripe holds the funds until both parties confirm handover.
      </div>
      <div ref={ref} />
      <button
        onClick={pay}
        disabled={!stripeInstance || status === "processing"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-800 disabled:opacity-60"
      >
        {status === "processing" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
        {status === "processing" ? "Processing…" : "Pay now"}
      </button>
      {status === "error" && <p className="text-sm text-rose-600">Payment failed — check card details.</p>}
      {status === "done" && <p className="text-sm text-brand-700">Redirecting…</p>}
    </div>
  );
}
