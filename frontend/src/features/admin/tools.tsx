import React from "react";
import { IconDashboard } from "@tabler/icons-react";
import type { AdminToolDefinition } from "../../shared/types";

export const ADMIN_TOOLS = [
  {
    id: "app-summary",
    label: "Application Summary",
    desc: "Application portfolio metrics and usage analysis",
    icon: IconDashboard,
    Component: React.lazy(() => import("./AppSummary")),
  },
] as const satisfies readonly AdminToolDefinition[];

