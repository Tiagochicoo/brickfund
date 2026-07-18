"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui";
import { useAuth } from "@/lib/auth";

export default function SellerOnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
      </div>
    );
  }
  if (!user) {
    router.replace("/login?next=/sellers/onboarding");
    return null;
  }
  if (user.role !== "business") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-brand-900">Businesses only</h1>
        <p className="mt-2 text-sm text-ink/60">
          Only business accounts can receive investment funds and need Stripe Connect onboarding.
        </p>
      </div>
    );
  }

  async function start() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/sellers/onboard", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
        <ShieldCheck className="h-3.5 w-3.5" /> Stripe Connect
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-brand-950">
        Receive payouts
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-ink/65">
        We use Stripe Connect to route investment funds to your bank account. Stripe handles
        identity verification and bank details — Brickfund never sees them. Required before any
        deal can release funds to you.
      </p>

      <ul className="mt-6 space-y-2 text-sm text-ink/70">
        <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-600" /> Free to set up — no monthly fees.</li>
        <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-600" /> Funds released only after both parties confirm handover.</li>
        <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-600" /> Take ~5 minutes — have your business ID and bank info ready.</li>
      </ul>

      {error && <p className="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

      <Button onClick={start} disabled={busy} className="mt-6">
        {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Redirecting…</> : "Start Stripe onboarding"}
      </Button>
    </div>
  );
}
