"use client";

import { LegalShell } from "@/components/LegalShell";
import { useI18n } from "@/lib/i18n";

export default function RiskPage() {
  const { t } = useI18n();
  return (
    <LegalShell title={t.legal.riskTitle}>
      <p>
        <strong>Capital at risk.</strong> Investing in private businesses can result
        in partial or total loss of capital. Returns are not guaranteed. Past
        performance is not indicative of future results.
      </p>
      <p>
        Investment types may include loans, equity, revenue share, or convertible
        notes. Each carries different legal, tax, and liquidity characteristics.
        Some offerings may only be available to professional or sophisticated
        investors under local securities law.
      </p>
      <p>
        <strong>Brickfund is a discovery platform only.</strong> We are not a bank,
        broker-dealer, or collective investment scheme. We do not verify the
        financial claims made by businesses on this platform. All information
        shared by businesses is their sole responsibility.
      </p>
      <p>
        Independent legal, tax, and financial advice is strongly recommended before
        making any investment. You deal directly with the other party at your own
        risk. Brickfund accepts no responsibility for any outcome.
      </p>
    </LegalShell>
  );
}
