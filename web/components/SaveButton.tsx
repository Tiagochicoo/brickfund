"use client";

import { useEffect, useState } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { saveBusiness, unsaveBusiness, isBusinessSaved } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export function SaveButton({ businessId }: { businessId: string }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user?.role !== "investor") return;
    isBusinessSaved(businessId).then(setSaved);
  }, [user, businessId]);

  async function toggle() {
    if (!user) return;
    setBusy(true);
    try {
      if (saved) {
        await unsaveBusiness(businessId);
        setSaved(false);
      } else {
        await saveBusiness(businessId);
        setSaved(true);
      }
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  }

  if (user?.role !== "investor") return null;

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink/70 transition-all hover:bg-cream-100 disabled:opacity-50"
      title={saved ? "Remove from saved" : "Save for later"}
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Bookmark className={`h-4 w-4 ${saved ? "fill-brand-700 text-brand-700" : ""}`} />
      )}
      {saved ? "Saved" : "Save"}
    </button>
  );
}
