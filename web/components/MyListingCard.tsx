"use client";

import { useState } from "react";
import { Eye, EyeOff, Trash2, Loader2, AlertTriangle, X } from "lucide-react";
import BusinessCard from "./BusinessCard";
import { getPb } from "@/lib/pb";
import { useI18n } from "@/lib/i18n";
import type { Business } from "@/lib/types";

export default function MyListingCard({
  business,
  onDelete,
}: {
  business: Business;
  onDelete: (id: string) => void;
}) {
  const { t } = useI18n();
  const [published, setPublished] = useState(business.published);
  const [toggling, setToggling] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function toggleVisibility() {
    const next = !published;
    setToggling(true);
    try {
      await getPb().collection("businesses").update(business.id, { published: next });
      setPublished(next);
    } catch {
      setPublished(business.published);
    } finally {
      setToggling(false);
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await getPb().collection("businesses").delete(business.id);
      onDelete(business.id);
      setConfirmOpen(false);
    } catch {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col">
      <div className="relative">
        <BusinessCard business={{ ...business, published }} />
        <span
          className={`absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${
            published
              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
              : "bg-slate-100 text-slate-500 ring-slate-300"
          }`}
        >
          {published ? (
            <>
              <Eye className="h-3 w-3" /> {t.dashboard.publishedLabel}
            </>
          ) : (
            <>
              <EyeOff className="h-3 w-3" /> {t.dashboard.hiddenLabel}
            </>
          )}
        </span>
      </div>

      {/* Management bar */}
      <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-cream-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleVisibility}
            disabled={toggling}
            role="switch"
            aria-checked={published}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
              published ? "bg-brand-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                published ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm font-medium text-ink/70">
            {toggling ? t.dashboard.saving : published ? t.dashboard.visibleToInvestors : t.dashboard.hiddenFromMarketplace}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
        >
          <Trash2 className="h-4 w-4" />
          {t.dashboard.delete}
        </button>
      </div>

      {/* Delete confirmation modal */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => !deleting && setConfirmOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-brand-950">
                    {t.dashboard.deleteTitle}
                  </h3>
                  <p className="text-sm text-ink/55">
                    {t.dashboard.deleteWarning}
                  </p>
                </div>
              </div>
              <button
                onClick={() => !deleting && setConfirmOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-ink/40 hover:bg-cream-100"
                disabled={deleting}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-cream-50 p-3">
              <p className="text-sm font-medium text-brand-900">{business.name}</p>
              <p className="text-xs text-ink/50">{business.location}</p>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
                className="flex-1 rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink/70 transition-colors hover:bg-cream-100"
              >
                {t.dashboard.cancel}
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t.dashboard.deleting}
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    {t.dashboard.deleteConfirmBtn}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
