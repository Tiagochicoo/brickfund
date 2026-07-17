import Link from "next/link";

export default function Logo({
  className = "",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  const text = light ? "text-white" : "text-brand-900";
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2 ${className}`}
      aria-label="Brickfund home"
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 shadow-soft ring-1 ring-brand-900/10">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-gold-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 21h18" />
          <path d="M5 21V10l7-5 7 5v11" />
          <path d="M9 21v-6h6v6" />
        </svg>
      </span>
      <span className={`font-display text-xl font-semibold tracking-tight ${text}`}>
        Brick<span className="text-gold-500">fund</span>
      </span>
    </Link>
  );
}
