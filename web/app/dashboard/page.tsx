"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Store,
  TrendingUp,
  Plus,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getPb } from "@/lib/pb";
import BusinessCard from "@/components/BusinessCard";
import { formatCurrency } from "@/lib/constants";
import type { Business } from "@/lib/types";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mine, setMine] = useState<Business[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    const pb = getPb();
    (async () => {
      try {
        if (user.role === "business") {
          const res = await pb.collection("businesses").getList<Business>(1, 50, {
            filter: `owner = "${user.id}"`,
            sort: "-created",
          });
          setMine(res.items as unknown as Business[]);
        } else {
          const res = await pb.collection("businesses").getList<Business>(1, 3, {
            filter: "published = true",
            sort: "-fundingRaised",
          });
          setMine(res.items as unknown as Business[]);
        }
      } catch {
        setMine([]);
      } finally {
        setFetching(false);
      }
    })();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
      </div>
    );
  }

  const isBusiness = user.role === "business";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
            {isBusiness ? <Store className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
            {isBusiness ? "Business account" : "Investor account"}
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-brand-950">
            Welcome back, {firstName(user.name)}
          </h1>
          <p className="mt-1 text-ink/60">
            {isBusiness
              ? "Manage your funding listings and track progress."
              : "Discover opportunities and track your portfolio."}
          </p>
        </div>
        {isBusiness && (
          <button
            disabled
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white opacity-70"
            title="Listing creation coming soon"
          >
            <Plus className="h-4 w-4" />
            New listing
          </button>
        )}
      </div>

      {/* Profile summary */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Account type" value={isBusiness ? "Business" : "Investor"} />
        <Card
          label={isBusiness ? "Company" : "Firm"}
          value={user.company || "—"}
        />
        <Card label="Location" value={user.location || "—"} />
        {isBusiness ? (
          <Card label="Listings" value={String(mine.length)} />
        ) : (
          <Card
            label="Budget"
            value={
              user.budgetMin || user.budgetMax
                ? `${formatCurrency(user.budgetMin ?? 0)}–${formatCurrency(user.budgetMax ?? 0)}`
                : "—"
            }
          />
        )}
      </div>

      {/* Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-brand-900">
            {isBusiness ? "Your listings" : "Recommended for you"}
          </h2>
          <Link
            href="/businesses"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            Explore all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {fetching ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl border border-cream-200 bg-white"
              />
            ))}
          </div>
        ) : mine.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mine.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        ) : (
          <EmptyState isBusiness={isBusiness} />
        )}
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-cream-200 bg-white p-4 shadow-soft">
      <p className="text-xs font-medium uppercase tracking-wider text-ink/45">
        {label}
      </p>
      <p className="mt-1 truncate font-display text-lg font-semibold text-brand-900">
        {value}
      </p>
    </div>
  );
}

function EmptyState({ isBusiness }: { isBusiness: boolean }) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-cream-200 bg-white py-14 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
        <Briefcase className="h-6 w-6" />
      </div>
      <p className="mt-3 font-display text-lg font-semibold text-brand-900">
        {isBusiness ? "No listings yet" : "No recommendations yet"}
      </p>
      <p className="mt-1 text-sm text-ink/55">
        {isBusiness
          ? "Create your first listing to start raising capital."
          : "Browse the marketplace to find your first opportunity."}
      </p>
      <Link
        href="/businesses"
        className="mt-4 inline-block rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white"
      >
        {isBusiness ? "Explore examples" : "Browse opportunities"}
      </Link>
    </div>
  );
}

function firstName(name: string) {
  return name.split(" ")[0];
}
