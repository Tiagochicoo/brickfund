import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl font-semibold text-brand-800">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-brand-950">
        Page not found
      </h1>
      <p className="mt-2 text-ink/60">
        The page or listing you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white"
      >
        Back home
      </Link>
    </div>
  );
}
