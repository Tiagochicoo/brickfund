import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-cream-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/55">
            The marketplace where local, brick-and-mortar businesses meet
            investors who believe in main street.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-brand-900">Platform</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink/60">
            <li>
              <Link href="/businesses" className="hover:text-brand-700">
                Explore businesses
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-brand-700">
                Raise capital
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-brand-700">
                Become an investor
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-brand-900">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink/60">
            <li>
              <Link href="/#how-it-works" className="hover:text-brand-700">
                How it works
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-brand-700">
                Sign in
              </Link>
            </li>
            <li>
              <span className="cursor-default">Contact</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-ink/45 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Brickfund. All rights reserved.</p>
          <p>Crafted for main street.</p>
        </div>
      </div>
    </footer>
  );
}
