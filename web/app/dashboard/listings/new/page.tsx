"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { getPb } from "@/lib/pb";
import { Button, ErrorNote, Input, Label } from "@/components/ui";
import LocationSelect from "@/components/LocationSelect";
import InvestmentTypePicker from "@/components/InvestmentTypePicker";
import ImageUpload, {
  appendImagesToFormData,
  emptyImageUpload,
  type ImageUploadValue,
} from "@/components/ImageUpload";
import type { InvestmentType, Category, ListingStatus } from "@/lib/types";

const CATS: Category[] = ["restaurant", "barber", "gym", "cafe", "retail", "salon", "bakery", "bar", "other"];

function presetFor(t: ReturnType<typeof useI18n>["t"], type: InvestmentType): string {
  const map: Record<InvestmentType, string> = {
    seed: t.listing.useOfFundsPreset_seed,
    growth: t.listing.useOfFundsPreset_growth,
    loan: t.listing.useOfFundsPreset_loan,
    equity: t.listing.useOfFundsPreset_equity,
    revenue_share: t.listing.useOfFundsPreset_revenue_share,
    convertible_note: t.listing.useOfFundsPreset_convertible_note,
    trespasse: t.listing.useOfFundsPreset_trespasse,
  };
  return map[type];
}

export default function NewListingPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("restaurant");
  const [investmentType, setInvestmentType] = useState<InvestmentType>("growth");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [pitch, setPitch] = useState("");
  const [description, setDescription] = useState("");
  const [capitalSought, setCapitalSought] = useState("");
  const [useOfFunds, setUseOfFunds] = useState("");
  const [revenueRange, setRevenueRange] = useState("");
  const [status, setStatus] = useState<ListingStatus>("open");
  const [published, setPublished] = useState(true);
  const [images, setImages] = useState<ImageUploadValue>(emptyImageUpload);
  const [privateDescription, setPrivateDescription] = useState("");
  const [privateFinancials, setPrivateFinancials] = useState("");
  const [privateDeckUrl, setPrivateDeckUrl] = useState("");

  const fundsTouched = useRef(false);
  const lastPreset = useRef("");
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      const p = presetFor(t, investmentType);
      setUseOfFunds(p);
      lastPreset.current = p;
      initialized.current = true;
      return;
    }
    const next = presetFor(t, investmentType);
    if (!fundsTouched.current || useOfFunds === lastPreset.current) {
      setUseOfFunds(next);
      lastPreset.current = next;
      fundsTouched.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, investmentType]);

  function handleInvestmentType(type: InvestmentType) {
    setInvestmentType(type);
    const next = presetFor(t, type);
    if (!fundsTouched.current || useOfFunds.trim() === "" || useOfFunds === lastPreset.current) {
      setUseOfFunds(next);
      lastPreset.current = next;
      fundsTouched.current = false;
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!user || !name.trim() || !pitch.trim()) {
      setError(t.listing.validation);
      return;
    }
    if (!country || !city) {
      setError(t.listing.cityRequired);
      return;
    }
    setBusy(true);
    try {
      const pb = getPb();
      const fullLocation = `${city}, ${country}`;
      const fd = new FormData();
      fd.append("owner", user.id);
      fd.append("name", name.trim());
      fd.append("category", category);
      fd.append("investmentType", investmentType);
      fd.append("location", fullLocation);
      fd.append("city", city.trim());
      fd.append("country", country.trim());
      fd.append("pitch", pitch.trim());
      fd.append("description", description.trim());
      fd.append("status", status);
      fd.append("capitalSought", capitalSought.trim());
      fd.append("useOfFunds", useOfFunds.trim());
      fd.append("revenueRange", revenueRange.trim());
      fd.append("privateDescription", privateDescription.trim());
      fd.append("privateFinancials", privateFinancials.trim());
      fd.append("privateDeckUrl", privateDeckUrl.trim());
      fd.append("published", published ? "true" : "false");
      fd.append("vetted", "false");
      fd.append("featured", "false");
      appendImagesToFormData(fd, images);

      await pb.collection("businesses").create(fd);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : t.listing.createError);
    } finally {
      setBusy(false);
    }
  }

  if (!user || user.role !== "business") {
    router.replace("/dashboard");
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
          <Plus className="h-3.5 w-3.5" />
          {t.listing.badge}
        </span>
      </div>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-brand-950">{t.listing.title}</h1>
      <p className="mt-1 text-ink/60">{t.listing.subtitle}</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <div className="space-y-4 rounded-2xl border border-cream-200 bg-white p-5">
          <div>
            <Label htmlFor="name">{t.listing.name}</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Bella Vista Trattoria" />
          </div>

          <ImageUpload value={images} onChange={setImages} />

          <div>
            <Label htmlFor="category">{t.listing.category}</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="mt-1 w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400"
            >
              {CATS.map((c) => (
                <option key={c} value={c}>
                  {t.categories[c]}
                </option>
              ))}
            </select>
          </div>

          <InvestmentTypePicker value={investmentType} onChange={handleInvestmentType} />

          <LocationSelect country={country} city={city} onCountryChange={setCountry} onCityChange={setCity} required />

          <div>
            <Label htmlFor="pitch">{t.listing.pitch}</Label>
            <Input id="pitch" required value={pitch} onChange={(e) => setPitch(e.target.value)} placeholder={t.listing.pitchPlaceholder} />
          </div>
          <div>
            <Label htmlFor="desc">{t.listing.description}</Label>
            <textarea
              id="desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.listing.descriptionPlaceholder}
              className="mt-1 w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="capital" hint={t.listing.capitalSoughtHint}>
                {t.listing.capitalSought}
              </Label>
              <Input id="capital" value={capitalSought} onChange={(e) => setCapitalSought(e.target.value)} placeholder="€50,000 - €100,000" />
            </div>
            <div>
              <Label htmlFor="revenue" hint={t.listing.revenueRangeHint}>
                {t.listing.revenueRange}
              </Label>
              <Input id="revenue" value={revenueRange} onChange={(e) => setRevenueRange(e.target.value)} placeholder="€200k - €500k/yr" />
            </div>
          </div>
          <div>
            <Label htmlFor="status">{t.listing.statusLabel}</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ListingStatus)}
              className="mt-1 w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400"
            >
              <option value="open">{t.listing.statusOpen}</option>
              <option value="paused">{t.listing.statusPaused}</option>
              <option value="closed">{t.listing.statusClosed}</option>
            </select>
          </div>
          <div>
            <Label htmlFor="useOfFunds" hint={t.listing.useOfFundsHint}>
              {t.listing.useOfFunds}
            </Label>
            <textarea
              id="useOfFunds"
              rows={6}
              value={useOfFunds}
              onChange={(e) => {
                fundsTouched.current = true;
                setUseOfFunds(e.target.value);
              }}
              className="mt-1 w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400"
            />
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-cream-200 bg-cream-50 p-3.5">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-cream-200 accent-brand-600"
            />
            <span className="text-sm text-ink/70">{t.listing.publishNow}</span>
          </label>
        </div>

        <div className="space-y-4 rounded-2xl border border-brand-200 bg-brand-50 p-5">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-brand-600" />
            <h3 className="text-sm font-semibold text-brand-900">{t.listing.privateSection}</h3>
          </div>
          <p className="text-xs text-ink/55">{t.listing.privateSectionHint}</p>
          <div>
            <Label htmlFor="privDesc">{t.listing.privateDescription}</Label>
            <textarea
              id="privDesc"
              rows={3}
              value={privateDescription}
              onChange={(e) => setPrivateDescription(e.target.value)}
              className="mt-1 w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400"
            />
          </div>
          <div>
            <Label htmlFor="privFin">{t.listing.privateFinancials}</Label>
            <textarea
              id="privFin"
              rows={3}
              value={privateFinancials}
              onChange={(e) => setPrivateFinancials(e.target.value)}
              className="mt-1 w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400"
            />
          </div>
          <div>
            <Label htmlFor="privDeck">{t.listing.privateDeckUrl}</Label>
            <Input id="privDeck" value={privateDeckUrl} onChange={(e) => setPrivateDeckUrl(e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <ErrorNote>{error}</ErrorNote>
        <Button type="submit" disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {busy ? t.listing.creating : t.listing.create}
        </Button>
      </form>
    </div>
  );
}
