"use client";

import { LegalShell } from "@/components/LegalShell";
import { useI18n } from "@/lib/i18n";

export default function PrivacyPage() {
  const { t } = useI18n();
  return (
    <LegalShell title={t.legal.privacyTitle}>
      <h2>{t.legal.privacyS1Heading}</h2>
      <p>{t.legal.privacyS1}</p>
      <h2>{t.legal.privacyS2Heading}</h2>
      <p>{t.legal.privacyS2}</p>
      <h2>{t.legal.privacyS3Heading}</h2>
      <p>{t.legal.privacyS3}</p>
      <h2>{t.legal.privacyS4Heading}</h2>
      <p>{t.legal.privacyS4}</p>
      <h2>{t.legal.privacyS5Heading}</h2>
      <p>{t.legal.privacyS5}</p>
      <h2>{t.legal.privacyS6Heading}</h2>
      <p>{t.legal.privacyS6}</p>
    </LegalShell>
  );
}
