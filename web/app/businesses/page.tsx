"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { listBusinesses, listCities } from "@/lib/api";
import BusinessCard from "@/components/BusinessCard";
import CityFilter from "@/components/CityFilter";
import { INVESTMENT_TYPE_STYLES } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";
import type { Business, InvestmentType } from "@/lib/types";

export default function BusinessesPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<Business[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<InvestmentType | "all">("all");
  const [city, setCity] = useState<string>("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [data, c] = await Promise.all([
          listBusinesses({ type: type === "all" ? undefined : type, city: city || undefined, search: search || undefined, perPage: 24 }),
          listCities(),
        ]);
        setItems(data.items);
        setCities(c);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [type, city, search]);

  const TYPES: { key: InvestmentType | "all"; label: string }[] = [
    { key: "all", label: t.misc.all },
    ...(Object.keys(INVESTMENT_TYPE_STYLES) as InvestmentType[]).map((k) => ({
      key: k,
      label: t.investmentTypes[k],
    })),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-brand-950 sm:text-4xl">
          {t.businesses.title}
        </h1>
        <p className="max-w-2xl text-ink/60">{t.businesses.subtitle}</p>
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {TYPES.map((f) => {
            const isActive = type === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setType(f.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive ? "bg-brand-700 text-white shadow-soft" : "border border-cream-200 bg-white text-ink/70 hover:bg-cream-100"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {cities.length > 0 && (
            <div className="relative">
              <CityFilter cities={cities} current={city} type={type === "all" ? undefined : type} search={search || undefined} />
            </div>
          )}

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.businesses.searchPlaceholder}
              className="w-full rounded-full border border-cream-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition-all placeholder:text-ink/35 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl border border-cream-200 bg-white" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((b) => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-2xl border border-dashed border-cream-200 bg-white py-16 text-center">
          <p className="font-display text-lg font-semibold text-brand-900">{t.businesses.emptyTitle}</p>
          <p className="mt-1 text-sm text-ink/55">{t.businesses.emptyBody}</p>
          <button
            onClick={() => { setType("all"); setCity(""); setSearch(""); }}
            className="mt-4 inline-block rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white"
          >
            {t.businesses.clearFilters}
          </button>
        </div>
      )}
    </div>
  );
}
