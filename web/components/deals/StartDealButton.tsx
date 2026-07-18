"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { formatCurrency } from "@/lib/constants";

export function StartDealButton({ businessId, businessName, suggestedAmount }: {
  businessId: string;
  businessName: string;
  suggestedAmount: number;
}) {
  const { user } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(suggestedAmount);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;
  if (user.role !== "investor") return null;

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          amountCents: Math.round(amount * 100),
          note,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      router.push(`/deals/${data.deal.id}?created=1`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-gold-700"
      >
        <Sparkles className="h-4 w-4" />
        {t.deals.startInvestmentDeal}
      </button>
    );
  }

  return (
    <div className="mt-3 rounded-2xl border border-gold-200 bg-gold-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-gold-800">{t.deals.startDeal}</p>
      <h3 className="mt-1 font-display text-lg font-semibold text-brand-950">{businessName}</h3>
      <p className="mt-1 text-xs text-ink/60">
        {t.deals.processDescription.replace("{amount}", formatCurrency(amount))}
      </p>

      <label className="mt-4 block text-sm font-medium text-brand-900">{t.deals.investmentAmountLabel}</label>
      <input
        type="number"
        min={10}
        step={100}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="mt-1 w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
      />

      <label className="mt-3 block text-sm font-medium text-brand-900">{t.deals.noteToBusinessLabel}</label>
      <textarea
        rows={2}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={t.deals.noteToBusinessPlaceholder}
        className="mt-1 w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
      />

      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

      <div className="mt-4 flex gap-2">
        <Button variant="outline" onClick={() => setOpen(false)} disabled={busy}>{t.deals.cancel}</Button>
        <Button onClick={submit} disabled={busy || amount < 10}>
          {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> {t.deals.creating}</> : t.deals.createDeal}
        </Button>
      </div>
    </div>
  );
}