"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, BadgeCheck } from "lucide-react";
import type { Business } from "@/lib/types";
import { imageFilenames, businessImageUrl } from "@/lib/api";
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
  const names = imageFilenames(business);
  const imageUrl = names.length
    ? businessImageUrl(business, names[0], "800x600")
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
          unoptimized={imageUrl.includes("/api/files/")}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/50" />

        <div className="absolute left-3 top-3 z-10 flex gap-1.5">
          <InvestmentPill type={business.investmentType} size="sm" />
          {business.vetted && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
              <BadgeCheck className="h-3 w-3" />
              {t.businessDetail.vetted}
            </span>
          )}
        </div>
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

        {business.capitalSought && (
          <div className="mt-auto">
            <p className="text-xs text-ink/50">{t.businessDetail.capitalSought}</p>
            <p className="font-display text-sm font-semibold text-brand-800">{business.capitalSought}</p>
          </div>
        )}
      </div>
    </Link>
  );
}
