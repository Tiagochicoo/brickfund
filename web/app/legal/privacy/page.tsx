"use client";

import { LegalShell } from "@/components/LegalShell";
import { useI18n } from "@/lib/i18n";

export default function PrivacyPage() {
  const { t } = useI18n();
  return (
    <LegalShell title={t.legal.privacyTitle}>
      <h2>1. What we collect</h2>
      <p>
        We collect your name, email address, role (business or investor), location,
        and any content you submit to your profile or listings.
      </p>
      <h2>2. How we use your data</h2>
      <p>
        We use your data to provide the discovery platform. This includes showing your
        listing to investors, enabling interest notifications, and allowing private
        messaging between users who have connected.
      </p>
      <h2>3. What we do not do</h2>
      <p>
        We do not process payments. We do not store payment card numbers. We do not
        share your data with third parties for marketing purposes.
      </p>
      <h2>4. Legal basis</h2>
      <p>
        We process data based on contract performance (providing the platform),
        legitimate interests (security and improvement), and consent where required.
      </p>
      <h2>5. Your rights</h2>
      <p>
        You may request access, correction, or deletion of your personal data.
        Contact the operator to exercise your rights under GDPR or applicable law.
      </p>
      <h2>6. Cookies</h2>
      <p>
        We use cookies and local storage for authentication and language preference
        only. We do not use tracking cookies.
      </p>
    </LegalShell>
  );
}
