"use client";

import { LegalShell } from "@/components/LegalShell";
import { useI18n } from "@/lib/i18n";

export default function TermsPage() {
  const { t } = useI18n();
  return (
    <LegalShell title={t.legal.termsTitle}>
      <h2>1. What Brickfund is</h2>
      <p>
        Brickfund is a discovery platform. We help local businesses present funding opportunities
        and help investors find them. That is all we do.
      </p>
      <h2>2. What Brickfund is not</h2>
      <p>
        Brickfund is not a middleman, escrow agent, payment processor, or deal facilitator. We do not:
      </p>
      <ul>
        <li>Process payments or hold funds.</li>
        <li>Verify or guarantee the accuracy of any listing.</li>
        <li>Facilitate, negotiate, or structure any deal.</li>
        <li>Provide legal, financial, or investment advice.</li>
        <li>Take responsibility for any outcome of any interaction between users.</li>
      </ul>
      <h2>3. All deals happen directly between you</h2>
      <p>
        Any investment, loan, or agreement you make is entirely between you and the other party.
        Brickfund has zero responsibility for any deal, terms, money transfer, or outcome.
        You deal directly with each other at your own risk.
      </p>
      <h2>4. Your responsibility</h2>
      <p>
        You are responsible for your own decisions. Do your own due diligence. Verify information
        independently. Do not invest more than you can afford to lose.
      </p>
      <h2>5. Information shared on the platform</h2>
      <p>
        All information shared on Brickfund is the sole responsibility of the users who share it.
        Businesses control what they publish. Investors control what they share about themselves.
        Brickfund does not verify or endorse any information.
      </p>
      <h2>6. Account suspension</h2>
      <p>
        We may suspend accounts that abuse the platform, attempt fraud, or violate applicable law.
      </p>
      <h2>7. Contact</h2>
      <p>
        Contact the site operator via the channels published on brick-fund.com.
      </p>
    </LegalShell>
  );
}
