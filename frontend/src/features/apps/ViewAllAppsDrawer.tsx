import { memo, useCallback } from "react";
import { IconGridDots, IconSearch, IconX } from "@tabler/icons-react";
import { AppRow, SearchInput } from "../../shared/components/ui";
import type { AppItem, AppsView } from "../../shared/types";
import { useScrollLock } from "../../app/hooks/useScrollLock";


interface ViewAllAppsDrawerProps {
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  drawerMode: AppsView;
  favoritesCount: number;
  drawerSearch: string;
  setDrawerSearch: React.Dispatch<React.SetStateAction<string>>;
  filteredDrawerApps: AppItem[];
  requestToggleFav: (app: AppItem) => void;
  totalAppsCount: number;
}

function ViewAllAppsDrawer({
  drawerOpen,
  setDrawerOpen,
  drawerMode,
  favoritesCount,
  drawerSearch,
  setDrawerSearch,
  filteredDrawerApps,
  requestToggleFav,
  totalAppsCount,
}: ViewAllAppsDrawerProps) {
  useScrollLock(drawerOpen);
  const closeDrawer = useCallback(() => setDrawerOpen(false), [setDrawerOpen]);

  return (
    <>
      <div
        className={`core-fixed core-inset-x-0 core-bottom-0 core-top-[41px] sm:core-top-[45px] core-z-40 core-bg-black/45 core-backdrop-blur-[2px] ${drawerOpen ? "core-opacity-100 core-pointer-events-auto" : "core-opacity-0 core-pointer-events-none"}`}
        onClick={closeDrawer}
      />

      <div className={`core-fixed core-top-[41px] sm:core-top-[45px] core-right-0 core-bottom-0 core-z-40 core-flex core-flex-col core-shadow-2xl core-border-l core-border-borderBase-light dark:core-border-borderBase-dark core-bg-white dark:core-bg-gradient-to-br dark:core-from-[#15132b] dark:core-to-[#1a1730] core-w-full sm:core-w-[clamp(320px,38vw,480px)] ${drawerOpen ? "core-translate-x-0" : "core-translate-x-full"}`}>
        <div className="core-flex core-items-center core-justify-between core-px-5 core-py-3 core-flex-shrink-0 core-border-b core-border-borderBase-light dark:core-border-borderBase-dark core-bg-gradient-to-r core-from-indigo-500/6 core-to-purple-500/4 dark:core-from-indigo-500/12 dark:core-to-purple-500/8">
          <div className="core-flex core-items-center core-gap-3">
            <div className="core-w-9 core-h-9 core-rounded-xl core-bg-gradient-to-br core-from-violet-500 core-to-indigo-600 core-flex core-items-center core-justify-center core-shadow-lg core-shadow-violet-500/30">
              <IconGridDots size={16} color="#fff" />
            </div>
            <div>
              <p className="core-text-sm core-font-bold core-leading-tight core-text-textPrimary-light dark:core-text-textPrimary-dark">
                {drawerMode === "favorites" ? "Favorite Apps" : "All Apps"}
              </p>
              <p className="core-text-[11px] core-text-textMuted-light dark:core-text-textMuted-dark">
                {drawerMode === "favorites" ? `${favoritesCount} favourite${favoritesCount !== 1 ? "s" : ""}` : `${totalAppsCount} applications`}
              </p>
            </div>
          </div>
          <button onClick={closeDrawer} className="core-w-8 core-h-8 core-rounded-lg core-flex core-items-center core-justify-center core-transition-all core-duration-200 hover:core-bg-black/5 dark:hover:core-bg-white/10 core-text-textMuted-light dark:core-text-textMuted-dark">
            <IconX size={16} stroke={2.2} />
          </button>
        </div>

        <div className="core-px-4 core-py-3 core-flex-shrink-0 core-border-b core-border-borderBase-light dark:core-border-borderBase-dark">
          <SearchInput value={drawerSearch} onChange={setDrawerSearch} placeholder="Search all apps…" autoFocus={drawerOpen} showClear />
        </div>

        <div className="core-flex-1 core-overflow-y-auto core-overscroll-contain core-py-2 core-custom-scrollbar">
          {filteredDrawerApps.length === 0 ? (
            <div className="core-flex core-flex-col core-items-center core-justify-center core-py-16 core-gap-3">
              <div className="core-w-12 core-h-12 core-rounded-2xl core-flex core-items-center core-justify-center core-bg-indigo-500/8 dark:core-bg-indigo-500/10">
                <IconSearch size={20} className="core-text-textMuted-light dark:core-text-textMuted-dark" />
              </div>
              <p className="core-text-[12px] core-font-semibold core-text-textMuted-light dark:core-text-textMuted-dark">No apps found</p>
              <p className="core-text-[11px] core-text-textMuted-light dark:core-text-textMuted-dark core-opacity-60">Try a different search term</p>
            </div>
          ) : (
            filteredDrawerApps.map((app) => (
              <AppRow key={app.name} app={app} isFav={app.fav_app ?? false} onToggleFav={requestToggleFav} compact />
            ))
          )}
        </div>

        <div className="core-px-5 core-py-3.5 core-flex-shrink-0 core-flex core-items-center core-justify-between core-border-t core-border-borderBase-light dark:core-border-borderBase-dark">
          <p className="core-text-[11px] core-text-textMuted-light dark:core-text-textMuted-dark">{filteredDrawerApps.length} of {totalAppsCount} apps</p>
          <button onClick={closeDrawer} className="core-text-[12px] core-font-semibold core-px-3.5 core-py-1.5 core-rounded-lg core-transition-all core-duration-200 core-bg-indigo-500/12 core-text-[#818cf8]">Close</button>
        </div>
      </div>
    </>
  );
}

export default memo(ViewAllAppsDrawer);
