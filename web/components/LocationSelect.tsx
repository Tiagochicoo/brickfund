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
  const [cityError, setCityError] = useState<string | null>(null);
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

  // Keep query in sync when city is set externally (e.g. edit form load)
  useEffect(() => {
    if (!cityOpen) setCityQuery(city);
  }, [city, cityOpen]);

  const sortedCountries = useMemo(
    () => [...countries].sort((a, b) => a.country.localeCompare(b.country)),
    [countries]
  );

  const currentCities = useMemo(() => {
    const found = countries.find((c) => c.country === country);
    return found?.cities ?? [];
  }, [countries, country]);

  const filteredCities = useMemo(() => {
    const q = cityQuery.toLowerCase().trim();
    if (!q) return currentCities.slice(0, 200);
    return currentCities
      .filter((c) => c.toLowerCase().includes(q))
      .slice(0, 200);
  }, [currentCities, cityQuery]);

  function handleCountryChange(value: string) {
    onCountryChange(value);
    onCityChange("");
    setCityQuery("");
    setCityError(null);
  }

  function selectCity(c: string) {
    onCityChange(c);
    setCityQuery(c);
    setCityOpen(false);
    setCityError(null);
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
    blurTimer.current = setTimeout(() => {
      setCityOpen(false);
      // Only keep a city that exists in the dropdown list
      const match = currentCities.find(
        (c) => c.toLowerCase() === cityQuery.trim().toLowerCase()
      );
      if (match) {
        onCityChange(match);
        setCityQuery(match);
        setCityError(null);
      } else {
        // Revert to last valid selection (or empty)
        setCityQuery(city);
        if (cityQuery.trim() && !city) {
          setCityError(t.auth.citySelectFromList);
        } else if (cityQuery.trim() && city && cityQuery.trim() !== city) {
          setCityError(t.auth.citySelectFromList);
        }
      }
    }, 150);
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
            <option value="">{t.auth.countryPlaceholder}</option>
            {sortedCountries.map((c) => (
              <option key={c.country} value={c.country}>
                {c.country}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
        </div>
      </div>

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
                // Filter only — do not commit free text as city value
                setCityQuery(e.target.value);
                setCityOpen(true);
                setCityError(null);
              }}
              onFocus={openCityDropdown}
              onBlur={scheduleClose}
              autoComplete="off"
              className={`w-full rounded-xl border bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition-all placeholder:text-ink/35 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 ${
                cityError ? "border-rose-300" : "border-cream-200"
              }`}
            />
            {/* Hidden input enforces required selected value for form validity */}
            <input type="hidden" required={required} value={city} readOnly />
            {cityOpen && (
              <ul className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-cream-200 bg-white py-1 shadow-card">
                {filteredCities.length > 0 ? (
                  filteredCities.map((c) => (
                    <li key={c}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectCity(c)}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-brand-50 hover:text-brand-800 ${
                          c === city ? "bg-brand-50 font-medium text-brand-800" : "text-ink/75"
                        }`}
                      >
                        {c}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-sm text-ink/45">{t.auth.cityNoMatches}</li>
                )}
              </ul>
            )}
            {cityError && <p className="mt-1 text-xs text-rose-600">{cityError}</p>}
          </div>
        ) : (
          <p className="rounded-xl border border-cream-200 bg-cream-50 px-4 py-2.5 text-sm text-ink/45">
            {country ? (error ? t.auth.citySelectFromList : t.auth.citySelectFirst) : t.auth.citySelectFirst}
          </p>
        )}
      </div>
    </div>
  );
}
