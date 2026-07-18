"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Business } from "@/lib/types";
import { PB_URL } from "@/lib/types";
import { formatCurrency, pct } from "@/lib/constants";
import InvestmentPill from "./InvestmentPill";
import { useI18n } from "@/lib/i18n";

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

export default function BusinessCard({ business }: { business: Business }) {
  const { t } = useI18n();
  const catLabel = t.categories[business.category];
  const percent = pct(business.fundingRaised, business.fundingGoal);
  const funded = percent >= 100;
  const hasImage = business.image && business.image.length > 0;
  const imageUrl = hasImage
    ? `${PB_URL}/api/files/businesses/${business.id}/${business.image}`
    : UNSPLASH_IMAGES[business.category] ?? UNSPLASH_IMAGES.other;

  return (
    <Link
      href={`/businesses/${business.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
    >
      <div className="relative flex h-32 items-center justify-center">
        <Image
          src={imageUrl}
          alt={business.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/50" />
        
        <div className="absolute left-3 top-3 z-10">
          <InvestmentPill type={business.investmentType} size="sm" />
        </div>
        {funded && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-brand-700 ring-1 ring-white/60">
            {t.businessDetail.fundedBadge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-lg font-semibold leading-snug text-brand-900 transition-colors group-hover:text-brand-600">
            {business.name}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-ink/55">
            <MapPin className="h-3.5 w-3.5" />
            {business.city ? `${business.city}${business.country ? ", " + business.country : ""}` : business.location}
            <span className="mx-1 text-ink/30">•</span>
            {catLabel}
          </p>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-ink/70">
          {business.pitch}
        </p>

        <div className="mt-auto">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-brand-800">
              {formatCurrency(business.fundingRaised)}
            </span>
            <span className="text-ink/50">
              {t.misc.of} {formatCurrency(business.fundingGoal)}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-cream-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] font-medium text-ink/45">
            {percent}% {t.misc.raised}
          </p>
        </div>
      </div>
    </Link>
  );
}