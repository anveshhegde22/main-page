import React from "react";
const MaximizedAppsView = React.lazy(() => import("../apps/MaximizedAppsView"));
const MaximizedPendingActivitiesChart = React.lazy(() => import("../charts/MaximizedPendingActivitiesChart"));
const MaximizedAppsUsageChart = React.lazy(() => import("../charts/MaximizedAppsUsageChart"));
const MaximizedRequestStatusChart = React.lazy(() => import("../charts/MaximizedRequestStatusChart"));
const MaximizedWorkflowTable = React.lazy(() => import("../workflow/MaximizedWorkflowTable"));
import { MAXIMIZED_SECTIONS } from "../../app/constants";
import { MaximizedAppsSkeleton, MaximizedWorkflowSkeleton, MaximizedChartSkeleton } from "../../shared/components/skeletons";
import type {
  AppItem,
  AppUsageRange,
  AppsView,
  MaximizedSection,
  PieEntry,
  TopAppsData,
  WorkflowItem,
  WorkflowStatus,
} from "../../shared/types";

interface MaximizedOverlaysProps {
  maximizedSection: MaximizedSection | null;
  appsView: AppsView;
  setAppsView: React.Dispatch<React.SetStateAction<AppsView>>;
  appSearch: string;
  setAppSearch: React.Dispatch<React.SetStateAction<string>>;
  apps: AppItem[];
  requestToggleFav: (app: AppItem) => void;
  openInfoApp: string | null;
  setOpenInfoApp: React.Dispatch<React.SetStateAction<string | null>>;
  setMaximizedSection: React.Dispatch<React.SetStateAction<MaximizedSection | null>>;
  dark: boolean;
  workflowStatuses: WorkflowStatus[];
  workflows: WorkflowItem[];
  topAppsData: TopAppsData;
  pieData: PieEntry[];
  appUsageRange: AppUsageRange;
  setAppUsageRange: React.Dispatch<React.SetStateAction<AppUsageRange>>;
  isSingleAppMode?: boolean;
}

export default function MaximizedOverlays({
  maximizedSection,
  appsView,
  setAppsView,
  appSearch,
  setAppSearch,
  apps,
  requestToggleFav,
  openInfoApp,
  setOpenInfoApp,
  setMaximizedSection,
  dark,
  workflowStatuses,
  workflows,
  topAppsData,
  pieData,
  appUsageRange,
  setAppUsageRange,
  isSingleAppMode,
}: MaximizedOverlaysProps) {
  if (!maximizedSection) {
    return null;
  }

  return (
    <div className="core-fixed core-inset-0 core-z-[100]">
      <>
        {maximizedSection === MAXIMIZED_SECTIONS.apps && (
          <React.Suspense fallback={<MaximizedAppsSkeleton />}>
            <MaximizedAppsView
              appsView={appsView}
              setAppsView={setAppsView}
              appSearch={appSearch}
              setAppSearch={setAppSearch}
              apps={apps}
              requestToggleFav={requestToggleFav}
              openInfoApp={openInfoApp}
              setOpenInfoApp={setOpenInfoApp}
              setMaximizedSection={setMaximizedSection}
              isSingleAppMode={isSingleAppMode}
            />
          </React.Suspense>
        )}
        {maximizedSection === MAXIMIZED_SECTIONS.workflow && (
          <React.Suspense fallback={<MaximizedWorkflowSkeleton />}>
            <MaximizedWorkflowTable
              dark={dark}
              workflowStatuses={workflowStatuses}
              workflows={workflows}
              setMaximizedSection={setMaximizedSection}
            />
          </React.Suspense>
        )}
        {maximizedSection === MAXIMIZED_SECTIONS.chartBar && (
          <React.Suspense fallback={<MaximizedChartSkeleton />}>
            <MaximizedPendingActivitiesChart
              dark={dark}
              workflows={workflows}
              setMaximizedSection={setMaximizedSection}
            />
          </React.Suspense>
        )}
        {maximizedSection === MAXIMIZED_SECTIONS.chartAppsUsage && (
          <React.Suspense fallback={<MaximizedChartSkeleton />}>
            <MaximizedAppsUsageChart
              dark={dark}
              appUsageRange={appUsageRange}
              setAppUsageRange={setAppUsageRange}
              topAppsData={topAppsData}
              setMaximizedSection={setMaximizedSection}
            />
          </React.Suspense>
        )}
        {maximizedSection === MAXIMIZED_SECTIONS.chartPie && (
          <React.Suspense fallback={<MaximizedChartSkeleton />}>
            <MaximizedRequestStatusChart
              setMaximizedSection={setMaximizedSection}
              pieData={pieData}
            />
          </React.Suspense>
        )}
      </>
    </div>
  );
}
