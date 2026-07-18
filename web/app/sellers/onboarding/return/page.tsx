import Link from "next/link";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { stripe } from "@/lib/server/stripe";
import { getPb } from "@/lib/pb";
import type { StripeAccountRow } from "@/lib/server/types";

export const dynamic = "force-dynamic";

export default async function OnboardingReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ account?: string }>;
}) {
  const { account } = await searchParams;
  if (!account) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-gold-600" />
        <h1 className="mt-3 font-display text-xl font-semibold text-brand-900">Missing account</h1>
        <Link href="/sellers/onboarding" className="mt-4 inline-block rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white">
          Resume onboarding
        </Link>
      </div>
    );
  }

  // Fail-closed pattern: don't trust the redirect, re-check with Stripe.
  const acct = await stripe.accounts.retrieve(account);
  const ready =
    !!acct.details_submitted &&
    (acct.requirements?.currently_due ?? []).length === 0 &&
    (acct.requirements?.eventually_due ?? []).length === 0;

  try {
    const pb = getPb();
    const record = await pb.collection("stripe_accounts").getFirstListItem<StripeAccountRow>(
      `stripeAccountId = "${account}"`
    );
    await pb.collection("stripe_accounts").update(record.id, {
      detailsSubmitted: !!acct.details_submitted,
      payoutsEnabled: ready && acct.payouts_enabled === true,
    });
  } catch {
    // best-effort — webhook will catch up
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-cream-200 bg-white p-6 shadow-soft">
        {ready ? (
          <>
            <CheckCircle2 className="h-8 w-8 text-brand-600" />
            <h1 className="mt-3 font-display text-2xl font-semibold text-brand-900">You&apos;re ready</h1>
            <p className="mt-2 text-sm text-ink/65">
              Your Stripe account is verified and payouts are enabled. You can now receive funds from closed deals.
            </p>
          </>
        ) : (
          <>
            <AlertTriangle className="h-8 w-8 text-gold-600" />
            <h1 className="mt-3 font-display text-2xl font-semibold text-brand-900">Still in progress</h1>
            <p className="mt-2 text-sm text-ink/65">
              Stripe is still waiting on information. You can complete onboarding any time — your listings stay live.
            </p>
            <ul className="mt-3 list-disc pl-5 text-sm text-ink/65">
              {(acct.requirements?.currently_due ?? []).slice(0, 5).map((r) => <li key={r}>{r}</li>)}
            </ul>
            <Link href="/sellers/onboarding" className="mt-5 inline-block rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white">
              Resume onboarding
            </Link>
          </>
        )}
        <div className="mt-6 border-t border-cream-200 pt-5">
          <Link href="/deals" className="text-sm font-semibold text-brand-700 hover:underline">Back to deals →</Link>
        </div>
      </div>
    </div>
  );
}
