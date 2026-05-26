import type { AppItem } from "./types";

export function throttle<T extends (...args: Parameters<T>) => void>(fn: T, ms: number): T {
  let last = 0;
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  }) as T;
}

export function getWorkflowStatus(pending: number, dark: boolean) {
  const isCritical = pending > 10;
  const isWarning = pending > 5 && pending <= 10;
  const dotColor = isCritical ? "#f43f5e" : isWarning ? "#f97316" : "#10b981";
  const alpha = dark ? "0.15" : "0.1";
  const badgeBg = isCritical
    ? `rgba(244,63,94,${alpha})`
    : isWarning ? `rgba(249,115,22,${alpha})` : `rgba(16,185,129,${alpha})`;
  const badgeText = isCritical
    ? dark ? "#fb7185" : "#e11d48"
    : isWarning ? dark ? "#fb923c" : "#ea580c" : dark ? "#34d399" : "#059669";
  const badgeBorder = isCritical
    ? "rgba(244,63,94,0.25)"
    : isWarning ? "rgba(249,115,22,0.25)" : "rgba(16,185,129,0.25)";
  return { dotColor, badgeBg, badgeText, badgeBorder };
}

export function filterApps(apps: AppItem[], query: string) {
  if (!query) return apps;
  const q = query.toLowerCase();
  return apps.filter((app) => app.name.toLowerCase().includes(q) || app.tag.toLowerCase().includes(q));
}

export function getAccessTypeStyle(type: string) {
  const t = type?.toLowerCase() || "private";
  if (t === "private") {
    return "core-bg-sky-400/15 core-text-sky-500 dark:core-text-sky-300 core-border-sky-400/30 dark:core-border-sky-400/40";
  }
  if (t === "public") {
    return "core-bg-emerald-500/10 core-text-emerald-600 dark:core-text-emerald-400 core-border-emerald-500/10 dark:core-border-emerald-500/20";
  }
  return "core-bg-slate-500/10 core-text-slate-600 dark:core-text-slate-400 core-border-slate-500/10 dark:core-border-slate-500/20";
}
