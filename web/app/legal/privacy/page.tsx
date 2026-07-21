"use client";

import { LegalShell } from "@/components/LegalShell";
import { useI18n } from "@/lib/i18n";

export default function PrivacyPage() {
  const { t } = useI18n();
  return (
    <LegalShell title={t.legal.privacyTitle}>
      <p>
        We process account data (name, email, role, location), listing content you submit, and technical
        logs needed to run the service. Payment data is handled by Stripe; we do not store full card numbers.
      </p>
      <p>
        Legal bases typically include contract performance (providing the marketplace), legitimate interests
        (security, product improvement), and consent where required (marketing emails).
      </p>
      <p>
        You may request access, correction, or deletion of personal data subject to legal retention needs
        (e.g. completed transaction records). Contact the operator to exercise rights under GDPR/UK GDPR
        where applicable.
      </p>
      <p>
        Cookies / local storage may be used for authentication and language preference. Browser extensions
        may inject additional data client-side; that is outside our control.
      </p>
    </LegalShell>
  );
}
