import React, { Suspense, useCallback, useMemo, useEffect } from "react";
import {
  IconActivity,
  IconApps,
  IconArrowUp,
  IconBriefcase,
  IconChecklist,
  IconCode,
  IconShieldCheck,
  IconStarFilled,
  IconTrendingUp,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import Topbar, { WorkspaceViews } from "../Topbar/Topbar";
import LoadingScreen from "../LoadingScreen";
import { DrawerSkeleton } from "../shared/components/skeletons";
import { NAV_ITEM_DEFS } from "../shared/data";

import { ADMIN_TOOLS } from "../features/admin/tools";
import FavoriteConfirmDialog from "../features/dashboard/FavoriteConfirmDialog";
import DashboardContent from "../features/dashboard/DashboardContent";
import { MAXIMIZED_SECTIONS } from "./constants";
import { useChromeState } from "./hooks/useChromeState";
import { useDashboardState } from "./hooks/useDashboardState";
import { useLoadingState } from "./hooks/useLoadingState";
import { useSearchState } from "./hooks/useSearchState";
import type { AdminToolId, AppItem, CurrentUser, NavItem } from "../shared/types";
import { useMyApps, useFavApps } from "../shared/api/useMyApps";
import { useWorkflowData, useChartData } from "../shared/api/useDashboardData";
import { getFilteredDrawerApps } from "../features/apps/selectors";

const ViewAllAppsDrawer = React.lazy(() => import("../features/apps/ViewAllAppsDrawer"));
const MaximizedOverlays = React.lazy(() => import("../features/dashboard/MaximizedOverlays"));
const AdminToolsOverlay = React.lazy(() => import("../features/admin/AdminToolsOverlay"));

const navIconMap = {
  IconApps,
  IconStarFilled,
  IconChecklist,
  IconActivity,
  IconTrendingUp,
  IconShieldCheck,
  IconCode,
  IconUser,
  IconBriefcase,
  IconUsers,
} as const;

const MOCK_USER = {
  name: "Praveen Kumar",
};

export default function AppShell() {
  const { isLoading } = useLoadingState();
  const {
    apps,
    darkMode,
    isAdmin,
    updateDarkMode,
    manageFavApp,
    fetchApps,
  } = useMyApps({ skipInitialFetch: true });

  const {
    apps: drawerApps,
    fetchApps: fetchDrawerApps,
    setAppFavLocally: setDrawerAppFavLocally,
  } = useMyApps({ skipInitialFetch: true });

  const {
    apps: maximizedApps,
    setApps: setMaximizedApps,
    fetchApps: fetchMaximizedApps,
    setAppFavLocally: setMaximizedAppFavLocally,
  } = useMyApps({ skipInitialFetch: true });

  const {
    apps: cardFavApps,
    fetchApps: fetchCardFavApps,
    setAppFavLocally: setCardFavAppLocally,
  } = useFavApps({ skipInitialFetch: true });

  const {
    apps: drawerFavApps,
    fetchApps: fetchDrawerFavApps,
    setAppFavLocally: setDrawerFavAppLocally,
  } = useFavApps({ skipInitialFetch: true });

  const { workflows, fetchWorkflows } = useWorkflowData();
  const { topAppsData, pieData, fetchChartData } = useChartData();
  const {
    userDropdownOpen,
    setUserDropdownOpen,
    workspaceExpanded,
    setWorkspaceExpanded,
    adminExpanded,
    setAdminExpanded,
    activeSection,
    setActiveSection,
    showBackToTop,
    mainScrollRef,
    userPillRef,
    handleScroll,
    scrollToTop,
    navigateTo,
  } = useChromeState();
  const {
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
  } = useDashboardState(darkMode, workflows);

  const [selectedSearchApp, setSelectedSearchApp] = React.useState<AppItem | null>(null);

  const onSelectApp = React.useCallback((app: AppItem) => {
    setSelectedSearchApp(app);
    setMaximizedApps([app]);
  }, [setMaximizedApps]);

  const [prevMaximizedSection, setPrevMaximizedSection] = React.useState(maximizedSection);
  if (maximizedSection !== prevMaximizedSection) {
    setPrevMaximizedSection(maximizedSection);
    if (maximizedSection === null) {
      setSelectedSearchApp(null);
      setAppSearch("");
    }
  }

  const [confirmFav, setConfirmFav] = React.useState<{ app: AppItem; isAdding: boolean } | null>(null);

  const requestToggleFav = React.useCallback((app: AppItem) => {
    setConfirmFav({ app, isAdding: !app.fav_app });
  }, []);

  const toggleFav = React.useCallback(async (app: AppItem) => {
    if (!app.app_id) return;
    const isFavorite = !app.fav_app;
    const success = await manageFavApp(app.app_id, isFavorite);
    if (success) {
      setDrawerAppFavLocally(app.app_id, isFavorite);
      setMaximizedAppFavLocally(app.app_id, isFavorite);
      setCardFavAppLocally(app.app_id, isFavorite);
      setDrawerFavAppLocally(app.app_id, isFavorite);
    }
    setConfirmFav(null);
  }, [manageFavApp, setDrawerAppFavLocally, setMaximizedAppFavLocally, setCardFavAppLocally, setDrawerFavAppLocally]);

  useEffect(() => {
    if (drawerOpen) {
      if (drawerMode === "favorites") {
        fetchDrawerFavApps({ limit: false });
      } else {
        fetchDrawerApps({
          limit: false,
          details: false,
          dark_mode: false,
        });
      }
    }
  }, [drawerOpen, drawerMode, fetchDrawerApps, fetchDrawerFavApps]);

  useEffect(() => {
    if (selectedSearchApp) return;

    if (appsView === "favorites") {
      fetchCardFavApps({ limit: true });
    } else if (appsView === "all") {
      fetchApps({
        limit: true,
        details: false,
        dark_mode: true,
      });
    }
  }, [appsView, fetchCardFavApps, fetchApps, selectedSearchApp]);

  useEffect(() => {
    if (maximizedSection === MAXIMIZED_SECTIONS.apps) {
      if (selectedSearchApp) {
        return;
      }
      fetchMaximizedApps({
        limit: false,
        details: true,
        dark_mode: false,
      });
    }
    if (
      maximizedSection === MAXIMIZED_SECTIONS.chartBar ||
      maximizedSection === MAXIMIZED_SECTIONS.chartAppsUsage ||
      maximizedSection === MAXIMIZED_SECTIONS.chartPie
    ) {
      fetchChartData();
    }
    if (maximizedSection === MAXIMIZED_SECTIONS.workflow) {
      fetchWorkflows();
    }
  }, [maximizedSection, fetchMaximizedApps, fetchChartData, fetchWorkflows, selectedSearchApp]);

  const currentUser: CurrentUser = useMemo(() => ({
    name: MOCK_USER.name,
    initials: (() => {
      const parts = MOCK_USER.name.trim().split(" ");
      if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    })(),
    isAdmin,
  }), [isAdmin]);

  const [activeAdminTool, setActiveAdminTool] = React.useState<AdminToolId | null>(null);
  const visibleAdminTools = useMemo(
    () => isAdmin ? ADMIN_TOOLS : [],
    [isAdmin],
  );

  const openAdminTool = useCallback((toolId: AdminToolId) => {
    const tool = ADMIN_TOOLS.find((item) => item.id === toolId);
    setActiveAdminTool(
      tool && isAdmin ? toolId : null,
    );
  }, [isAdmin]);
  const closeAdminTool = useCallback(() => setActiveAdminTool(null), []);

  const navActions = useMemo(() => ({
    myApps: () => {
      setActiveSection("dashboard");
      setAppsView("all");
      setAppSearch("");
      setMaximizedSection(MAXIMIZED_SECTIONS.apps);
    },
    favApps: () => {
      setActiveSection("dashboard");
      setAppsView("favorites");
      setAppSearch("");
      setMaximizedSection(MAXIMIZED_SECTIONS.apps);
    },
    workflow: () => {
      setActiveSection("dashboard");
      setMaximizedSection(MAXIMIZED_SECTIONS.workflow);
    },
    chartBar: () => {
      setActiveSection("dashboard");
      setMaximizedSection(MAXIMIZED_SECTIONS.chartBar);
    },
    chartApps: () => {
      setActiveSection("dashboard");
      setMaximizedSection(MAXIMIZED_SECTIONS.chartAppsUsage);
    },
    chartPie: () => {
      setActiveSection("dashboard");
      setMaximizedSection(MAXIMIZED_SECTIONS.chartPie);
    },
    devCenter: () => setActiveSection("dashboard"),
    profile: () => navigateTo("profile"),
    projectSearch: () => navigateTo("project_search"),
    employeeSearch: () => navigateTo("employee_search"),
  }), [navigateTo, setActiveSection, setAppsView, setAppSearch, setMaximizedSection]);

  const navItems = useMemo<NavItem[]>(() => [
    ...NAV_ITEM_DEFS.map((definition) => ({
      type: "nav" as const,
      label: definition.label,
      desc: definition.desc,
      icon: navIconMap[definition.iconName],
      action: navActions[definition.actionKey],
    })),
    ...visibleAdminTools.map((tool) => ({
      type: "nav" as const,
      label: tool.label,
      desc: tool.desc,
      icon: tool.icon,
      action: () => openAdminTool(tool.id),
    })),
  ], [navActions, openAdminTool, visibleAdminTools]);

  const {
    search,
    setSearch,
    mobileSearch,
    setMobileSearch,
    searchOpen,
    setSearchOpen,
    searchInputRef,
    searchContainerRef,
    paletteRef,
    searchResults,
  } = useSearchState(navItems, apps, workflows);

  const filteredDrawerApps = useMemo(() => {
    const baseApps = drawerMode === "favorites" ? drawerFavApps : drawerApps;
    return getFilteredDrawerApps(baseApps, drawerMode, drawerSearch);
  }, [drawerMode, drawerFavApps, drawerApps, drawerSearch]);

  const favoritesCount = useMemo(() => {
    return drawerMode === "favorites"
      ? drawerFavApps.filter((a) => a.fav_app).length
      : drawerApps.filter((a) => a.fav_app).length;
  }, [drawerMode, drawerFavApps, drawerApps]);

  const totalAppsCount = useMemo(() => {
    return drawerMode === "favorites"
      ? drawerFavApps.length
      : drawerApps.length;
  }, [drawerMode, drawerFavApps, drawerApps]);

  if (isLoading) {
    return <LoadingScreen dark={darkMode} />;
  }

  const isOverlayActive = Boolean(maximizedSection || activeAdminTool);

  return (
    <div className={`core-w-full core-h-full ${darkMode ? "core-dark" : ""}`}>
      <div className="core-font-roboto core-antialiased core-scroll-smooth core-min-w-[320px] core-h-screen core-overflow-hidden core-flex core-flex-col core-font-sans core-bg-page-light core-text-textPrimary-light dark:core-bg-page-dark dark:core-text-textPrimary-dark">
        <div className={`core-flex core-flex-col core-h-full ${isOverlayActive ? "core-blur-md core-opacity-60 core-scale-[0.98] core-pointer-events-none" : ""}`}>
          <Topbar
            dark={darkMode}
            setDark={updateDarkMode}
            search={search}
            setSearch={setSearch}
            mobileSearch={mobileSearch}
            setMobileSearch={setMobileSearch}
            searchOpen={searchOpen}
            setSearchOpen={setSearchOpen}
            searchResults={searchResults}
            workflowStatuses={workflowStatuses}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            setAppsView={setAppsView}
            setAppSearch={setAppSearch}
            userDropdownOpen={userDropdownOpen}
            setUserDropdownOpen={setUserDropdownOpen}
            workspaceExpanded={workspaceExpanded}
            setWorkspaceExpanded={setWorkspaceExpanded}
            adminExpanded={adminExpanded}
            setAdminExpanded={setAdminExpanded}
            userPillRef={userPillRef}
            searchInputRef={searchInputRef}
            searchContainerRef={searchContainerRef}
            paletteRef={paletteRef}
            navigateTo={navigateTo}
            setMaximizedSection={setMaximizedSection}
            currentUser={currentUser}
            visibleAdminTools={visibleAdminTools}
            onOpenAdminTool={openAdminTool}
            onSelectApp={onSelectApp}
          />

          <main
            id="main-scroll-container"
            ref={mainScrollRef}
            onScroll={handleScroll}
            className="core-flex-1 core-w-full core-p-3 sm:core-p-4 lg:core-p-6 core-space-y-4 sm:core-space-y-5 core-overflow-y-auto core-overscroll-contain core-custom-scrollbar"
          >
            {activeSection === "dashboard" && (
              <DashboardContent
                myAppsCount={apps.length}
                favoritesCount={apps.filter((a) => a.fav_app).length}
                appsView={appsView}
                appSearch={appSearch}
                filteredCardApps={appsView === "favorites" ? cardFavApps : apps}
                cardEmptyMessage={cardEmptyMessage}
                setAppSearch={setAppSearch}
                setMaximizedSection={setMaximizedSection}
                requestToggleFav={requestToggleFav}
                openDrawer={openDrawer}
                dark={darkMode}
                appUsageRange={appUsageRange}
                setAppUsageRange={setAppUsageRange}
                workflowStatuses={workflowStatuses}
                workflows={workflows}
                topAppsData={topAppsData}
                pieData={pieData}
                openAppsSection={openAppsSection}
              />
            )}

            <WorkspaceViews activeSection={activeSection} setActiveSection={setActiveSection} />
          </main>
        </div>

        <Suspense fallback={
          drawerOpen ? (
            <>
              <div className="core-fixed core-inset-x-0 core-bottom-0 core-top-[41px] sm:core-top-[45px] core-z-40 core-bg-black/45 core-backdrop-blur-[2px] core-opacity-100 core-pointer-events-auto" />
              <div className="core-fixed core-top-[41px] sm:core-top-[45px] core-right-0 core-bottom-0 core-z-40 core-flex core-flex-col core-shadow-2xl core-border-l core-border-borderBase-light dark:core-border-borderBase-dark core-bg-white dark:core-bg-gradient-to-br dark:core-from-[#15132b] dark:core-to-[#1a1730] core-w-full sm:core-w-[clamp(320px,38vw,480px)] core-translate-x-0">
                <DrawerSkeleton />
              </div>
            </>
          ) : null
        }>
          {drawerOpen && (
            <ViewAllAppsDrawer
              drawerOpen={drawerOpen}
              setDrawerOpen={setDrawerOpen}
              drawerMode={drawerMode}
              favoritesCount={favoritesCount}
              drawerSearch={drawerSearch}
              setDrawerSearch={setDrawerSearch}
              filteredDrawerApps={filteredDrawerApps}
              requestToggleFav={requestToggleFav}
              totalAppsCount={totalAppsCount}
            />
          )}
        </Suspense>

        <button
          onClick={scrollToTop}
          className={`core-fixed core-bottom-6 core-right-6 core-z-[60] core-p-3 core-rounded-full core-shadow-2xl core-bg-indigo-600 core-text-white core-transition-all core-duration-300 ${showBackToTop ? "core-opacity-100 core-translate-y-0 core-pointer-events-auto" : "core-opacity-0 core-translate-y-10 core-pointer-events-none"} hover:core-bg-indigo-700`}
          title="Back to Top"
        >
          <IconArrowUp size={20} className="core-stroke-[2.5]" />
        </button>

        <Suspense fallback={null}>
          <MaximizedOverlays
            maximizedSection={maximizedSection}
            appsView={appsView}
            setAppsView={setAppsView}
            appSearch={appSearch}
            setAppSearch={setAppSearch}
            apps={maximizedApps}
            requestToggleFav={requestToggleFav}
            openInfoApp={openInfoApp}
            setOpenInfoApp={setOpenInfoApp}
            setMaximizedSection={setMaximizedSection}
            dark={darkMode}
            workflowStatuses={workflowStatuses}
            workflows={workflows}
            topAppsData={topAppsData}
            pieData={pieData}
            appUsageRange={appUsageRange}
            setAppUsageRange={setAppUsageRange}
            isSingleAppMode={!!selectedSearchApp}
          />
        </Suspense>

        <Suspense fallback={null}>
          <AdminToolsOverlay
            activeAdminTool={activeAdminTool}
            adminTools={ADMIN_TOOLS}
            currentUser={currentUser}
            onClose={closeAdminTool}
          />
        </Suspense>

        <FavoriteConfirmDialog
          confirmFav={confirmFav}
          setConfirmFav={setConfirmFav}
          toggleFav={toggleFav}
        />
      </div>
    </div>
  );
}
