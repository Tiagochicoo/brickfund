"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Store, TrendingUp, Check } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import { Button, ErrorNote, Input, Label } from "@/components/ui";
import LocationSelect from "@/components/LocationSelect";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import type { Role } from "@/lib/types";

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [role, setRole] = useState<Role>("business");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");

  const [investorType, setInvestorType] = useState<"individual" | "firm" | "fund">("individual");
  const [accredited, setAccredited] = useState(false);
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [invCompany, setInvCompany] = useState("");

  const INVESTOR_TYPES = [
    { value: "individual" as const, label: t.auth.individualInvestor },
    { value: "firm" as const, label: t.auth.investmentFirm },
    { value: "fund" as const, label: t.auth.fundFamilyOffice },
  ];

  function prettyError(err: unknown): string {
    const e = err as { response?: { data?: Record<string, { message?: string }> }; message?: string };
    const data = e?.response?.data;
    if (data) {
      const msgs = Object.entries(data)
        .map(([k, v]) => `${k}: ${v?.message ?? "invalid"}`)
        .join("; ");
      if (msgs) return msgs;
    }
    return e?.message || t.auth.createError;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== passwordConfirm) {
      setError(t.auth.passwordMismatch);
      return;
    }
    if (password.length < 10) {
      setError(t.auth.passwordShort);
      return;
    }
    setBusy(true);
    try {
      const fullLocation = city && country ? `${city}, ${country}` : "";
      const base = {
        email: email.trim(),
        password,
        passwordConfirm,
        name: name.trim(),
        role,
        location: fullLocation.trim(),
        city: city.trim(),
        country: country.trim(),
      };
      if (role === "business") {
        await register({ ...base, company: company.trim(), phone: phone.trim() });
      } else {
        await register({
          ...base,
          company: invCompany.trim(),
          investorType,
          accredited,
          budgetMin: budgetMin ? Number(budgetMin) : undefined,
          budgetMax: budgetMax ? Number(budgetMax) : undefined,
        });
      }
      router.push("/dashboard");
    } catch (err) {
      setError(prettyError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title={t.auth.createAccount}
      subtitle={t.auth.registerSubtitle}
      footer={
        <>
          {t.auth.haveAccount}{" "}
          <Link href="/login" className="font-semibold text-brand-700 underline-offset-2 hover:underline">
            {t.auth.signIn}
          </Link>
        </>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-cream-100 p-1.5">
        <RoleButton
          active={role === "business"}
          onClick={() => setRole("business")}
          icon={<Store className="h-4 w-4" />}
          title={t.auth.roleBusiness}
          sub={t.auth.roleBusinessSub}
        />
        <RoleButton
          active={role === "investor"}
          onClick={() => setRole("investor")}
          icon={<TrendingUp className="h-4 w-4" />}
          title={t.auth.roleInvestor}
          sub={t.auth.roleInvestorSub}
        />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">
            {role === "business" ? t.auth.yourName : t.auth.fullName}
          </Label>
          <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
        </div>

        {role === "business" ? (
          <>
            <div>
              <Label htmlFor="company">{t.auth.businessName}</Label>
              <Input id="company" required value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Bella Vista Trattoria" />
            </div>
            <div>
              <Label htmlFor="phone">{t.auth.phone}</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+351 912 345 678" />
            </div>
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="investorType">{t.auth.investorType}</Label>
              <div className="grid grid-cols-1 gap-2">
                {INVESTOR_TYPES.map((it) => (
                  <button
                    key={it.value}
                    type="button"
                    onClick={() => setInvestorType(it.value)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-left text-sm transition-all ${
                      investorType === it.value
                        ? "border-brand-500 bg-brand-50 text-brand-800 ring-1 ring-brand-500/30"
                        : "border-cream-200 bg-white text-ink/70 hover:bg-cream-50"
                    }`}
                  >
                    {it.label}
                    {investorType === it.value && <Check className="h-4 w-4 text-brand-600" />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="invCompany" hint={t.auth.firmNameOptional}>
                {t.auth.firmName}
              </Label>
              <Input id="invCompany" value={invCompany} onChange={(e) => setInvCompany(e.target.value)} placeholder="Whitfield Capital" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="budgetMin" hint="€">{t.auth.minBudget}</Label>
                <Input id="budgetMin" type="number" min={0} value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} placeholder="25000" />
              </div>
              <div>
                <Label htmlFor="budgetMax" hint="€">{t.auth.maxBudget}</Label>
                <Input id="budgetMax" type="number" min={0} value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} placeholder="250000" />
              </div>
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-cream-200 bg-white p-3.5">
              <input type="checkbox" checked={accredited} onChange={(e) => setAccredited(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-cream-200 accent-brand-600" />
              <span className="text-sm text-ink/70">{t.auth.accredited}</span>
            </label>
          </>
        )}

        <LocationSelect country={country} city={city} onCountryChange={setCountry} onCityChange={setCity} required={role === "business"} />

        <div>
          <Label htmlFor="email">{t.auth.email}</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="password">{t.auth.password}</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t.auth.passwordMin} />
          </div>
          <div>
            <Label htmlFor="passwordConfirm">{t.auth.passwordConfirm}</Label>
            <Input id="passwordConfirm" type="password" required value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} placeholder={t.auth.passwordRepeat} />
          </div>
        </div>

        <ErrorNote>{error}</ErrorNote>

        <Button type="submit" disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {busy ? (role === "business" ? t.auth.creatingBusiness : t.auth.creatingInvestor) : (role === "business" ? t.auth.createBusinessBtn : t.auth.createInvestorBtn)}
        </Button>
        <p className="text-center text-xs text-ink/40">{t.auth.termsNotice}</p>
      </form>
    </AuthShell>
  );
}

function RoleButton({
  active,
  onClick,
  icon,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-xl px-3 py-3 text-center transition-all ${
        active ? "bg-white text-brand-800 shadow-soft ring-1 ring-brand-500/20" : "text-ink/55 hover:text-brand-700"
      }`}
    >
      {icon}
      <span className="text-sm font-semibold">{title}</span>
      <span className="text-[11px] opacity-70">{sub}</span>
    </button>
  );
}
