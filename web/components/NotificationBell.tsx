"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { getPb } from "@/lib/pb";
import { useAuth } from "@/lib/auth";

export function NotificationBell() {
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    const pb = getPb();

    async function fetchUnread() {
      try {
        const res = await pb.collection("notifications").getList(1, 1, {
          filter: `recipient = "${user?.id}" && read = false`,
        });
        setUnread(res.totalItems);
      } catch {
        /* ignore */
      }
    }

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) return null;

  return (
    <Link
      href="/dashboard"
      className="relative rounded-lg px-2 py-2 text-ink/70 transition-colors hover:bg-cream-100 hover:text-brand-800"
      aria-label="Notifications"
    >
      <Bell className="h-4 w-4" />
      {unread > 0 && (
        <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}
