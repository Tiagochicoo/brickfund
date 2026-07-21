"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { getPb } from "@/lib/pb";
import { Button, ErrorNote, Input, Label } from "@/components/ui";
import type { Category, InvestmentType } from "@/lib/types";
import { CATEGORIES, INVESTMENT_TYPE_STYLES } from "@/lib/constants";

const CATEGORY_KEYS = Object.keys(CATEGORIES) as Category[];
const TYPE_KEYS = Object.keys(INVESTMENT_TYPE_STYLES) as InvestmentType[];

export default function NewListingPage() {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("cafe");
  const [investmentType, setInvestmentType] = useState<InvestmentType>("growth");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [pitch, setPitch] = useState("");
  const [description, setDescription] = useState("");
  const [fundingGoal, setFundingGoal] = useState("");
  const [published, setPublished] = useState(false);

  if (!loading && user && user.role !== "business") {
    router.replace("/dashboard");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError(null);
    const goal = Number(fundingGoal);
    if (!name.trim() || !pitch.trim() || !goal || goal < 1) {
      setError(t.listing.validation);
      return;
    }
    setBusy(true);
    try {
      const location = [city.trim(), country.trim()].filter(Boolean).join(", ") || city.trim() || country.trim() || "—";
      const record = await getPb().collection("businesses").create({
        owner: user.id,
        name: name.trim(),
        category,
        investmentType,
        location,
        city: city.trim(),
        country: country.trim(),
        pitch: pitch.trim().slice(0, 160),
        description: description.trim(),
        fundingGoal: goal,
        fundingRaised: 0,
        published,
      });
      router.push(`/businesses/${record.id}`);
    } catch (err) {
      const e = err as { message?: string; response?: { message?: string } };
      setError(e?.response?.message || e?.message || t.listing.createError);
    } finally {
      setBusy(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
          <Plus className="h-3.5 w-3.5" />
          {t.listing.badge}
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-brand-950">
          {t.listing.title}
        </h1>
        <p className="mt-1 text-ink/60">{t.listing.subtitle}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-cream-200 bg-white p-6 shadow-soft">
        <div>
          <Label htmlFor="name">{t.listing.name}</Label>
          <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} maxLength={120} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="category">{t.listing.category}</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="mt-0 w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
            >
              {CATEGORY_KEYS.map((k) => (
                <option key={k} value={k}>
                  {t.categories[k]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="type">{t.listing.investmentType}</Label>
            <select
              id="type"
              value={investmentType}
              onChange={(e) => setInvestmentType(e.target.value as InvestmentType)}
              className="mt-0 w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
            >
              {TYPE_KEYS.map((k) => (
                <option key={k} value={k}>
                  {t.investmentTypes[k]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="city">{t.auth.city}</Label>
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Lisbon" />
          </div>
          <div>
            <Label htmlFor="country">{t.auth.country}</Label>
            <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Portugal" />
          </div>
        </div>

        <div>
          <Label htmlFor="pitch">{t.listing.pitch}</Label>
          <Input
            id="pitch"
            required
            maxLength={160}
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            placeholder={t.listing.pitchPlaceholder}
          />
          <p className="mt-1 text-xs text-ink/45">{pitch.length}/160</p>
        </div>

        <div>
          <Label htmlFor="description">{t.listing.description}</Label>
          <textarea
            id="description"
            rows={4}
            maxLength={2000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
            placeholder={t.listing.descriptionPlaceholder}
          />
        </div>

        <div>
          <Label htmlFor="goal">{t.listing.fundingGoal}</Label>
          <Input
            id="goal"
            type="number"
            min={1}
            required
            value={fundingGoal}
            onChange={(e) => setFundingGoal(e.target.value)}
            placeholder="50000"
          />
          <p className="mt-1 text-xs text-ink/45">{t.listing.fundingGoalHint}</p>
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 rounded border-cream-300 text-brand-700 focus:ring-brand-500"
          />
          <span>
            <span className="font-medium text-brand-900">{t.listing.publishNow}</span>
            <span className="block text-xs text-ink/55">{t.listing.publishHint}</span>
          </span>
        </label>

        <ErrorNote>{error}</ErrorNote>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} disabled={busy}>
            {t.dashboard.cancel}
          </Button>
          <Button type="submit" disabled={busy} className="flex-1">
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {t.listing.creating}
              </>
            ) : (
              t.listing.create
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
