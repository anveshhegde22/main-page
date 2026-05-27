import { memo, useCallback } from "react";
import { IconChevronRight, IconGridDots, IconMaximize } from "@tabler/icons-react";
import { AppRow, SearchInput } from "../../shared/components/ui";
import { MAXIMIZED_SECTIONS } from "../../app/constants";
import type { AppItem, AppsView, MaximizedSection } from "../../shared/types";

interface AppSectionProps {
  isDev: boolean;
  appsView: AppsView;
  myAppsCount: number;
  favoritesCount: number;
  appSearch: string;
  filteredCardApps: AppItem[];
  cardEmptyMessage: string;
  setAppSearch: React.Dispatch<React.SetStateAction<string>>;
  setMaximizedSection: React.Dispatch<React.SetStateAction<MaximizedSection | null>>;
  requestToggleFav: (app: AppItem) => void;
  openDrawer: (view: AppsView) => void;
}

function AppSection({
  isDev,
  appsView,
  // myAppsCount,
  // favoritesCount,
  appSearch,
  filteredCardApps,
  cardEmptyMessage,
  setAppSearch,
  setMaximizedSection,
  requestToggleFav,
  openDrawer,
}: AppSectionProps) {
  const maximizeApps = useCallback(() => {
    setMaximizedSection(MAXIMIZED_SECTIONS.apps);
  }, [setMaximizedSection]);
  const openCurrentDrawer = useCallback(() => openDrawer(appsView), [appsView, openDrawer]);

  return (
    <div id="my-apps-section" className={`md:core-col-span-1 ${isDev ? "lg:core-col-span-3" : "lg:core-col-span-5"} core-rounded-2xl core-overflow-hidden core-shadow-lg core-bg-card-light dark:core-bg-card-dark core-border core-border-borderBase-light dark:core-border-borderBase-dark`}>
      <div className="core-flex core-items-center core-justify-between core-px-4 sm:core-px-5 core-py-2.5 core-border-b core-border-borderBase-light dark:core-border-borderBase-dark core-gap-2">
        <div className="core-flex core-items-center core-gap-2.5 core-min-w-0">
          <div className="core-w-8 core-h-8 core-rounded-xl core-bg-gradient-to-br core-from-violet-500 core-to-indigo-600 core-flex core-items-center core-justify-center core-shadow-lg core-shadow-violet-500/25 core-flex-shrink-0">
            <IconGridDots size={15} color="#fff" />
          </div>
          <div className="core-min-w-0">
            <p className="core-text-sm core-font-bold core-leading-tight core-text-textPrimary-light dark:core-text-textPrimary-dark core-truncate">
              {appsView === "favorites" ? "Favorite Apps" : "My Apps"}
            </p>
            <p className="core-text-[11px] core-text-textMuted-light dark:core-text-textMuted-dark core-truncate">
              {appsView === "favorites" ? `Quick Access` : `All Applications`}
            </p>
          </div>
        </div>
        <div className="core-flex core-items-center core-gap-1 lg:core-gap-3 core-flex-shrink-0">
          <div className="core-w-32 xs:core-w-44 lg:core-w-52">
            <SearchInput
              value={appSearch}
              onChange={setAppSearch}
              placeholder="Search…"
              compact
              showClear
              className="core-rounded-full core-w-full"
            />
          </div>
          <button
            onClick={maximizeApps}
            className="core-p-1.5 core-rounded-lg core-transition-all hover:core-bg-black/5 dark:hover:core-bg-white/10 core-text-textMuted-light dark:core-text-textMuted-dark"
            title="Maximize"
          >
            <IconMaximize size={16} />
          </button>
        </div>
      </div>

      <div className="core-divide-y core-divide-borderBase-light dark:core-divide-borderBase-dark">
        {filteredCardApps.length === 0
          ? <div className="core-px-5 core-py-8 core-text-center core-text-[12px] core-text-textMuted-light dark:core-text-textMuted-dark">{cardEmptyMessage}</div>
          : filteredCardApps.map((app) => (
            <AppRow key={app.app_id} app={app} isFav={app.fav_app ?? false} onToggleFav={requestToggleFav} compact />
          ))}
      </div>

      {filteredCardApps.length >= 3 && (
        <div className="core-px-5 core-py-3 core-border-t core-border-borderBase-light dark:core-border-borderBase-dark">
          <button
            onClick={openCurrentDrawer}
            className="core-text-xs core-font-semibold core-flex core-items-center core-gap-1 core-transition-all core-duration-200 hover:core-gap-2 core-text-[#818cf8]"
          >
            {appsView === "favorites" ? "View all favorite apps" : "View all apps"} <IconChevronRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(AppSection);
