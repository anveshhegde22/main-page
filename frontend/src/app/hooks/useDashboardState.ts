import { useCallback, useMemo, useState } from "react";
import { getWorkflowStatus } from "../../shared/utils";
import { getCardEmptyMessage } from "../../features/apps/selectors";
import { APP_USAGE_RANGES } from "../constants";
import type { AppUsageRange, AppsView, MaximizedSection, WorkflowItem, WorkflowStatus } from "../../shared/types";

export function useDashboardState(dark: boolean, workflows: WorkflowItem[]) {
  const [appSearch, setAppSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState("");
  const [appsView, setAppsView] = useState<AppsView>("all");
  const [drawerMode, setDrawerMode] = useState<AppsView>("all");
  const [maximizedSection, setMaximizedSection] = useState<MaximizedSection | null>(null);
  const [openInfoApp, setOpenInfoApp] = useState<string | null>(null);
  const [appUsageRange, setAppUsageRange] = useState<AppUsageRange>(APP_USAGE_RANGES[0]);

  const workflowStatuses = useMemo<WorkflowStatus[]>(
    () => workflows.map((row) => ({ id: row.id, ...getWorkflowStatus(row.pending, dark) })),
    [workflows, dark],
  );

  const cardEmptyMessage = useMemo(
    () => getCardEmptyMessage(appsView, 0),
    [appsView],
  );

  const openDrawer = useCallback((mode: AppsView) => {
    setDrawerMode(mode);
    setDrawerOpen(true);
    setDrawerSearch("");
  }, []);

  const openAppsSection = useCallback((view: AppsView) => {
    setAppsView(view);
    document.getElementById("my-apps-section")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return {
    appSearch,
    setAppSearch,
    drawerOpen,
    setDrawerOpen,
    drawerSearch,
    setDrawerSearch,
    appsView,
    setAppsView,
    drawerMode,
    maximizedSection,
    setMaximizedSection,
    openInfoApp,
    setOpenInfoApp,
    appUsageRange,
    setAppUsageRange,
    workflowStatuses,
    cardEmptyMessage,
    openDrawer,
    openAppsSection,
  };
}
