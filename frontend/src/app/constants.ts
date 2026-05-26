import type { AppUsageRange, MaximizedSection } from "../shared/types";

export const IS_DEV = true;
export const LOADING_SCREEN_DELAY_MS = 1500;

export const APP_USAGE_RANGES: AppUsageRange[] = ["daily", "monthly", "yearly"];

export const MAXIMIZED_SECTIONS = {
  apps: "apps",
  workflow: "workflow",
  chartBar: "chart-bar",
  chartAppsUsage: "chart-apps-usage",
  chartPie: "chart-pie",
} as const satisfies Record<string, MaximizedSection>;
