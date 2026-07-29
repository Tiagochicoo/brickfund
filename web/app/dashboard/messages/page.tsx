"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { getPb } from "@/lib/pb";
import { getMessages, sendMessage, updateInterestStatus } from "@/lib/api";
import type { Interest, Message, User } from "@/lib/types";
import { Button } from "@/components/ui";

export default function MessagesListPage() {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    const pb = getPb();
    (async () => {
      try {
        const filter = user.role === "investor"
          ? `investor = "${user.id}"`
          : `business.owner = "${user.id}"`;
        const res = await pb.collection("interests").getList<Interest>(1, 50, {
          filter,
          sort: "-updated",
          expand: "investor,business",
        });
        setInterests(res.items as unknown as Interest[]);
      } catch {
        /* empty */
      } finally {
        setFetching(false);
      }
    })();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" />
        {t.interest.viewConversation}
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-brand-950">
        {t.messages.title}
      </h1>
      <p className="mt-1 text-ink/60">{t.messages.subtitle}</p>

      {fetching ? (
        <div className="mt-8 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl border border-cream-200 bg-white" />
          ))}
        </div>
      ) : interests.length > 0 ? (
        <div className="mt-8 space-y-3">
          {interests.map((interest) => {
            const counterparty = user.role === "investor"
              ? interest.expand?.investor as User | undefined
              : interest.expand?.investor as User | undefined;
            const biz = interest.expand?.business;
            const statusBadge = getStatusBadge(interest.status, t);

            return (
              <Link
                key={interest.id}
                href={`/dashboard/messages/${interest.id}`}
                className="flex items-center gap-4 rounded-2xl border border-cream-200 bg-white p-4 shadow-soft transition-all hover:border-brand-300 hover:shadow-card"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-100 font-display text-sm font-bold text-brand-700">
                  {initials(counterparty?.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold text-brand-900">
                      {counterparty?.name ?? "User"}
                    </span>
                    {statusBadge}
                  </div>
                  {biz && (
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
                <MessageSquare className="h-5 w-5 shrink-0 text-brand-500" />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-cream-200 bg-white py-14 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <MessageSquare className="h-6 w-6" />
          </div>
          <p className="mt-3 font-display text-lg font-semibold text-brand-900">
            {t.messages.emptyTitle}
          </p>
          <p className="mt-1 text-sm text-ink/55">{t.messages.emptyBody}</p>
        </div>
      )}
    </div>
  );
}

function getStatusBadge(status: string, t: ReturnType<typeof useI18n>["t"]) {
  const styles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    declined: "bg-rose-50 text-rose-700 ring-rose-200",
    withdrawn: "bg-zinc-50 text-zinc-600 ring-zinc-200",
  };
  const labels: Record<string, string> = {
    pending: t.messages.pending,
    accepted: t.messages.accepted,
    declined: t.messages.declined,
    withdrawn: t.messages.withdrawn,
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${styles[status] ?? styles.pending}`}>
      {labels[status] ?? status}
    </span>
  );
}

function initials(name?: string) {
  if (!name) return "?";
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}
