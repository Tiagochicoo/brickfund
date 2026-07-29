"use client";

import { LegalShell } from "@/components/LegalShell";
import { useI18n } from "@/lib/i18n";

export default function RiskPage() {
  const { t } = useI18n();
  return (
    <LegalShell title={t.legal.riskTitle}>
      <p>
        <strong>{t.legal.riskP1Bold}</strong> {t.legal.riskP1}
      </p>
      <p>{t.legal.riskP2}</p>
      <p>
        <strong>{t.legal.riskP3Bold}</strong> {t.legal.riskP3}
      </p>
      <p>{t.legal.riskP4}</p>
    </LegalShell>
  );
}
