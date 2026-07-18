"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import { Button, ErrorNote, Input, Label } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(email.trim(), password);
      router.push("/dashboard");
    } catch {
      setError(t.auth.invalidCredentials);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title={t.auth.welcomeBack}
      subtitle={t.auth.signInSubtitle}
      footer={
        <>
          {t.auth.noAccount}{" "}
          <Link href="/register" className="font-semibold text-brand-700 underline-offset-2 hover:underline">
            {t.auth.createNow}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">{t.auth.email}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t.auth.password}</Label>
            <Link href="/forgot-password" className="mb-1.5 text-xs font-medium text-brand-700 hover:underline">
              {t.auth.forgotPassword}
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <ErrorNote>{error}</ErrorNote>

        <Button type="submit" disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {busy ? t.auth.signingIn : t.auth.signIn}
        </Button>
      </form>

      <div className="mt-6 rounded-xl border border-cream-200 bg-cream-50 p-4 text-xs text-ink/60">
        <p className="font-semibold text-brand-800">{t.auth.demoAccounts}</p>
        <p className="mt-1">
          {t.auth.demoBusiness} — <code className="text-brand-700">business@brickfund.local</code>
        </p>
        <p>
          {t.auth.demoInvestor} — <code className="text-brand-700">investor@brickfund.local</code>
        </p>
        <p className="mt-1 text-ink/45">{t.auth.demoPassword}: brickfund1234</p>
      </div>
    </AuthShell>
  );
}
