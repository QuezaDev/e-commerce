"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useMemo, useSyncExternalStore } from "react";

import { useStoredState } from "@/hooks/useStoredState";

export const THEME_STORAGE_KEY = "coringao-loko-theme";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = Exclude<ThemePreference, "system">;

export interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  onThemeChange?: (
    resolvedTheme: ResolvedTheme,
    preference: ThemePreference,
  ) => void;
}

const serializeTheme = (theme: ThemePreference) => theme;

const deserializeTheme = (value: string): ThemePreference => {
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }

  throw new Error("Preferência de tema inválida.");
};

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getServerSystemTheme(): ResolvedTheme {
  return "light";
}

function subscribeToSystemTheme(onChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", onChange);

  return () => mediaQuery.removeEventListener("change", onChange);
}

export function ThemeToggle({
  className,
  showLabel = false,
  onThemeChange,
}: ThemeToggleProps) {
  const [preference, setPreference, { isHydrated }] =
    useStoredState<ThemePreference>(THEME_STORAGE_KEY, "system", {
      deserialize: deserializeTheme,
      serialize: serializeTheme,
    });
  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemTheme,
    getServerSystemTheme,
  );
  const resolvedTheme = preference === "system" ? systemTheme : preference;

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
    onThemeChange?.(resolvedTheme, preference);
  }, [isHydrated, onThemeChange, preference, resolvedTheme]);

  const nextTheme: ResolvedTheme = resolvedTheme === "dark" ? "light" : "dark";
  const accessibleLabel =
    nextTheme === "dark" ? "Ativar tema escuro" : "Ativar tema claro";
  const classes = useMemo(
    () => ["icon-button", "theme-toggle", className].filter(Boolean).join(" "),
    [className],
  );

  return (
    <button
      className={classes}
      type="button"
      aria-label={accessibleLabel}
      aria-pressed={resolvedTheme === "dark"}
      title={accessibleLabel}
      data-theme-current={resolvedTheme}
      onClick={() => setPreference(nextTheme)}
    >
      {nextTheme === "dark" ? (
        <Moon aria-hidden="true" size={20} strokeWidth={2} />
      ) : (
        <Sun aria-hidden="true" size={20} strokeWidth={2} />
      )}
      {showLabel ? (
        <span className="theme-toggle__label">{accessibleLabel}</span>
      ) : null}
    </button>
  );
}
