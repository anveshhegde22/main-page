import React, { memo, useCallback, useMemo, useState, useEffect } from "react";
import {
  IconBuildingSkyscraper,
  IconFingerprint,
  IconGridDots,
  IconInfoCircle,
  IconMinimize,
  IconPointFilled,
  IconSearch,
  IconStar,
  IconStarFilled,
  IconTag,
  IconUser,
} from "@tabler/icons-react";
import { SearchInput } from "../../shared/components/ui";
import { getAccessTypeStyle } from "../../shared/utils";
import type { AppItem, AppsView, MaximizedSection } from "../../shared/types";
import { useScrollLock } from "../../app/hooks/useScrollLock";

interface MaximizedAppsViewProps {
  appsView: AppsView;
  setAppsView: React.Dispatch<React.SetStateAction<AppsView>>;
  appSearch: string;
  setAppSearch: React.Dispatch<React.SetStateAction<string>>;
  apps: AppItem[];
  requestToggleFav: (app: AppItem) => void;
  openInfoApp: string | null;
  setOpenInfoApp: React.Dispatch<React.SetStateAction<string | null>>;
  setMaximizedSection: React.Dispatch<React.SetStateAction<MaximizedSection | null>>;
  isSingleAppMode?: boolean;
}

const detailClassNames = {
  indigo: "core-bg-indigo-500/10 core-text-indigo-500",
  sky: "core-bg-sky-500/10 core-text-sky-500",
  emerald: "core-bg-emerald-500/10 core-text-emerald-500",
  rose: "core-bg-rose-500/10 core-text-rose-500",
} as const;

function getAppDetails(
  app: AppItem,
  info: { category?: string; sponsor_department?: string; lead?: string } | null,
  loading: boolean,
  error: boolean
) {
  return [
    { label: "App ID", val: app.app_id?.toString() || app.details?.appId || "—", icon: IconFingerprint, className: detailClassNames.indigo },
    { label: "Category", val: loading ? "Loading..." : error ? "Error" : (info?.category || app.category || app.details?.cat || "—"), icon: IconTag, className: detailClassNames.sky },
    { label: "Sponsor", val: loading ? "Loading..." : error ? "Error" : (info?.sponsor_department || app.sponsor_department || app.details?.sponsorDept || "—"), icon: IconBuildingSkyscraper, className: detailClassNames.emerald },
    { label: "Lead", val: loading ? "Loading..." : error ? "Error" : (info?.lead || app.lead || app.details?.coordinator || "—"), icon: IconUser, className: detailClassNames.rose },
  ];
}

interface MaximizedAppCardProps {
  app: AppItem;
  isFav: boolean;
  isInfoOpen: boolean;
  onToggleInfo: (name: string) => void;
  onToggleFav: (app: AppItem) => void;
}

const MaximizedAppCard = memo(function MaximizedAppCard({
  app,
  isFav,
  isInfoOpen,
  onToggleInfo,
  onToggleFav,
}: MaximizedAppCardProps) {
  const [info, setInfo] = useState<{ category?: string; sponsor_department?: string; lead?: string } | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [errorInfo, setErrorInfo] = useState(false);

  useEffect(() => {
    if (isInfoOpen && !info && !loadingInfo && app.app_id) {
      const fetchInfo = async () => {
        setLoadingInfo(true);
        setErrorInfo(false);
        try {
          const response = await fetch("http://localhost:3001/mainpage/get-app-info", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ app_id: app.app_id }),
          });
          const data = await response.json();
          if (data?.statusCode === "10000" && data.data?.app_data?.[0]) {
            const appData = data.data.app_data[0];
            setInfo({
              category: appData.category,
              sponsor_department: appData.sponsor_department,
              lead: appData.lead,
            });
          } else {
            setErrorInfo(true);
          }
        } catch (err) {
          console.error("Error fetching app info:", err);
          setErrorInfo(true);
        } finally {
          setLoadingInfo(false);
        }
      };
      fetchInfo();
    }
  }, [isInfoOpen, info, loadingInfo, app.app_id]);

  const details = useMemo(() => getAppDetails(app, info, loadingInfo, errorInfo), [app, info, loadingInfo, errorInfo]);
  const handleInfo = useCallback(() => onToggleInfo(app.name), [app.name, onToggleInfo]);
  const handleFavorite = useCallback(() => onToggleFav(app), [app, onToggleFav]);

  return (
    <div className={`core-bg-card-light dark:core-bg-card-dark core-rounded-2xl core-p-5 core-border core-border-borderBase-light dark:core-border-borderBase-dark hover:core-border-indigo-500/30 core-transition-all core-duration-300 core-group core-flex core-flex-col ${isInfoOpen ? "core-ring-1 core-ring-indigo-500/30" : ""}`}>
      <div className="core-flex core-items-center core-justify-between core-mb-4">
        <div className="core-w-12 core-h-12 core-rounded-xl core-flex core-items-center core-justify-center core-border" style={{ background: `${app.dot}20`, borderColor: `${app.dot}40` }}>
          <IconPointFilled size={18} style={{ color: app.dot }} />
        </div>
        <div className="core-flex core-items-center core-gap-3 sm:core-gap-4">
          <div className="core-flex core-items-center core-gap-1.5 sm:core-gap-2">
            <button
              onClick={handleInfo}
              className={`core-w-8 core-h-8 core-flex core-items-center core-justify-center core-rounded-lg core-transition-all ${isInfoOpen ? "core-bg-indigo-500/10 core-text-indigo-500" : "hover:core-bg-black/5 dark:hover:core-bg-white/5 core-text-textMuted-light"}`}
              title="View Details"
            >
              <IconInfoCircle size={18} />
            </button>

            <div className={`core-w-[80px] core-flex core-items-center core-justify-center core-px-2 core-py-1 core-rounded-lg core-text-[10px] core-font-black core-uppercase core-tracking-wider core-border ${getAccessTypeStyle(app.accessType)}`}>
              {app.accessType}
            </div>

            <button
              onClick={handleFavorite}
              className={`core-w-8 core-h-8 core-flex core-items-center core-justify-center core-rounded-lg core-transition-all ${isFav ? "core-bg-yellow-500/10" : "hover:core-bg-black/5 dark:hover:core-bg-white/5"}`}
              title={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              {isFav ? <IconStarFilled size={18} className="core-text-yellow-500" /> : <IconStar size={18} className="core-text-textMuted-light" />}
            </button>
          </div>
        </div>
      </div>
      <h3 className="core-text-[15px] core-font-bold core-text-textPrimary-light dark:core-text-textPrimary-dark">{app.name}</h3>
      <p className="core-text-xs core-text-textMuted-light dark:core-text-textMuted-dark core-mt-1 core-truncate" title={app.tag}>{app.tag}</p>

      <div className={`core-overflow-hidden core-transition-all core-duration-500 ${isInfoOpen ? "core-max-h-[300px] core-mt-4 core-opacity-100" : "core-max-h-0 core-opacity-0"}`}>
        <div className="core-grid core-grid-cols-2 core-gap-2.5">
          {details.map((detail) => {
            const IconNode = detail.icon;
            return (
              <div
                key={detail.label}
                className="core-flex core-flex-col core-gap-1.5 core-p-2.5 core-rounded-xl core-bg-black/4 dark:core-bg-white/4 core-border core-border-borderBase-light/50 dark:core-border-borderBase-dark/50 core-transition-all hover:core-bg-indigo-500/5 hover:core-border-indigo-500/20 core-group/tile"
              >
                <div className="core-flex core-items-center core-gap-2">
                  <div className={`core-w-6 core-h-6 core-rounded-lg core-flex core-items-center core-justify-center ${detail.className}`}>
                    <IconNode size={12} stroke={2.5} />
                  </div>
                  <span className="core-text-[9px] core-font-black core-uppercase core-tracking-widest core-text-textMuted-light/70 dark:core-text-textMuted-dark/70">{detail.label}</span>
                </div>
                {loadingInfo && detail.label !== "App ID" ? (
                  <div className="core-h-4 core-w-20 core-bg-black/10 dark:core-bg-white/10 core-animate-pulse core-rounded core-pl-1 core-mt-0.5" />
                ) : (
                  <span className="core-text-[11px] core-font-bold core-text-textPrimary-light dark:core-text-textPrimary-dark core-truncate core-pl-1" title={detail.val}>
                    {detail.val}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="core-mt-auto core-pt-4">
        <div className="core-h-px core-bg-borderBase-light dark:core-bg-borderBase-dark core-mb-4" />
        <button onClick={() => window.open(`/pFirst/app${app.app_id}/1`, "_blank")} className="core-w-full core-py-2 core-rounded-lg core-bg-indigo-500/10 core-text-indigo-600 core-text-xs core-font-bold hover:core-bg-indigo-600 hover:core-text-white core-transition-all">Launch Application</button>
      </div>
    </div>
  );
});

function MaximizedAppsView({
  appsView,
  setAppsView,
  appSearch,
  setAppSearch,
  apps,
  requestToggleFav,
  openInfoApp,
  setOpenInfoApp,
  setMaximizedSection,
  isSingleAppMode,
}: MaximizedAppsViewProps) {
  useScrollLock();
  const filteredApps = useMemo(() => {
    let result = apps;
    if (appsView === "favorites") {
      result = result.filter(a => a.fav_app);
    }
    const search = appSearch.toLowerCase();
    if (search) {
      result = result.filter(a =>
        (a.app_id?.toString() || "").includes(search) ||
        a.name.toLowerCase().includes(search) ||
        a.tag.toLowerCase().includes(search) ||
        (a.category || a.details?.cat || "").toLowerCase().includes(search) ||
        (a.sponsor_department || a.details?.sponsorDept || "").toLowerCase().includes(search) ||
        (a.lead || a.details?.coordinator || "").toLowerCase().includes(search)
      );
    }
    return result;
  }, [apps, appsView, appSearch]);
  const closeOverlay = useCallback(() => setMaximizedSection(null), [setMaximizedSection]);
  const showAllApps = useCallback(() => setAppsView("all"), [setAppsView]);
  const showFavoriteApps = useCallback(() => setAppsView("favorites"), [setAppsView]);
  const toggleInfoApp = useCallback((name: string) => {
    setOpenInfoApp((current) => current === name ? null : name);
  }, [setOpenInfoApp]);

  return (
    <div className="core-flex core-h-full core-flex-col core-bg-page-light dark:core-bg-page-dark core-animate-in core-zoom-in-95 core-duration-300">
      <header className="core-flex core-flex-wrap core-items-start core-justify-between core-gap-3 core-px-4 sm:core-px-6 core-py-1.5 sm:core-py-2 core-border-b core-border-borderBase-light dark:core-border-borderBase-dark core-bg-white/50 dark:core-bg-black/20 core-backdrop-blur-md">
        <div className="core-flex core-min-w-0 core-flex-1 core-items-center core-gap-3">
          <div className="core-w-8 core-h-8 core-rounded-lg core-bg-gradient-to-br core-from-indigo-500 core-to-purple-600 core-flex core-items-center core-justify-center core-shadow-lg core-shadow-indigo-500/20">
            <IconGridDots color="#fff" size={16} />
          </div>
          <div className="core-min-w-0">
            <h2 className="core-text-sm sm:core-text-base core-font-bold core-text-textPrimary-light dark:core-text-textPrimary-dark">
              {isSingleAppMode ? "Application Overview" : appsView === "favorites" ? "Favorite Applications" : "My Applications"}
            </h2>
          </div>
        </div>
        <button
          onClick={closeOverlay}
          className="core-flex core-items-center core-gap-2 core-px-3.5 sm:core-px-4 core-py-2 core-rounded-xl core-bg-rose-500/10 core-text-rose-600 dark:core-text-rose-400 core-font-bold core-text-sm core-transition-all hover:core-bg-rose-500 hover:core-text-white dark:hover:core-text-white core-group"
        >
          <IconMinimize size={18} className="core-group-hover:core-text-white" />
          <span className="core-group-hover:core-text-white">Minimize</span>
        </button>
      </header>

      <div className="core-flex-1 core-min-h-0 core-p-4 sm:core-p-6 lg:core-p-8 core-overflow-y-auto core-custom-scrollbar">
        <div className="core-space-y-4 sm:core-space-y-6">
          {!isSingleAppMode && (
            <div className="core-flex core-flex-col lg:core-flex-row lg:core-items-center lg:core-justify-between core-gap-4">
              <SearchInput
                value={appSearch}
                onChange={setAppSearch}
                placeholder="Search across all applications..."
                compact
                className="core-w-full lg:core-flex-1 lg:core-max-w-md core-bg-white dark:core-bg-white/5"
                showClear
              />
              <div className="core-flex core-flex-wrap core-items-center core-gap-2">
                <button
                  onClick={showAllApps}
                  className={`core-px-4 core-py-2 core-rounded-lg core-text-sm core-font-semibold core-transition-all ${appsView === "all" ? "core-bg-indigo-600 core-text-white" : "core-bg-indigo-500/10 core-text-indigo-600"}`}
                >
                  All Apps
                </button>
                <button
                  onClick={showFavoriteApps}
                  className={`core-px-4 core-py-2 core-rounded-lg core-text-sm core-font-semibold core-transition-all ${appsView === "favorites" ? "core-bg-indigo-600 core-text-white" : "core-bg-indigo-500/10 core-text-indigo-600"}`}
                >
                  Favorites
                </button>
              </div>
            </div>
          )}
          <div className="core-grid core-grid-cols-1 sm:core-grid-cols-2 lg:core-grid-cols-3 core-gap-6">
            {filteredApps.length === 0 ? (
              <div className="core-col-span-full core-flex core-flex-col core-items-center core-justify-center core-py-20 core-gap-4">
                <div className="core-w-16 core-h-16 core-rounded-3xl core-flex core-items-center core-justify-center core-bg-indigo-500/8 dark:core-bg-indigo-500/10">
                  <IconSearch size={28} className="core-text-indigo-500/60 dark:core-text-indigo-400/60" />
                </div>
                <div className="core-text-center">
                  <p className="core-text-[15px] core-font-bold core-text-textPrimary-light dark:core-text-textPrimary-dark">No matching apps found</p>
                  <p className="core-text-[12px] core-text-textMuted-light dark:core-text-textMuted-dark core-mt-1">Try refining your search terms or check your favorites.</p>
                </div>
              </div>
            ) : filteredApps.map((app) => (
              <MaximizedAppCard
                key={app.app_id}
                app={app}
                isFav={app.fav_app ?? false}
                isInfoOpen={openInfoApp === app.name}
                onToggleInfo={toggleInfoApp}
                onToggleFav={requestToggleFav}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(MaximizedAppsView);
