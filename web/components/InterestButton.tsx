"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Loader2, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui";
import { expressInterest, checkInterest } from "@/lib/api";
import { getPb } from "@/lib/pb";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import type { Interest } from "@/lib/types";

export function InterestButton({ businessId, businessOwner }: { businessId: string; businessOwner?: string }) {
  const { user } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [existing, setExisting] = useState<Interest | null>(null);
  const [message, setMessage] = useState("");
  const [ticketSize, setTicketSize] = useState("");
  const [done, setDone] = useState(false);

  async function handleClick() {
    if (!user) {
      router.push(`/login?next=/businesses/${businessId}`);
      return;
    }
    if (user.role !== "investor") return;

    setBusy(true);
    const check = await checkInterest(businessId);
    setExisting(check);
    if (check) {
      setDone(true);
    }
    setShowModal(true);
    setBusy(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const created = await expressInterest({ businessId, message, ticketSize });
      setExisting(created);
      setDone(true);

      // Create in-app notification for the business owner
      if (businessOwner) {
        try {
          const pb = getPb();
          await pb.collection("notifications").create({
            recipient: businessOwner,
            type: "interest_received",
            title: `${user?.name ?? "An investor"} is interested in your business`,
            body: message || `${user?.name ?? "Someone"} expressed interest.`,
            link: `/dashboard/messages/${created.id}`,
            read: false,
            actor: user?.id ?? "",
          });
        } catch {
          /* best effort */
        }
      }
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  }

  if (done && existing) {
    return (
      <Link
        href={`/dashboard/messages/${existing.id}`}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-800"
      >
        <MessageSquare className="h-4 w-4" />
        {t.interest.viewConversation}
      </Link>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={busy}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-800 disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />}
        {t.interest.expressInterest}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-brand-900">
                {done ? t.interest.sentTitle : t.interest.expressInterest}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-ink/40 hover:text-ink/70">
                <X className="h-5 w-5" />
              </button>
            </div>

            {done ? (
              <div className="mt-4">
                <p className="text-sm text-ink/65">{t.interest.sentBody}</p>
                {existing && (
                  <Link
                    href={`/dashboard/messages/${existing.id}`}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white"
                  >
                    <MessageSquare className="h-4 w-4" />
                    {t.interest.viewConversation}
                  </Link>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-ink/70">{t.interest.ticketSizeLabel}</label>
                  <input
                    value={ticketSize}
                    onChange={(e) => setTicketSize(e.target.value)}
                    placeholder="€25,000 - €50,000"
                    className="mt-1 w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink/70">{t.interest.messageLabel}</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder={t.interest.messagePlaceholder}
                    className="mt-1 w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <p className="text-xs text-ink/45">{t.interest.disclaimer}</p>
                <Button type="submit" disabled={busy}>
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t.interest.send}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
