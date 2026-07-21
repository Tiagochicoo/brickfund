"use client";

import { LegalShell } from "@/components/LegalShell";
import { useI18n } from "@/lib/i18n";

export default function TermsPage() {
  const { t } = useI18n();
  return (
    <LegalShell title={t.legal.termsTitle}>
      <p>
        Brickfund provides software that helps local businesses present funding opportunities and helps
        investors discover them. By using the site you agree to use it lawfully and not to misrepresent
        your identity, finances, or authority to act.
      </p>
      <p>
        Listings and deal materials are provided by users. Brickfund does not guarantee completeness,
        accuracy, or investment suitability. Platform fees may apply on funded deals as disclosed at the
        time of the transaction.
      </p>
      <p>
        Escrow, payments, and e-signature features are provided via third parties (e.g. Stripe, Documenso).
        Their terms also apply when you use those features.
      </p>
      <p>
        We may suspend accounts that abuse the platform, attempt fraud, or violate applicable law.
        Contact: the site operator via the channels published on brick-fund.com.
      </p>
    </LegalShell>
  );
}
