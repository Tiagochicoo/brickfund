import Link from "next/link";
import { Search } from "lucide-react";
import { listBusinesses } from "@/lib/api";
import BusinessCard from "@/components/BusinessCard";
import { INVESTMENT_TYPES } from "@/lib/constants";
import type { InvestmentType } from "@/lib/types";

const FILTERS: { key: InvestmentType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  ...(Object.keys(INVESTMENT_TYPES) as InvestmentType[]).map((k) => ({
    key: k,
    label: INVESTMENT_TYPES[k].label,
  })),
];

export default async function BusinessesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const type = typeof sp.type === "string" ? (sp.type as InvestmentType) : undefined;
  const search = typeof sp.search === "string" ? sp.search : undefined;

  const { items } = await listBusinesses({ type, search, perPage: 24 });
  const active = type ?? "all";

  const qs = (next: { type?: InvestmentType | "all"; search?: string }) => {
    const p = new URLSearchParams();
    if (next.type && next.type !== "all") p.set("type", next.type);
    if (next.search) p.set("search", next.search);
    const s = p.toString();
    return s ? `?${s}` : "";
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-brand-950 sm:text-4xl">
          Explore businesses
        </h1>
        <p className="max-w-2xl text-ink/60">
          Browse live funding opportunities from brick-and-mortar businesses.
          Filter by the type of investment you&apos;re looking for.
        </p>
      </div>

      {/* Controls */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const isActive = active === f.key;
            return (
              <Link
                key={f.key}
                href={`/businesses${qs({ type: f.key, search })}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-brand-700 text-white shadow-soft"
                    : "border border-cream-200 bg-white text-ink/70 hover:bg-cream-100"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        <form className="relative w-full lg:w-72" action="/businesses" method="GET">
          {type && <input type="hidden" name="type" value={type} />}
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            name="search"
            defaultValue={search}
            placeholder="Search name, city…"
            className="w-full rounded-full border border-cream-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition-all placeholder:text-ink/35 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
          />
        </form>
      </div>

      {/* Grid */}
      {items.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((b) => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-2xl border border-dashed border-cream-200 bg-white py-16 text-center">
          <p className="font-display text-lg font-semibold text-brand-900">
            No opportunities found
          </p>
          <p className="mt-1 text-sm text-ink/55">
            Try a different investment type or search term.
          </p>
          <Link
            href="/businesses"
            className="mt-4 inline-block rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Clear filters
          </Link>
        </div>
      )}
    </div>
  );
}
