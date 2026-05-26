import {
  IconArrowUpRight,
  IconChecklist,
  IconChevronRight,
  IconPointFilled,
  IconSearch,
  IconStarFilled,
} from "@tabler/icons-react";
import { MAXIMIZED_SECTIONS } from "../app/constants";
import { getAccessTypeStyle, getWorkflowStatus } from "../shared/utils";
import type { ActiveSection, AppItem, AppsView, MaximizedSection, SearchResults, WorkflowStatus } from "../shared/types";

interface GlobalSearchModalProps {
  dark: boolean;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchResults: SearchResults;
  workflowStatuses: WorkflowStatus[];
  setActiveSection: React.Dispatch<React.SetStateAction<ActiveSection>>;
  setAppsView: React.Dispatch<React.SetStateAction<AppsView>>;
  setAppSearch: React.Dispatch<React.SetStateAction<string>>;
  paletteRef: React.RefObject<HTMLDivElement | null>;
  setMaximizedSection: React.Dispatch<React.SetStateAction<MaximizedSection | null>>;
  onSelectApp: (app: AppItem) => void;
}

export default function GlobalSearchModal({
  dark,
  search,
  setSearch,
  setSearchOpen,
  searchResults,
  workflowStatuses,
  setActiveSection,
  setAppsView,
  setAppSearch,
  paletteRef,
  setMaximizedSection,
  onSelectApp,
}: GlobalSearchModalProps) {
  return (
    <div
      className="core-fixed core-inset-0 core-z-[150] core-flex core-items-start core-justify-center core-pt-[70px] sm:core-pt-[80px] core-px-3 sm:core-px-6"
      onClick={() => {
        setSearchOpen(false);
        setSearch("");
      }}
    >
      <div className="core-absolute core-inset-0 core-bg-black/40 core-backdrop-blur-sm" />
      <div
        ref={paletteRef}
        onClick={(event) => event.stopPropagation()}
        className="core-relative core-w-full core-max-w-2xl core-rounded-2xl core-shadow-[0_32px_80px_rgba(0,0,0,0.45)] core-border core-border-white/10 core-bg-white dark:core-bg-[#16132e] core-overflow-hidden core-animate-in core-fade-in core-slide-in-from-top-4 core-duration-200"
      >
        <div className="core-flex core-items-center core-gap-3 core-px-4 core-py-3.5 core-border-b core-border-borderBase-light dark:core-border-borderBase-dark core-bg-gradient-to-r core-from-indigo-500/5 core-to-purple-500/5">
          <IconSearch size={16} className="core-text-indigo-500 core-flex-shrink-0" />
          <span className="core-flex-1 core-text-[14px] core-font-medium core-text-textPrimary-light dark:core-text-textPrimary-dark core-truncate">{search}</span>
          <kbd className="core-px-1.5 core-py-0.5 core-rounded core-bg-black/8 dark:core-bg-white/10 core-text-[10px] core-font-bold core-text-textMuted-light dark:core-text-textMuted-dark">ESC</kbd>
        </div>

        <div className="core-max-h-[60vh] core-overflow-y-auto core-custom-scrollbar">
          {searchResults.nav.length === 0 && searchResults.apps.length === 0 && searchResults.workflows.length === 0 && (
            <div className="core-flex core-flex-col core-items-center core-justify-center core-py-14 core-gap-3 core-text-center">
              <div className="core-w-12 core-h-12 core-rounded-2xl core-bg-indigo-500/8 core-flex core-items-center core-justify-center">
                <IconSearch size={22} className="core-text-indigo-400" />
              </div>
              <p className="core-text-[14px] core-font-semibold core-text-textPrimary-light dark:core-text-textPrimary-dark">No results for &ldquo;{search}&rdquo;</p>
              <p className="core-text-[12px] core-text-textMuted-light dark:core-text-textMuted-dark">Try searching for an app name, workflow, or section</p>
            </div>
          )}

          {searchResults.workflows.length > 0 && (
            <div className="core-px-3 core-pt-3 core-pb-1">
              <p className="core-px-2 core-pb-1.5 core-text-[10px] core-font-black core-uppercase core-tracking-widest core-text-textMuted-light dark:core-text-textMuted-dark">Workflow Insights</p>
              {searchResults.workflows.map((workflow) => {
                const fallback = getWorkflowStatus(workflow.pending, dark);
                const { dotColor, badgeBg, badgeText, badgeBorder } = workflowStatuses.find((status) => status.id === workflow.id) ?? fallback;
                return (
                  <button
                    key={workflow.id}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearch("");
                      setActiveSection("dashboard");
                      setMaximizedSection(MAXIMIZED_SECTIONS.workflow);
                    }}
                    className="core-w-full core-flex core-items-center core-gap-3 core-px-3 core-py-2.5 core-rounded-xl core-text-left core-transition-all hover:core-bg-indigo-500/8 dark:hover:core-bg-indigo-500/12 core-group"
                  >
                    <div className="core-w-9 core-h-9 core-rounded-xl core-flex core-items-center core-justify-center core-flex-shrink-0 core-border" style={{ background: `${dotColor}18`, borderColor: `${dotColor}30` }}>
                      <IconChecklist size={15} style={{ color: dotColor }} />
                    </div>
                    <div className="core-flex-1 core-min-w-0">
                      <p className="core-text-[12px] core-font-bold core-text-textPrimary-light dark:core-text-textPrimary-dark core-truncate">{workflow.workflow}</p>
                      <p className="core-text-[11px] core-text-textMuted-light dark:core-text-textMuted-dark">{workflow.app}</p>
                    </div>
                    <div className="core-flex core-items-center core-gap-2 core-flex-shrink-0">
                      <span className="core-px-2.5 core-py-1 core-rounded-full core-text-[10px] core-font-bold core-border" style={{ background: badgeBg, color: badgeText, borderColor: badgeBorder }}>
                        {workflow.pending} pending
                      </span>
                      <IconArrowUpRight size={13} className="core-opacity-0 core-group-hover:core-opacity-60 core-transition-opacity core-text-textMuted-light dark:core-text-textMuted-dark" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {searchResults.apps.length > 0 && (
            <div className="core-px-3 core-pt-3 core-pb-1">
              <p className="core-px-2 core-pb-1.5 core-text-[10px] core-font-black core-uppercase core-tracking-widest core-text-textMuted-light dark:core-text-textMuted-dark">Applications</p>
              {searchResults.apps.map((app, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchOpen(false);
                    setSearch("");
                    setActiveSection("dashboard");
                    setAppsView("all");
                    setAppSearch(app.name);
                    setMaximizedSection(MAXIMIZED_SECTIONS.apps);
                    onSelectApp(app);
                  }}
                  className="core-w-full core-flex core-items-center core-gap-3 core-px-3 core-py-2.5 core-rounded-xl core-text-left core-transition-all hover:core-bg-indigo-500/8 dark:hover:core-bg-indigo-500/12 core-group"
                >
                  <div className="core-w-9 core-h-9 core-rounded-xl core-flex core-items-center core-justify-center core-flex-shrink-0 core-border" style={{ background: `${app.dot}18`, borderColor: `${app.dot}35` }}>
                    <IconPointFilled size={14} style={{ color: app.dot }} />
                  </div>
                  <div className="core-flex-1 core-min-w-0">
                    <p className="core-text-[12px] core-font-bold core-text-textPrimary-light dark:core-text-textPrimary-dark core-truncate">{app.name}</p>
                    <p className="core-text-[11px] core-text-textMuted-light dark:core-text-textMuted-dark core-truncate">{app.tag}</p>
                  </div>
                  <div className="core-flex core-items-center core-gap-1.5 core-flex-shrink-0">
                    {app.fav_app && <IconStarFilled size={12} className="core-text-yellow-500" />}
                    <span className={`core-px-1.5 core-py-0.5 core-rounded core-text-[9px] core-font-bold core-uppercase core-border ${getAccessTypeStyle(app.accessType)}`}>{app.accessType}</span>
                    <IconArrowUpRight size={13} className="core-opacity-0 core-group-hover:core-opacity-60 core-transition-opacity core-text-textMuted-light dark:core-text-textMuted-dark" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {searchResults.nav.length > 0 && (
            <div className="core-px-3 core-pt-3 core-pb-3">
              <p className="core-px-2 core-pb-1.5 core-text-[10px] core-font-black core-uppercase core-tracking-widest core-text-textMuted-light dark:core-text-textMuted-dark">Navigate To</p>
              {searchResults.nav.map((item, index) => {
                const NavIcon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      setSearchOpen(false);
                      setSearch("");
                    }}
                    className="core-w-full core-flex core-items-center core-gap-3 core-px-3 core-py-2.5 core-rounded-xl core-text-left core-transition-all hover:core-bg-indigo-500/8 dark:hover:core-bg-indigo-500/12 core-group"
                  >
                    <div className="core-w-9 core-h-9 core-rounded-xl core-bg-indigo-500/10 core-flex core-items-center core-justify-center core-flex-shrink-0">
                      <NavIcon size={15} className="core-text-indigo-500" />
                    </div>
                    <div className="core-flex-1 core-min-w-0">
                      <p className="core-text-[12px] core-font-bold core-text-textPrimary-light dark:core-text-textPrimary-dark">{item.label}</p>
                      <p className="core-text-[11px] core-text-textMuted-light dark:core-text-textMuted-dark">{item.desc}</p>
                    </div>
                    <IconChevronRight size={14} className="core-opacity-0 core-group-hover:core-opacity-60 core-transition-opacity core-text-textMuted-light dark:core-text-textMuted-dark core-flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="core-flex core-items-center core-gap-3 core-px-4 core-py-2.5 core-border-t core-border-borderBase-light dark:core-border-borderBase-dark core-bg-black/2 dark:core-bg-white/2">
          <span className="core-text-[10px] core-text-textMuted-light dark:core-text-textMuted-dark">
            {searchResults.apps.length + searchResults.workflows.length + searchResults.nav.length} results
          </span>
          <span className="core-ml-auto core-text-[10px] core-text-textMuted-light dark:core-text-textMuted-dark">Press <kbd className="core-px-1 core-py-0.5 core-rounded core-bg-black/8 dark:core-bg-white/10 core-font-bold">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
