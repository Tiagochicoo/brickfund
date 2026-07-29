"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowLeft, Target, TrendingUp, ShieldCheck, Lock, CheckCircle2, BadgeCheck, MessageSquare } from "lucide-react";
import { getBusiness, checkInterest } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import InvestmentPill from "@/components/InvestmentPill";
import { InterestButton } from "@/components/InterestButton";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import type { Business, User, Interest } from "@/lib/types";
import { PB_URL } from "@/lib/types";

const BANNERS: Record<string, string> = {
  restaurant: "from-amber-500 to-rose-500",
  barber: "from-slate-600 to-slate-800",
  gym: "from-zinc-600 to-zinc-800",
  cafe: "from-orange-400 to-amber-600",
  retail: "from-pink-500 to-fuchsia-600",
  salon: "from-rose-400 to-pink-600",
  bakery: "from-yellow-500 to-orange-600",
  bar: "from-violet-600 to-indigo-700",
  other: "from-brand-500 to-brand-700",
};

const UNSPLASH_IMAGES: Record<string, string> = {
  cafe: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80&auto=format&fit=crop",
  restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80&auto=format&fit=crop",
  bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80&auto=format&fit=crop",
  gym: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop",
  barber: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80&auto=format&fit=crop",
  salon: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80&auto=format&fit=crop",
  retail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&auto=format&fit=crop",
  bar: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80&auto=format&fit=crop",
  other: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop",
};

export default function BusinessDetailPage() {
  const params = useParams<{ id: string }>();
  const { t } = useI18n();
  const { user } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [interest, setInterest] = useState<Interest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    Promise.all([
      getBusiness(params.id),
      user?.role === "investor" ? checkInterest(params.id) : Promise.resolve(null),
    ]).then(([b, i]) => {
      setBusiness(b);
      setInterest(i);
      setLoading(false);
    });
  }, [params.id, user]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <p className="font-display text-2xl font-semibold text-brand-900">{t.notFound.title}</p>
        <Link href="/businesses" className="mt-6 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white">
          {t.businessDetail.backToOpportunities}
        </Link>
      </div>
    );
  }

  const cat = CATEGORIES[business.category] ?? CATEGORIES.other;
  const catLabel = t.categories[business.category];
  const owner = business.expand?.owner as User | undefined;
  const hasImage = business.image && business.image.length > 0;
  const imageUrl = hasImage
    ? `${PB_URL}/api/files/businesses/${business.id}/${business.image}`
    : UNSPLASH_IMAGES[business.category] ?? UNSPLASH_IMAGES.other;
  const hasExpressedInterest = !!interest;
  const isOwner = user?.id === business.owner;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link href="/businesses" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 transition-colors hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" />
        {t.businessDetail.backToOpportunities}
      </Link>

      <div className={`relative mt-4 flex h-48 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br ${BANNERS[business.category] ?? BANNERS.other} sm:h-64`}>
        <Image
          src={imageUrl}
          alt={business.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/50" />
        <span className="text-6xl drop-shadow sm:text-7xl" aria-hidden="true">{cat.emoji}</span>
        <div className="absolute left-5 top-5 z-10 flex gap-2">
          <InvestmentPill type={business.investmentType} />
          {business.vetted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-brand-700">
              <BadgeCheck className="h-3.5 w-3.5" />
              {t.businessDetail.vetted}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-ink/55">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {business.city ? `${business.city}${business.country ? ", " + business.country : ""}` : business.location}
            </span>
            <span className="text-ink/30">•</span>
            <span>{catLabel}</span>
          </div>

          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-950 sm:text-4xl">{business.name}</h1>
          <p className="mt-3 text-lg leading-relaxed text-ink/70">{business.pitch}</p>

          {business.description && (
            <div className="mt-6">
              <h2 className="font-display text-lg font-semibold text-brand-900">{t.businessDetail.about}</h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-ink/70">{business.description}</p>
            </div>
          )}

          {business.useOfFunds && (
            <div className="mt-6">
              <h2 className="font-display text-lg font-semibold text-brand-900">{t.businessDetail.useOfFunds}</h2>
              <p className="mt-2 leading-relaxed text-ink/70">{business.useOfFunds}</p>
            </div>
          )}

          {business.revenueRange && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-brand-900">{t.businessDetail.revenueRange}</h3>
              <p className="mt-1 text-sm text-ink/65">{business.revenueRange}</p>
            </div>
          )}

          {/* Private info section */}
          <div className="mt-8">
            {hasExpressedInterest ? (
              <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-brand-900">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  {t.businessDetail.privateInfoUnlocked}
                </h3>
                {business.privateDescription && (
                  <div className="mt-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-ink/45">{t.businessDetail.privateDescription}</p>
                    <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink/70">{business.privateDescription}</p>
                  </div>
                )}
                {business.privateFinancials && (
                  <div className="mt-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-ink/45">{t.businessDetail.privateFinancials}</p>
                    <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink/70">{business.privateFinancials}</p>
                  </div>
                )}
                {business.privateDeckUrl && (
                  <div className="mt-4">
                    <a
                      href={business.privateDeckUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-soft"
                    >
                      <Target className="h-4 w-4" />
                      {t.businessDetail.viewDeck}
                    </a>
                  </div>
                )}
                {interest && (
                  <Link
                    href={`/dashboard/messages/${interest.id}`}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    <MessageSquare className="h-4 w-4" />
                    {t.businessDetail.openConversation}
                  </Link>
                )}
              </div>
            ) : !isOwner ? (
              <div className="rounded-2xl border border-dashed border-cream-300 bg-cream-50 p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-ink/65">
                  <Lock className="h-4 w-4" />
                  {t.businessDetail.privateInfoLocked}
                </h3>
                <p className="mt-2 text-sm text-ink/55">{t.businessDetail.privateInfoLockedBody}</p>
              </div>
            ) : null}
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-cream-200 bg-white p-6 shadow-soft">
            {business.capitalSought && (
              <div className="mb-4">
                <p className="text-sm text-ink/55">{t.businessDetail.capitalSought}</p>
                <p className="font-display text-2xl font-semibold text-brand-900">{business.capitalSought}</p>
              </div>
            )}

            <dl className="space-y-3 border-t border-cream-200 pt-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1.5 text-ink/55"><TrendingUp className="h-4 w-4" /> {t.businessDetail.dealType}</dt>
                <dd><InvestmentPill type={business.investmentType} size="sm" /></dd>
              </div>
            </dl>

            {user?.role === "investor" && !isOwner ? (
              <InterestButton businessId={business.id} />
            ) : !user ? (
              <Link href="/register" className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-800">
                {t.businessDetail.expressInterest}
              </Link>
            ) : isOwner ? (
              <Link href="/dashboard" className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-cream-200 bg-white px-4 py-3 text-sm font-semibold text-brand-800 hover:bg-cream-100">
                {t.businessDetail.editListing}
              </Link>
            ) : null}

            {!hasExpressedInterest && !isOwner && (
              <p className="mt-2 text-center text-xs text-ink/40">{t.businessDetail.expressInterestHint}</p>
            )}
          </div>

          {owner && (
            <div className="mt-4 rounded-2xl border border-cream-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">{t.businessDetail.listedBy}</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-brand-700 font-display text-sm font-bold text-white">
                  {initials(owner.name)}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-brand-900">{owner.name}</p>
                  {owner.company && <p className="text-ink/55">{owner.company}</p>}
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 rounded-2xl border border-cream-200 bg-cream-50 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-brand-900">
              <ShieldCheck className="h-4 w-4 text-brand-600" />
              {t.businessDetail.disclaimerTitle}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-ink/55">{t.businessDetail.disclaimerBody}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function initials(name?: string) {
  if (!name) return "?";
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}
