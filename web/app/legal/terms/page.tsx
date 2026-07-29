"use client";

import { LegalShell } from "@/components/LegalShell";
import { useI18n } from "@/lib/i18n";

export default function TermsPage() {
  const { t } = useI18n();
  return (
    <LegalShell title={t.legal.termsTitle}>
      <p>{t.legal.termsS1}</p>
      <p>{t.legal.termsS2}</p>
      <ul>
        <li>{t.legal.termsS2Bullet1}</li>
        <li>{t.legal.termsS2Bullet2}</li>
        <li>{t.legal.termsS2Bullet3}</li>
        <li>{t.legal.termsS2Bullet4}</li>
        <li>{t.legal.termsS2Bullet5}</li>
      </ul>
      <p>{t.legal.termsS3}</p>
      <p>{t.legal.termsS4}</p>
      <p>{t.legal.termsS5}</p>
      <p>{t.legal.termsS6}</p>
      <p>{t.legal.termsS7}</p>
    </LegalShell>
  );
}
