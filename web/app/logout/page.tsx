"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export default function LogoutPage() {
  const { logout, user } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      logout();
    }
    const timer = setTimeout(() => router.replace("/login"), 700);
    return () => clearTimeout(timer);
  }, [user, logout, router]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
      <p className="text-sm font-medium text-ink/60">{t.auth.signingOut}</p>
    </div>
  );
}
