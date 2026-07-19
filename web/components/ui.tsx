import type {
  InputHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import Link from "next/link";

export function Label({
  htmlFor,
  children,
  hint,
}: {
  htmlFor?: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-brand-900"
    >
      {children}
      {hint && <span className="ml-1 text-xs font-normal text-ink/45">{hint}</span>}
    </label>
  );
}

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      suppressHydrationWarning
      className={`w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm text-ink shadow-sm outline-none transition-all placeholder:text-ink/35 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 ${className}`}
      {...props}
    />
  );
}

export function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "ghost" | "outline";
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    primary:
      "bg-brand-700 text-white shadow-soft hover:bg-brand-800 active:bg-brand-900",
    outline:
      "border border-cream-200 bg-white text-brand-800 hover:bg-cream-100",
    ghost: "text-ink/70 hover:bg-cream-100",
  };
  return (
    <button
      type={type}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <p className="mt-2 text-xs font-medium text-rose-600">{children}</p>
  );
}

export function AuthSwitch({
  href,
  label,
}: {
  href: string;
  label: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-semibold text-brand-700 underline-offset-2 hover:underline"
    >
      {label}
    </Link>
  );
}
