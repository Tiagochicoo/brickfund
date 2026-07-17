"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Store, TrendingUp, Check } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import { Button, ErrorNote, Input, Label } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/types";

const INVESTOR_TYPES = [
  { value: "individual", label: "Individual investor" },
  { value: "firm", label: "Investment firm" },
  { value: "fund", label: "Fund / family office" },
] as const;

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<Role>("business");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // shared
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [location, setLocation] = useState("");

  // business
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");

  // investor
  const [investorType, setInvestorType] = useState<"individual" | "firm" | "fund">("individual");
  const [accredited, setAccredited] = useState(false);
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [invCompany, setInvCompany] = useState("");

  function prettyError(err: unknown): string {
    const e = err as { response?: { data?: Record<string, { message?: string }> }; message?: string };
    const data = e?.response?.data;
    if (data) {
      const msgs = Object.entries(data)
        .map(([k, v]) => `${k}: ${v?.message ?? "invalid"}`)
        .join("; ");
      if (msgs) return msgs;
    }
    return e?.message || "Could not create your account. Please try again.";
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 10) {
      setError("Password must be at least 10 characters.");
      return;
    }
    setBusy(true);
    try {
      const base = {
        email: email.trim(),
        password,
        passwordConfirm,
        name: name.trim(),
        role,
        location: location.trim(),
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
      title="Create your account"
      subtitle="Join Brickfund as a business or an investor — it's free to start."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-700 underline-offset-2 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      {/* Role toggle */}
      <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-cream-100 p-1.5">
        <RoleButton
          active={role === "business"}
          onClick={() => setRole("business")}
          icon={<Store className="h-4 w-4" />}
          title="I'm a business"
          sub="Raise capital"
        />
        <RoleButton
          active={role === "investor"}
          onClick={() => setRole("investor")}
          icon={<TrendingUp className="h-4 w-4" />}
          title="I'm an investor"
          sub="Fund businesses"
        />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">
            {role === "business" ? "Your name" : "Full name"}
          </Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
          />
        </div>

        {role === "business" ? (
          <>
            <div>
              <Label htmlFor="company">Business name</Label>
              <Input
                id="company"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Bella Vista Trattoria"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+351 912 345 678"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="investorType">Investor type</Label>
              <div className="grid grid-cols-1 gap-2">
                {INVESTOR_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setInvestorType(t.value)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-left text-sm transition-all ${
                      investorType === t.value
                        ? "border-brand-500 bg-brand-50 text-brand-800 ring-1 ring-brand-500/30"
                        : "border-cream-200 bg-white text-ink/70 hover:bg-cream-50"
                    }`}
                  >
                    {t.label}
                    {investorType === t.value && <Check className="h-4 w-4 text-brand-600" />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="invCompany" hint="optional">
                Firm / fund name
              </Label>
              <Input
                id="invCompany"
                value={invCompany}
                onChange={(e) => setInvCompany(e.target.value)}
                placeholder="Whitfield Capital"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="budgetMin" hint="€">
                  Min budget
                </Label>
                <Input
                  id="budgetMin"
                  type="number"
                  min={0}
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  placeholder="25000"
                />
              </div>
              <div>
                <Label htmlFor="budgetMax" hint="€">
                  Max budget
                </Label>
                <Input
                  id="budgetMax"
                  type="number"
                  min={0}
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  placeholder="250000"
                />
              </div>
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-cream-200 bg-white p-3.5">
              <input
                type="checkbox"
                checked={accredited}
                onChange={(e) => setAccredited(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-cream-200 accent-brand-600"
              />
              <span className="text-sm text-ink/70">
                I am an accredited / professional investor
              </span>
            </label>
          </>
        )}

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Lisbon, Portugal"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 10 characters"
            />
          </div>
          <div>
            <Label htmlFor="passwordConfirm">Confirm</Label>
            <Input
              id="passwordConfirm"
              type="password"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Repeat password"
            />
          </div>
        </div>

        <ErrorNote>{error}</ErrorNote>

        <Button type="submit" disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {busy
            ? "Creating account…"
            : role === "business"
              ? "Create business account"
              : "Create investor account"}
        </Button>
        <p className="text-center text-xs text-ink/40">
          By continuing you agree to Brickfund&apos;s terms and privacy policy.
        </p>
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
        active
          ? "bg-white text-brand-800 shadow-soft ring-1 ring-brand-500/20"
          : "text-ink/55 hover:text-brand-700"
      }`}
    >
      {icon}
      <span className="text-sm font-semibold">{title}</span>
      <span className="text-[11px] opacity-70">{sub}</span>
    </button>
  );
}
