"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { businessImageUrl } from "@/lib/api";
import type { Business } from "@/lib/types";

const MAX_FILES = 6;
const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

export type ImageUploadValue = {
  /** Existing filenames already stored in PocketBase */
  existing: string[];
  /** New local files to upload */
  added: File[];
  /** Existing filenames marked for deletion */
  removed: string[];
};

export function emptyImageUpload(): ImageUploadValue {
  return { existing: [], added: [], removed: [] };
}

export function imageUploadFromBusiness(business: Pick<Business, "image"> | null | undefined): ImageUploadValue {
  if (!business?.image) return emptyImageUpload();
  const existing = Array.isArray(business.image) ? business.image.filter(Boolean) : [business.image];
  return { existing, added: [], removed: [] };
}

/** Apply image fields onto a FormData payload for PocketBase create/update. */
export function appendImagesToFormData(fd: FormData, value: ImageUploadValue) {
  for (const file of value.added) {
    fd.append("image", file);
  }
  for (const name of value.removed) {
    fd.append("image-", name);
  }
}

export default function ImageUpload({
  businessId,
  value,
  onChange,
}: {
  businessId?: string;
  value: ImageUploadValue;
  onChange: (v: ImageUploadValue) => void;
}) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const keptExisting = value.existing.filter((n) => !value.removed.includes(n));
  const total = keptExisting.length + value.added.length;

  useEffect(() => {
    const urls = value.added.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [value.added]);

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    setError(null);
    const next = [...value.added];
    for (const file of Array.from(list)) {
      if (keptExisting.length + next.length >= MAX_FILES) {
        setError(t.listing.imagesMax.replace("{n}", String(MAX_FILES)));
        break;
      }
      if (!file.type.startsWith("image/")) {
        setError(t.listing.imagesType);
        continue;
      }
      if (file.size > MAX_SIZE) {
        setError(t.listing.imagesSize);
        continue;
      }
      next.push(file);
    }
    onChange({ ...value, added: next });
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeExisting(name: string) {
    onChange({ ...value, removed: [...value.removed, name] });
  }

  function removeAdded(index: number) {
    onChange({ ...value, added: value.added.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-ink">{t.listing.images}</p>
          <p className="text-xs text-ink/50">{t.listing.imagesHint}</p>
        </div>
        <span className="text-xs tabular-nums text-ink/45">
          {total}/{MAX_FILES}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {keptExisting.map((name) => {
          const src = businessId
            ? businessImageUrl({ id: businessId, image: name }, name, "400x300")
            : "";
          return (
            <div key={name} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-cream-200 bg-cream-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeExisting(name)}
                className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label={t.listing.imagesRemove}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}

        {value.added.map((file, i) => (
          <div key={`${file.name}-${i}`} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-cream-200 bg-cream-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previews[i]} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAdded(i)}
              className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label={t.listing.imagesRemove}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {total < MAX_FILES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-cream-300 bg-cream-50 text-ink/50 transition-colors hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
          >
            <ImagePlus className="h-5 w-5" />
            <span className="text-xs font-medium">{t.listing.imagesAdd}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />

      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
