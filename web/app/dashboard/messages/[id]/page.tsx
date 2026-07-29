"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle2, XCircle, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { getPb } from "@/lib/pb";
import { getMessages, sendMessage, updateInterestStatus } from "@/lib/api";
import type { Interest, Message, User, Business } from "@/lib/types";
import { Button } from "@/components/ui";

export default function ConversationPage() {
  const params = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const [interest, setInterest] = useState<Interest | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [fetching, setFetching] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !params.id) return;
    const pb = getPb();
    (async () => {
      try {
        const interestData = await pb.collection("interests").getOne<Interest>(params.id, {
          expand: "investor,business",
        });
        setInterest(interestData as unknown as Interest);
        const msgs = await getMessages(params.id);
        setMessages(msgs);
      } catch {
        /* not found */
      } finally {
        setFetching(false);
      }
    })();
  }, [user, params.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !interest || !user) return;

    // Determine recipient
    const recipientId = user.role === "investor" ? interest.expand?.business?.owner : interest.investor;
    if (!recipientId) return;

    setBusy(true);
    try {
      const msg = await sendMessage({
        interestId: interest.id,
        recipientId,
        body: body.trim(),
      });
      setMessages((prev) => [...prev, msg]);
      setBody("");
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  }

  async function handleAccept() {
    if (!interest) return;
    setBusy(true);
    try {
      await updateInterestStatus(interest.id, "accepted");
      setInterest({ ...interest, status: "accepted" });
    } finally {
      setBusy(false);
    }
  }

  async function handleDecline() {
    if (!interest) return;
    setBusy(true);
    try {
      await updateInterestStatus(interest.id, "declined");
      setInterest({ ...interest, status: "declined" });
    } finally {
      setBusy(false);
    }
  }

  if (loading || fetching) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!interest) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <p className="font-display text-2xl font-semibold text-brand-900">{t.notFound.title}</p>
        <Link href="/dashboard/messages" className="mt-6 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white">
          {t.messages.title}
        </Link>
      </div>
    );
  }

  const business = interest.expand?.business as Business | undefined;
  const counterparty = user?.role === "investor"
    ? (interest.expand?.investor as User | undefined)
    : (interest.expand?.investor as User | undefined);
  const isBusinessOwner = user?.role === "business";
  const interestAccepted = interest.status === "accepted";

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-cream-200 py-4">
        <Link href="/dashboard/messages" className="text-ink/40 hover:text-brand-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-lg font-semibold text-brand-900">
            {business?.name ?? "Conversation"}
          </h1>
          <p className="truncate text-xs text-ink/55">
            {counterparty?.name ?? "User"}
            {counterparty?.company ? ` · ${counterparty.company}` : ""}
          </p>
        </div>
        <StatusPill status={interest.status} t={t} />
      </div>

      {/* Accept/Decline for business owners */}
      {isBusinessOwner && interest.status === "pending" && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="flex-1 text-sm text-amber-900">
            {counterparty?.name} expressed interest. Accept to open private information sharing.
          </p>
          <button
            onClick={handleAccept}
            disabled={busy}
            className="inline-flex items-center gap-1 rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {t.messages.accept}
          </button>
          <button
            onClick={handleDecline}
            disabled={busy}
            className="inline-flex items-center gap-1 rounded-lg border border-cream-200 px-3 py-1.5 text-xs font-semibold text-ink/60 disabled:opacity-50"
          >
            <XCircle className="h-3.5 w-3.5" />
            {t.messages.decline}
          </button>
        </div>
      )}

      {/* Private info notice */}
      {interestAccepted && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 p-3">
          <Lock className="h-4 w-4 text-brand-600" />
          <p className="flex-1 text-sm text-brand-800">
            {t.messages.privateInfoAvailable}
          </p>
          {business && (
            <Link href={`/businesses/${business.id}`} className="text-xs font-semibold text-brand-700 underline">
              View
            </Link>
          )}
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto py-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <p className="text-sm text-ink/45">{t.messages.placeholder}</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    isMine
                      ? "bg-brand-700 text-white"
                      : "bg-cream-100 text-ink/80"
                  }`}
                >
                  {msg.type !== "text" && (
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider opacity-70">
                      {msg.attachmentLabel || msg.type}
                    </p>
                  )}
                  <p className="whitespace-pre-line leading-relaxed">{msg.body}</p>
                  {msg.attachmentUrl && (
                    <a
                      href={msg.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-1 inline-block text-xs underline ${isMine ? "text-white/80" : "text-brand-700"}`}
                    >
                      {msg.attachmentLabel || "Open attachment"}
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      {interest.status !== "declined" && interest.status !== "withdrawn" && (
        <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-cream-200 py-4">
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t.messages.placeholder}
            className="flex-1 rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
          />
          <button
            type="submit"
            disabled={busy || !body.trim()}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-700 text-white transition-colors hover:bg-brand-800 disabled:opacity-40"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </form>
      )}
    </div>
  );
}

function StatusPill({ status, t }: { status: string; t: ReturnType<typeof useI18n>["t"] }) {
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
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ${styles[status] ?? styles.pending}`}>
      {labels[status] ?? status}
    </span>
  );
}
