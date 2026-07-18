"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "system") {
      setTheme(actualTheme === "dark" ? "light" : "dark");
    } else {
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="grid h-9 w-9 place-items-center rounded-lg border border-cream-200 bg-cream-50 text-brand-900 transition-all hover:bg-cream-100 dark:border-brand-700/30 dark:bg-brand-800/50 dark:text-gold-300 dark:hover:bg-brand-800/70"
      aria-label={actualTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={actualTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {actualTheme === "dark" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  );
}