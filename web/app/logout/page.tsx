"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function LogoutPage() {
  const { logout, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      logout();
    }
    const t = setTimeout(() => router.replace("/login"), 700);
    return () => clearTimeout(t);
  }, [user, logout, router]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
      <p className="text-sm font-medium text-ink/60">Signing you out…</p>
    </div>
  );
}
