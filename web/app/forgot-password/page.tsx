"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, MailCheck } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import { Button, ErrorNote, Input, Label } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
    } catch {
      setError(t.auth.createError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title={t.auth.resetTitle}
      subtitle={t.auth.resetSubtitle}
      footer={
        <>
          {t.auth.remembered}{" "}
          <Link href="/login" className="font-semibold text-brand-700 underline-offset-2 hover:underline">
            {t.auth.backToSignIn}
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center">
          <MailCheck className="mx-auto mb-3 h-10 w-10 text-brand-600" />
          <h2 className="font-display text-lg font-semibold text-brand-900">{t.auth.resetSent}</h2>
          <p className="mt-1 text-sm text-ink/60">
            {t.auth.resetSentBody.replace("{email}", email)}
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">{t.auth.email}</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <ErrorNote>{error}</ErrorNote>
          <Button type="submit" disabled={busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {busy ? t.auth.sending : t.auth.sendResetLink}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
