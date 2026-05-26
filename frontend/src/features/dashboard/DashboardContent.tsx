import React, { memo, useCallback } from "react";
import {
  IconActivity,
  IconApps,
  IconChecklist,
  IconHistory,
} from "@tabler/icons-react";
import KPICard from "../kpi/KPICard";
import AppSection from "../apps";
import Charts from "../charts";
import DevCenter from "../dev";
import WorkflowTable from "../workflow";
import { IS_DEV } from "../../app/constants";
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

interface DashboardContentProps {
  myAppsCount: number;
  favoritesCount: number;
  appsView: AppsView;
  appSearch: string;
  filteredCardApps: AppItem[];
  cardEmptyMessage: string;
  setAppSearch: React.Dispatch<React.SetStateAction<string>>;
  setMaximizedSection: React.Dispatch<React.SetStateAction<MaximizedSection | null>>;
  requestToggleFav: (app: AppItem) => void;
  openDrawer: (view: AppsView) => void;
  dark: boolean;
  appUsageRange: AppUsageRange;
  setAppUsageRange: React.Dispatch<React.SetStateAction<AppUsageRange>>;
  workflowStatuses: WorkflowStatus[];
  workflows: WorkflowItem[];
  topAppsData: TopAppsData;
  pieData: PieEntry[];
  openAppsSection: (view: AppsView) => void;
}

const DashboardContent = memo(function DashboardContent({
  myAppsCount,
  favoritesCount,
  appsView,
  appSearch,
  filteredCardApps,
  cardEmptyMessage,
  setAppSearch,
  setMaximizedSection,
  requestToggleFav,
  openDrawer,
  dark,
  appUsageRange,
  setAppUsageRange,
  workflowStatuses,
  workflows,
  topAppsData,
  pieData,
  openAppsSection,
}: DashboardContentProps) {
  const scrollToWorkflow = useCallback(() => {
    document.getElementById("workflow-approvals-table")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollToCharts = useCallback(() => {
    document.getElementById("charts-section")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const openAllApps = useCallback(() => openAppsSection("all"), [openAppsSection]);
  const openFavoriteApps = useCallback(() => openAppsSection("favorites"), [openAppsSection]);

  return (
    <>
      <div className="core-grid core-grid-cols-2 sm:core-grid-cols-2 lg:core-grid-cols-4 core-gap-2.5 sm:core-gap-4 xl:core-gap-5">
        <KPICard
          icon={IconApps}
          label="My Apps"
          className="core-bg-gradient-to-br core-from-blue-600 core-to-blue-800"
          iconClassName="core-bg-white/20"
          onClick={openAllApps}
        />
        <KPICard
          icon={IconHistory}
          label="Fav Apps"
          className="core-bg-gradient-to-br core-from-emerald-600 core-to-emerald-800"
          iconClassName="core-bg-white/20"
          onClick={openFavoriteApps}
        />
        <KPICard
          icon={IconChecklist}
          label="My Tasks"
          className="core-bg-gradient-to-br core-from-orange-500 core-to-orange-700"
          iconClassName="core-bg-white/20"
          onClick={scrollToWorkflow}
        />
        <KPICard
          icon={IconActivity}
          label="Visual Insights"
          className="core-bg-gradient-to-br core-from-indigo-500 core-to-indigo-700"
          iconClassName="core-bg-white/20"
          onClick={scrollToCharts}
        />
      </div>

      <div className="core-grid core-grid-cols-1 md:core-grid-cols-2 lg:core-grid-cols-5 core-gap-3 sm:core-gap-4 xl:core-gap-5">
        <AppSection
          isDev={IS_DEV}
          appsView={appsView}
          myAppsCount={myAppsCount}
          favoritesCount={favoritesCount}
          appSearch={appSearch}
          filteredCardApps={filteredCardApps}
          cardEmptyMessage={cardEmptyMessage}
          setAppSearch={setAppSearch}
          setMaximizedSection={setMaximizedSection}
          requestToggleFav={requestToggleFav}
          openDrawer={openDrawer}
        />
        {IS_DEV && <DevCenter />}
      </div>

      <Charts
        dark={dark}
        appUsageRange={appUsageRange}
        setAppUsageRange={setAppUsageRange}
        setMaximizedSection={setMaximizedSection}
        topAppsData={topAppsData}
        pieData={pieData}
        workflows={workflows}
      />

      <WorkflowTable workflowStatuses={workflowStatuses} workflows={workflows} setMaximizedSection={setMaximizedSection} />

      <div className="core-rounded-2xl core-px-5 core-py-3 core-flex core-flex-wrap core-items-center core-justify-between core-gap-2 core-text-[11px] core-bg-cardAlt-light dark:core-bg-cardAlt-dark core-border core-border-borderBase-light dark:core-border-borderBase-dark core-text-textMuted-light dark:core-text-textMuted-dark">
        <span>© 2026 pFirst 2.0 · Tata Motors</span>
      </div>
    </>
  );
});

export default DashboardContent;


