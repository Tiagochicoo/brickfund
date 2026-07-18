"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Globe2, MapPin, ChevronDown, Loader2 } from "lucide-react";
import { Label } from "./ui";
import { useI18n } from "@/lib/i18n";

type CountryData = { country: string; cities: string[] };

const COUNTRIESNOW_URL = "https://countriesnow.space/api/v0.1/countries";

export default function LocationSelect({
  country,
  city,
  onCountryChange,
  onCityChange,
  required = false,
}: {
  country: string;
  city: string;
  onCountryChange: (v: string) => void;
  onCityChange: (v: string) => void;
  required?: boolean;
}) {
  const { t } = useI18n();
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch(COUNTRIESNOW_URL)
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          setCountries(
            d.data.map((c: { country: string; cities: string[] }) => ({
              country: c.country,
              cities: c.cities,
            }))
          );
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const sortedCountries = useMemo(
    () => [...countries].sort((a, b) => a.country.localeCompare(b.country)),
    [countries]
  );

  const currentCities = useMemo(() => {
    const found = countries.find((c) => c.country === country);
    return found?.cities ?? [];
  }, [countries, country]);

  const filteredCities = useMemo(() => {
    const q = cityQuery.toLowerCase();
    if (!q) return currentCities.slice(0, 200);
    return currentCities
      .filter((c) => c.toLowerCase().includes(q))
      .slice(0, 200);
  }, [currentCities, cityQuery]);

  function handleCountryChange(value: string) {
    onCountryChange(value);
    onCityChange("");
    setCityQuery("");
  }

  function openCityDropdown() {
    if (blurTimer.current) {
      clearTimeout(blurTimer.current);
      blurTimer.current = null;
    }
    setCityOpen(true);
    setCityQuery(city);
  }

  function scheduleClose() {
    blurTimer.current = setTimeout(() => setCityOpen(false), 150);
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-cream-200 bg-white px-4 py-3 text-sm text-ink/40">
        <Loader2 className="h-4 w-4 animate-spin" />
        {t.auth.loadingLocations}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Country */}
      <div>
        <Label htmlFor="country">
          {t.auth.country}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </Label>
        <div className="relative">
          <Globe2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <select
            id="country"
            required={required}
            value={country}
            onChange={(e) => handleCountryChange(e.target.value)}
            className={`w-full appearance-none rounded-xl border border-cream-200 bg-white py-2.5 pl-9 pr-9 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 ${
              country ? "text-ink" : "text-ink/40"
            }`}
          >
            <option value="">
              {error ? t.auth.countryPlaceholder : t.auth.countryPlaceholder}
            </option>
            {sortedCountries.map((c) => (
              <option key={c.country} value={c.country}>
                {c.country}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
        </div>
      </div>

      {/* City */}
      <div>
        <Label htmlFor="city">
          {t.auth.city}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </Label>
        {currentCities.length > 0 && !error ? (
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
            <input
              id="city"
              required={required}
              value={cityOpen ? cityQuery : city}
              placeholder={t.auth.cityPlaceholder}
              onChange={(e) => {
                setCityQuery(e.target.value);
                onCityChange(e.target.value);
                setCityOpen(true);
              }}
              onFocus={openCityDropdown}
              onBlur={scheduleClose}
              autoComplete="off"
              className="w-full rounded-xl border border-cream-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition-all placeholder:text-ink/35 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
            />
            {cityOpen && filteredCities.length > 0 && (
              <ul className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-cream-200 bg-white py-1 shadow-card">
                {filteredCities.map((c) => (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => {
                        onCityChange(c);
                        setCityQuery(c);
                        setCityOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-ink/75 transition-colors hover:bg-brand-50 hover:text-brand-800"
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <input
            id="city"
            required={required}
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder={country ? t.auth.cityManualPlaceholder : t.auth.citySelectFirst}
            disabled={!country}
            className="w-full rounded-xl border border-cream-200 bg-white py-2.5 px-4 text-sm outline-none transition-all placeholder:text-ink/35 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50"
          />
        )}
      </div>
    </div>
  );
}
