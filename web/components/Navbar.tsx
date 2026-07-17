"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "@/lib/auth";

const LINKS = [
  { href: "/businesses", label: "Explore" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#for-investors", label: "For investors" },
];

export default function Navbar() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-cream-100 hover:text-brand-800"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-cream-100" />
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-cream-100 hover:text-brand-800"
              >
                Dashboard
              </Link>
              <Link
                href="/logout"
                className="rounded-lg border border-cream-200 px-3.5 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-cream-100"
              >
                Sign out
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-cream-100"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-800"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg text-brand-900 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-cream-200 bg-cream-50 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-cream-100"
              >
                {l.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-cream-200" />
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-cream-100"
                >
                  Dashboard
                </Link>
                <Link
                  href="/logout"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-cream-200 px-3 py-2.5 text-center text-sm font-medium text-ink/80"
                >
                  Sign out
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-cream-100"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-brand-700 px-3 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
