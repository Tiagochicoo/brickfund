"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Store,
  TrendingUp,
  Plus,
  ArrowRight,
  Briefcase,
  Heart,
  MessageSquare,
  CheckCircle2,
  XCircle,
  BadgeCheck,
  Inbox,
  Bookmark,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { getPb } from "@/lib/pb";
import {
  getInterestsForOwner,
  getMyInterests,
  getSavedBusinesses,
  updateInterestStatus,
} from "@/lib/api";
import { STATUS_STYLES } from "@/lib/constants";
import type { Business, Interest, SavedBusiness, InterestStatus } from "@/lib/types";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [saved, setSaved] = useState<SavedBusiness[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  const load = useCallback(async () => {
    if (!user) return;
    setFetching(true);
    try {
      const pb = getPb();
      if (user.role === "business") {
        const [bizRes, ints] = await Promise.all([
          pb.collection("businesses").getList<Business>(1, 50, {
            filter: `owner = "${user.id}"`,
            sort: "-created",
          }),
          getInterestsForOwner(user.id),
        ]);
        setBusinesses(bizRes.items as unknown as Business[]);
        setInterests(ints);
      } else {
        const [ints, savedBiz] = await Promise.all([
          getMyInterests(),
          getSavedBusinesses(),
        ]);
        setInterests(ints);
        setSaved(savedBiz);
      }
    } catch {
      /* empty data */
    } finally {
      setFetching(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

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
            {isBusiness ? t.dashboard.businessAccount : t.dashboard.investorAccount}
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-brand-950">
            {t.dashboard.welcome.replace("{name}", user.name.split(" ")[0])}
          </h1>
          <p className="mt-1 text-ink/60">
            {isBusiness ? t.dashboard.businessSubtitle : t.dashboard.investorSubtitle}
          </p>
        </div>
        {isBusiness && (
          <Link
            href="/dashboard/listings/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-800"
          >
            <Plus className="h-4 w-4" />
            {t.dashboard.newListing}
          </Link>
        )}
      </div>

      {/* Stats cards */}
      {isBusiness ? (
        <BusinessStats businesses={businesses} interests={interests} t={t} />
      ) : (
        <InvestorStats interests={interests} saved={saved} t={t} />
      )}

      {/* Main content */}
      {isBusiness ? (
        <BusinessDashboard
          businesses={businesses}
          interests={interests}
          fetching={fetching}
          t={t}
          onInterestAction={(id, status) => {
            setInterests((prev) =>
              prev.map((i) => (i.id === id ? { ...i, status } : i)),
            );
          }}
        />
      ) : (
        <InvestorDashboard
          interests={interests}
          saved={saved}
          fetching={fetching}
          t={t}
        />
      )}
    </div>
  );
}

// ── Stats ───────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-cream-200 bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-ink/45">
          {label}
        </p>
        <span className="text-brand-500">{icon}</span>
      </div>
      <p className="mt-1 truncate font-display text-lg font-semibold text-brand-900">
        {value}
      </p>
    </div>
  );
}

function BusinessStats({
  businesses,
  interests,
  t,
}: {
  businesses: Business[];
  interests: Interest[];
  t: ReturnType<typeof useI18n>["t"];
}) {
  const openCount = businesses.filter((b) => b.status === "open").length;
  const vettedCount = businesses.filter((b) => b.vetted).length;
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label={t.dashboard.listings} value={businesses.length} icon={<Store className="h-4 w-4" />} />
      <StatCard label={t.dashboard.statusOpen} value={openCount} icon={<CheckCircle2 className="h-4 w-4" />} />
      <StatCard label={t.dashboard.interestsReceived} value={interests.length} icon={<Inbox className="h-4 w-4" />} />
      <StatCard
        label={t.dashboard.vetted}
        value={vettedCount > 0 ? t.dashboard.vetted : t.dashboard.notVetted}
        icon={vettedCount > 0 ? <BadgeCheck className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
      />
    </div>
  );
}

function InvestorStats({
  interests,
  saved,
  t,
}: {
  interests: Interest[];
  saved: SavedBusiness[];
  t: ReturnType<typeof useI18n>["t"];
}) {
  const acceptedCount = interests.filter((i) => i.status === "accepted").length;
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label={t.dashboard.yourInterests} value={interests.length} icon={<Heart className="h-4 w-4" />} />
      <StatCard label={t.dashboard.savedBusinesses} value={saved.length} icon={<Bookmark className="h-4 w-4" />} />
      <StatCard label={t.dashboard.conversations} value={acceptedCount} icon={<MessageSquare className="h-4 w-4" />} />
      <StatCard label={t.dashboard.accountType} value={t.dashboard.investorAccount} icon={<TrendingUp className="h-4 w-4" />} />
    </div>
  );
}

// ── Business Dashboard ──────────────────────────────────────────────────

function BusinessDashboard({
  businesses,
  interests,
  fetching,
  t,
  onInterestAction,
}: {
  businesses: Business[];
  interests: Interest[];
  fetching: boolean;
  t: ReturnType<typeof useI18n>["t"];
  onInterestAction: (id: string, status: InterestStatus) => void;
}) {
  const recentInterests = interests.slice(0, 5);

  return (
    <div className="mt-10 space-y-10">
      {/* Your Listings */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-brand-900">
            {t.dashboard.yourListings}
          </h2>
          <Link
            href="/businesses"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            {t.dashboard.exploreAll}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {fetching ? (
          <SkeletonGrid />
        ) : businesses.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map((b) => (
              <ListingRow key={b.id} business={b} t={t} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Briefcase className="h-6 w-6" />}
            title={t.dashboard.emptyBusinessTitle}
            body={t.dashboard.emptyBusinessBody}
            ctaText={t.dashboard.newListing}
            ctaHref="/dashboard/listings/new"
          />
        )}
      </section>

      {/* Recent Interests */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-brand-900">
            {t.dashboard.recentInterests}
          </h2>
          <Link
            href="/dashboard/messages"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            {t.dashboard.viewMessages}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {fetching ? (
          <div className="mt-6 space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl border border-cream-200 bg-white" />
            ))}
          </div>
        ) : recentInterests.length > 0 ? (
          <div className="mt-6 space-y-3">
            {recentInterests.map((interest) => (
              <InterestRow
                key={interest.id}
                interest={interest}
                t={t}
                showBusiness
                onAction={onInterestAction}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Inbox className="h-6 w-6" />}
            title={t.dashboard.noInterests}
            body="When investors express interest in your businesses, they will appear here."
          />
        )}
      </section>
    </div>
  );
}

function ListingRow({
  business,
  t,
}: {
  business: Business;
  t: ReturnType<typeof useI18n>["t"];
}) {
  const style = STATUS_STYLES[business.status] ?? STATUS_STYLES.open;
  const statusLabel =
    business.status === "open"
      ? t.dashboard.statusOpen
      : business.status === "paused"
        ? t.dashboard.statusPaused
        : t.dashboard.statusClosed;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-cream-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-semibold text-brand-900">
            {business.name}
          </h3>
          <p className="mt-0.5 truncate text-sm text-ink/55">
            {business.city ? `${business.city}` : business.location}
            {business.category ? ` · ${t.categories[business.category]}` : ""}
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${style.pill}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
          {statusLabel}
        </span>
      </div>
      {business.pitch && (
        <p className="line-clamp-2 text-sm leading-relaxed text-ink/70">
          {business.pitch}
        </p>
      )}
      <div className="flex items-center gap-3">
        <Link
          href={`/dashboard/listings/${business.id}/edit`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          {t.businessDetail.editListing}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href={`/businesses/${business.id}`}
          className="inline-flex items-center gap-1 text-xs text-ink/50 hover:text-brand-700"
        >
          View
        </Link>
      </div>
    </div>
  );
}

// ── Investor Dashboard ──────────────────────────────────────────────────

function InvestorDashboard({
  interests,
  saved,
  fetching,
  t,
}: {
  interests: Interest[];
  saved: SavedBusiness[];
  fetching: boolean;
  t: ReturnType<typeof useI18n>["t"];
}) {
  return (
    <div className="mt-10 space-y-10">
      {/* Your Interests */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-brand-900">
            {t.dashboard.yourInterests}
          </h2>
          <Link
            href="/businesses"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            {t.dashboard.browseOpportunities}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {fetching ? (
          <div className="mt-6 space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl border border-cream-200 bg-white" />
            ))}
          </div>
        ) : interests.length > 0 ? (
          <div className="mt-6 space-y-3">
            {interests.map((interest) => (
              <InvestorInterestRow key={interest.id} interest={interest} t={t} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Heart className="h-6 w-6" />}
            title={t.dashboard.noInterests}
            body={t.dashboard.emptyInvestorBody}
            ctaText={t.dashboard.browseOpportunities}
            ctaHref="/businesses"
          />
        )}
      </section>

      {/* Saved Businesses */}
      <section>
        <h2 className="font-display text-xl font-semibold text-brand-900">
          {t.dashboard.savedBusinesses}
        </h2>

        {fetching ? (
          <SkeletonGrid />
        ) : saved.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((s) => {
              const biz = s.expand?.business;
              if (!biz) return null;
              return (
                <Link
                  key={s.id}
                  href={`/businesses/${biz.id}`}
                  className="flex flex-col rounded-2xl border border-cream-200 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
                >
                  <h3 className="truncate font-display text-lg font-semibold text-brand-900">
                    {biz.name}
                  </h3>
                  <p className="mt-0.5 truncate text-sm text-ink/55">
                    {biz.city ? `${biz.city}` : biz.location}
                    {biz.category ? ` · ${t.categories[biz.category]}` : ""}
                  </p>
                  {biz.pitch && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/70">
                      {biz.pitch}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<Bookmark className="h-6 w-6" />}
            title={t.dashboard.noSaved}
            body="Save businesses you like to find them quickly later."
            ctaText={t.dashboard.browseOpportunities}
            ctaHref="/businesses"
          />
        )}
      </section>
    </div>
  );
}

function InvestorInterestRow({
  interest,
  t,
}: {
  interest: Interest;
  t: ReturnType<typeof useI18n>["t"];
}) {
  const biz = interest.expand?.business;
  const statusBadge = getStatusBadge(interest.status, t);

  return (
    <Link
      href={`/dashboard/messages/${interest.id}`}
      className="flex items-center gap-4 rounded-2xl border border-cream-200 bg-white p-4 shadow-soft transition-all hover:border-brand-300 hover:shadow-card"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-semibold text-brand-900">
            {biz?.name ?? "Business"}
          </h3>
          {statusBadge}
        </div>
        {interest.message && (
          <p className="mt-0.5 truncate text-sm text-ink/55">
            {interest.message}
          </p>
        )}
      </div>
      <MessageSquare className="h-5 w-5 shrink-0 text-brand-500" />
    </Link>
  );
}

// ── Interest Row (Business Owner View) ──────────────────────────────────

function InterestRow({
  interest,
  t,
  showBusiness,
  onAction,
}: {
  interest: Interest;
  t: ReturnType<typeof useI18n>["t"];
  showBusiness?: boolean;
  onAction: (id: string, status: InterestStatus) => void;
}) {
  const [busy, setBusy] = useState(false);
  const investor = interest.expand?.investor;
  const biz = interest.expand?.business;
  const statusBadge = getStatusBadge(interest.status, t);

  async function handleAction(status: "accepted" | "declined" | "withdrawn") {
    setBusy(true);
    try {
      await updateInterestStatus(interest.id, status);
      onAction(interest.id, status);
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-cream-200 bg-white p-4 shadow-soft">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-100 font-display text-sm font-bold text-brand-700">
        {initials(investor?.name)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold text-brand-900">
            {investor?.name ?? "Investor"}
          </span>
          {statusBadge}
        </div>
        {showBusiness && biz && (
          <p className="truncate text-xs text-ink/50">
            {biz.name}
          </p>
        )}
        {interest.message && (
          <p className="mt-0.5 truncate text-sm text-ink/55">
            {interest.message}
          </p>
        )}
      </div>
      {interest.status === "pending" ? (
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => handleAction("accepted")}
            disabled={busy}
            className="inline-flex items-center gap-1 rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-50"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {t.dashboard.acceptInterest}
          </button>
          <button
            onClick={() => handleAction("declined")}
            disabled={busy}
            className="inline-flex items-center gap-1 rounded-lg border border-cream-200 px-3 py-1.5 text-xs font-semibold text-ink/60 transition-colors hover:bg-cream-100 disabled:opacity-50"
          >
            <XCircle className="h-3.5 w-3.5" />
            {t.dashboard.declineInterest}
          </button>
        </div>
      ) : (
        <Link
          href={`/dashboard/messages/${interest.id}`}
          className="shrink-0 rounded-lg border border-cream-200 px-3 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-cream-100"
        >
          {t.dashboard.viewMessages}
        </Link>
      )}
    </div>
  );
}

// ── Shared Helpers ──────────────────────────────────────────────────────

function getStatusBadge(
  status: InterestStatus,
  t: ReturnType<typeof useI18n>["t"],
) {
  const styles: Record<InterestStatus, string> = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    declined: "bg-rose-50 text-rose-700 ring-rose-200",
    withdrawn: "bg-zinc-50 text-zinc-600 ring-zinc-200",
  };
  const labels: Record<InterestStatus, string> = {
    pending: t.messages.pending,
    accepted: t.messages.accepted,
    declined: t.messages.declined,
    withdrawn: t.messages.withdrawn,
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function EmptyState({
  icon,
  title,
  body,
  ctaText,
  ctaHref,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  ctaText?: string;
  ctaHref?: string;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-cream-200 bg-white py-14 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
        {icon}
      </div>
      <p className="mt-3 font-display text-lg font-semibold text-brand-900">{title}</p>
      <p className="mt-1 text-sm text-ink/55">{body}</p>
      {ctaText && ctaHref && (
        <Link
          href={ctaHref}
          className="mt-4 inline-block rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white"
        >
          {ctaText}
        </Link>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-32 animate-pulse rounded-2xl border border-cream-200 bg-white" />
      ))}
    </div>
  );
}

function initials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
