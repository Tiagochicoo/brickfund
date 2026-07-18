"use client";

import { MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function CityFilter({
  cities,
  current,
  type,
  search,
}: {
  cities: string[];
  current?: string;
  type?: string;
  search?: string;
}) {
  const { t } = useI18n();
  return (
    <form action="/businesses" method="GET" className="relative">
      {type && <input type="hidden" name="type" value={type} />}
      {search && <input type="hidden" name="search" value={search} />}
      <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
      <select
        name="city"
        defaultValue={current ?? ""}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className={`appearance-none rounded-full border border-cream-200 bg-white py-2.5 pl-9 pr-9 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 ${
          current ? "text-ink" : "text-ink/50"
        }`}
      >
        <option value="">{t.businesses.allCities}</option>
        {cities.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </form>
  );
}
