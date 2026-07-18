"use client";

import Link from "next/link";
import Logo from "./Logo";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-20 border-t border-cream-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/55">
            {t.footer.tagline}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-brand-900">{t.footer.platform}</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink/60">
            <li>
              <Link href="/businesses" className="hover:text-brand-700">
                {t.footer.exploreBusinesses}
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-brand-700">
                {t.footer.raiseCapital}
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-brand-700">
                {t.footer.becomeInvestor}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-brand-900">{t.footer.company}</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink/60">
            <li>
              <Link href="/#how-it-works" className="hover:text-brand-700">
                {t.footer.howItWorks}
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-brand-700">
                {t.footer.signIn}
              </Link>
            </li>
            <li>
              <span className="cursor-default">{t.footer.contact}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-ink/45 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Brickfund. {t.footer.rights}</p>
          <p>{t.footer.crafted}</p>
        </div>
      </div>
    </footer>
  );
}
