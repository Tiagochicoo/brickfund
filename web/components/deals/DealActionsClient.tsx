"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Tiny helper to refresh the deals list after actions in the deal room.
export function DealActionsClient() {
  const router = useRouter();
  useEffect(() => {
    const handler = () => router.refresh();
    window.addEventListener("deal-updated", handler);
    return () => window.removeEventListener("deal-updated", handler);
  }, [router]);
  return null;
}
