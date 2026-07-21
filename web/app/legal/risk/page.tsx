"use client";

import { LegalShell } from "@/components/LegalShell";
import { useI18n } from "@/lib/i18n";

export default function RiskPage() {
  const { t } = useI18n();
  return (
    <LegalShell title={t.legal.riskTitle}>
      <p>
        <strong>Capital at risk.</strong> Investing in private businesses can result in partial or total
        loss of capital. Returns are not guaranteed. Past performance (including demo or illustrative
        figures on the site) is not indicative of future results.
      </p>
      <p>
        Instruments may include loans, equity, revenue share, or convertible notes. Each carries different
        legal, tax, and liquidity characteristics. Some offerings may only be available to professional or
        sophisticated investors under local securities law.
      </p>
      <p>
        Brickfund is a technology marketplace. Unless explicitly stated in a regulated prospectus or license
        disclosure, Brickfund is not a bank, broker-dealer, or collective investment scheme. Independent legal,
        tax, and financial advice is recommended before committing funds.
      </p>
      <p>
        Escrow reduces certain settlement risks but does not eliminate business failure, fraud, operational,
        currency, or counterparty risk after release of funds.
      </p>
    </LegalShell>
  );
}
