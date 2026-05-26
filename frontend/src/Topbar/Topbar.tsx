import {
  IconBriefcase,
  IconChevronDown,
  IconHome,
  IconLogout,
  IconMoon,
  IconSearch,
  IconShieldCheck,
  IconSun,
  IconX,
} from "@tabler/icons-react";
import { lazy, Suspense } from "react";
const GlobalSearchModal = lazy(() => import("./GlobalSearchModal"));
const ProfileDetails = lazy(() => import("./Workspace/ProfileDetails"));
const ProjectSearch = lazy(() => import("./Workspace/ProjectSearch"));
const EmployeeSearch = lazy(() => import("./Workspace/EmployeeSearch"));
const Help = lazy(() => import("./Workspace/Help"));
const Feedback = lazy(() => import("./Workspace/Feedback"));
import {
  WorkspaceFeedbackSkeleton,
  WorkspaceGridSkeleton,
  WorkspaceHelpSkeleton,
  WorkspaceListSkeleton,
  WorkspaceProfileSkeleton,
} from "../shared/components/skeletons";
import { WORKSPACE_MENU_ITEMS, WORKSPACE_SECTIONS } from "./constants";
import type { ActiveSection, AdminToolDefinition, AdminToolId, AppItem, AppsView, CurrentUser, MaximizedSection, SearchResults, WorkflowStatus } from "../shared/types";

interface TopbarProps {
  dark: boolean;
  setDark: (dark: boolean) => void | Promise<boolean>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  mobileSearch: boolean;
  setMobileSearch: React.Dispatch<React.SetStateAction<boolean>>;
  searchOpen: boolean;
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchResults: SearchResults | null;
  workflowStatuses: WorkflowStatus[];
  activeSection: ActiveSection;
  setActiveSection: React.Dispatch<React.SetStateAction<ActiveSection>>;
  setAppsView: React.Dispatch<React.SetStateAction<AppsView>>;
  setAppSearch: React.Dispatch<React.SetStateAction<string>>;
  userDropdownOpen: boolean;
  setUserDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  workspaceExpanded: boolean;
  setWorkspaceExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  adminExpanded: boolean;
  setAdminExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  userPillRef: React.RefObject<HTMLDivElement | null>;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  searchContainerRef: React.RefObject<HTMLDivElement | null>;
  paletteRef: React.RefObject<HTMLDivElement | null>;
  navigateTo: (section: ActiveSection) => void;
  setMaximizedSection: React.Dispatch<React.SetStateAction<MaximizedSection | null>>;
  currentUser: CurrentUser;
  visibleAdminTools: readonly AdminToolDefinition[];
  onOpenAdminTool: (toolId: AdminToolId) => void;
  onSelectApp: (app: AppItem) => void;
}

export default function Topbar({
  dark,
  setDark,
  search,
  setSearch,
  mobileSearch,
  setMobileSearch,
  searchOpen,
  setSearchOpen,
  searchResults,
  workflowStatuses,
  activeSection,
  setActiveSection,
  setAppsView,
  setAppSearch,
  userDropdownOpen,
  setUserDropdownOpen,
  workspaceExpanded,
  setWorkspaceExpanded,
  adminExpanded,
  setAdminExpanded,
  userPillRef,
  searchInputRef,
  searchContainerRef,
  paletteRef,
  navigateTo,
  setMaximizedSection,
  currentUser,
  visibleAdminTools,
  onOpenAdminTool,
  onSelectApp,
}: TopbarProps) {
  return (
    <>
      <header className="core-sticky core-top-0 core-z-50 core-flex core-items-center core-gap-2 sm:core-gap-4 core-px-3 sm:core-px-6 lg:core-px-8 core-py-1 sm:core-py-1.5 core-backdrop-blur-xl core-border-b core-border-borderBase-light dark:core-border-borderBase-dark core-bg-gradient-to-r core-from-indigo-50/95 core-via-purple-50/90 core-to-rose-50/95 dark:core-from-[#1e1b4b]/95 dark:core-via-[#2d1b4e]/95 dark:core-to-[#31112c]/95">
        <div className="core-flex-1 core-flex core-justify-start">
          <button
            className="core-flex core-items-center core-gap-2 core-flex-shrink-0 core-cursor-pointer hover:core-opacity-80 core-transition-opacity"
            onClick={() => setActiveSection("dashboard")}
          >
            <div className="core-w-8 core-h-8 core-rounded-xl core-bg-gradient-to-br core-from-indigo-500 core-to-purple-600 core-flex core-items-center core-justify-center core-shadow-lg core-shadow-indigo-500/30">
              <IconHome size={15} color="#fff" stroke={2.2} />
            </div>
            <span className="core-font-black core-text-[14px] sm:core-text-[15px] core-tracking-tight core-text-textPrimary-light dark:core-text-textPrimary-dark">
              pFirst <span className="core-text-indigo-500">2.0</span>
            </span>
          </button> 
        </div>

        <div
          ref={searchContainerRef}
          className={`core-hidden sm:core-flex core-relative core-items-center core-flex-1 core-transition-all core-duration-500 core-ease-in-out ${searchOpen ? "core-max-w-sm lg:core-max-w-md" : "core-max-w-[240px]"}`}
        >
          <div className={`core-absolute core-inset-0 core-rounded-full core-bg-gradient-to-r core-from-indigo-500/40 core-via-purple-500/40 core-to-pink-500/40 core-blur-md core-transition-opacity core-duration-500 core--z-10 ${searchOpen ? "core-opacity-100" : "core-opacity-0"}`} />
          <div className={`core-flex core-items-center core-gap-2.5 core-w-full core-px-3.5 core-py-[2px] core-rounded-full core-border core-bg-white/40 dark:core-bg-black/20 core-backdrop-blur-md core-transition-all core-duration-300 dark:core-border-white/10 ${searchOpen ? "core-border-indigo-500/40 core-bg-white/80 dark:core-bg-black/40 core-shadow-[0_0_20px_rgba(99,102,241,0.15)]" : "core-border-indigo-500/10"}`}>
            <div className="core-relative">
              <IconSearch size={14} className={`core-transition-all ${searchOpen ? "core-text-indigo-500 core-scale-110" : "core-text-textMuted-light dark:core-text-textMuted-dark"}`} />
              <div className={`core-absolute core-inset-0 core-bg-indigo-500 core-blur-md core-transition-opacity core-animate-pulse ${searchOpen ? "core-opacity-40" : "core-opacity-0"}`} />
            </div>
            <input
              ref={searchInputRef}
              id="pm-search"
              className="core-bg-transparent core-text-[12px] core-outline-none core-flex-1 core-min-w-0 core-text-textPrimary-light dark:core-text-textPrimary-dark core-placeholder-textMuted-light/40 dark:core-placeholder-textMuted-dark/40"
              placeholder="Search apps, workflows, charts…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
            />
            <div className="core-flex core-items-center core-gap-1.5">
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="core-p-1 core-rounded-full hover:core-bg-black/5 dark:hover:core-bg-white/10 core-text-textMuted-light dark:core-text-textMuted-dark core-transition-colors"
                >
                  <IconX size={12} stroke={3} />
                </button>
              )}
              <div className="core-hidden lg:core-flex core-items-center core-gap-1 core-px-1.5 core-py-0.5 core-rounded-md core-bg-white dark:core-bg-white/10 core-border core-border-borderBase-light dark:core-border-borderBase-dark core-shadow-[0_1px_1px_rgba(0,0,0,0.1)] dark:core-shadow-none">
                <span className="core-text-[9px] core-font-bold core-text-textMuted-light dark:core-text-textMuted-dark core-opacity-70">/</span>
              </div>
            </div>
          </div>
        </div>

        <div className="core-flex-1 core-flex core-items-center core-justify-end core-gap-2 sm:core-gap-3">
          <button
            onClick={() => setMobileSearch((value) => !value)}
            className="sm:core-hidden core-w-9 core-h-9 core-rounded-full core-flex core-items-center core-justify-center core-border core-transition-all core-border-borderBase-light dark:core-border-borderBase-dark"
          >
            <IconSearch size={16} className="core-text-textMuted-light dark:core-text-textMuted-dark" />
          </button>

          <button
            onClick={() => setDark(!dark)}
            className="core-relative core-w-14 core-h-7 core-rounded-full core-bg-black/5 dark:core-bg-white/10 core-transition-colors core-duration-150 core-flex core-items-center core-px-1 core-shadow-inner core-border core-border-borderBase-light dark:core-border-borderBase-dark core-group hover:core-border-indigo-500/30"
            title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <div className={`core-w-6 core-h-6 core-rounded-full core-bg-white dark:core-bg-[#1a1730] core-shadow-md core-flex core-items-center core-justify-center core-transition-transform core-duration-150 core-ease-out core-will-change-transform ${dark ? "core-translate-x-6" : "core-translate-x-0"}`}>
              <div className="core-relative core-w-full core-h-full core-flex core-items-center core-justify-center">
                <IconSun size={14} className={`core-absolute core-text-yellow-500 core-transition-opacity core-duration-100 ${dark ? "core-opacity-100" : "core-opacity-0"}`} />
                <IconMoon size={14} className={`core-absolute core-text-indigo-500 core-transition-opacity core-duration-100 ${dark ? "core-opacity-0" : "core-opacity-100"}`} />
              </div>
            </div>
          </button>

          <div className="core-relative" ref={userPillRef}>
            <div
              onClick={() => setUserDropdownOpen((value) => !value)}
              className={`core-flex core-items-center core-gap-2 core-rounded-full core-border core-px-2 sm:core-px-2.5 core-py-1 core-cursor-pointer core-transition-all hover:core-border-indigo-500/30 core-bg-indigo-500/4 dark:core-bg-white/4 ${userDropdownOpen ? "core-border-indigo-500/40 core-shadow-[0_0_15px_rgba(99,102,241,0.15)]" : "core-border-borderBase-light dark:core-border-borderBase-dark"}`}
            >
              <div className="core-w-7 core-h-7 core-rounded-full core-bg-gradient-to-br core-from-indigo-400 core-to-purple-500 core-flex core-items-center core-justify-center core-text-white core-text-[11px] core-font-bold core-shadow-md core-flex-shrink-0">{currentUser.initials}</div>
              <span className="core-text-[12px] core-font-semibold core-hidden md:core-block core-text-textPrimary-light dark:core-text-textPrimary-dark">{currentUser.name}</span>
              <IconChevronDown size={13} className={`core-hidden sm:core-block core-transition-transform core-duration-200 ${userDropdownOpen ? "core-rotate-180" : ""} core-text-textMuted-light dark:core-text-textMuted-dark`} />
            </div>

            {userDropdownOpen && (
              <div className="core-absolute core-right-0 core-mt-2 core-w-56 core-rounded-2xl core-overflow-hidden core-shadow-2xl core-z-[60] core-animate-in core-fade-in core-slide-in-from-top-2 core-duration-200 core-border core-border-borderBase-light dark:core-border-borderBase-dark core-bg-white dark:core-bg-[#1a1730]">
                <div className="core-p-1.5 core-space-y-0.5">
                  <button
                    className={`core-w-full core-flex core-items-center core-justify-between core-px-3 core-py-1.5 core-rounded-xl core-transition-all core-duration-200 ${WORKSPACE_SECTIONS.includes(activeSection) ? "core-bg-indigo-500/10" : "hover:core-bg-indigo-500/10"} core-text-left core-group`}
                    onClick={(event) => {
                      event.stopPropagation();
                      const isExpanding = !workspaceExpanded;
                      setWorkspaceExpanded(isExpanding);
                      if (isExpanding) setAdminExpanded(false);
                    }}
                  >
                    <div className="core-flex core-items-center core-gap-3">
                      <div className="core-w-8 core-h-8 core-rounded-lg core-bg-indigo-500/10 core-flex core-items-center core-justify-center core-text-indigo-500 core-group-hover:core-bg-indigo-500 core-group-hover:core-text-white core-transition-colors core-duration-200">
                        <IconBriefcase size={16} />
                      </div>
                      <div>
                        <p className="core-text-[12px] core-font-semibold core-text-textPrimary-light dark:core-text-textPrimary-dark">Workspace</p>
                        <p className="core-text-[10px] core-text-textMuted-light dark:core-text-textMuted-dark">Manage your profile</p>
                      </div>
                    </div>
                    <IconChevronDown size={14} className={`core-text-textMuted-light dark:core-text-textMuted-dark core-transition-transform ${workspaceExpanded ? "core-rotate-180" : ""}`} />
                  </button>

                  {workspaceExpanded && (
                    <div className="core-pl-4 core-pr-1 core-py-1 core-space-y-0.5 core-border-l-2 core-border-indigo-500/20 core-ml-5 core-my-1 core-animate-in core-fade-in core-slide-in-from-top-1 core-duration-200">
                      {WORKSPACE_MENU_ITEMS.map(({ section, icon: Icon, label }) => {
                        const isActive = activeSection === section;
                        return (
                          <button
                            key={section}
                            className={`core-w-full core-flex core-items-center core-gap-2.5 core-px-2.5 core-py-1.5 core-rounded-lg core-transition-all core-duration-200 ${isActive ? "core-bg-indigo-500/15 core-text-indigo-600 dark:core-text-indigo-400" : "hover:core-bg-indigo-500/10 core-text-textPrimary-light dark:core-text-textPrimary-dark"} core-text-left core-group`}
                            onClick={() => navigateTo(section)}
                          >
                            <Icon size={14} className={`${isActive ? "core-text-indigo-600 dark:core-text-indigo-400" : "core-text-textMuted-light dark:core-text-textMuted-dark core-group-hover:core-text-indigo-500"}`} />
                            <span className={`core-text-[12px] core-font-medium ${isActive ? "core-font-bold" : ""}`}>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="core-h-px core-my-1.5 core-mx-2 core-bg-borderBase-light dark:core-bg-borderBase-dark" />

                  {visibleAdminTools.length > 0 && (
                    <>
                      <button
                        className="core-w-full core-flex core-items-center core-justify-between core-px-3 core-py-1.5 core-rounded-xl core-transition-all core-duration-200 hover:core-bg-cyan-500/10 core-text-left core-group"
                        onClick={(event) => {
                          event.stopPropagation();
                          const isExpanding = !adminExpanded;
                          setAdminExpanded(isExpanding);
                          if (isExpanding) setWorkspaceExpanded(false);
                        }}
                      >
                        <div className="core-flex core-items-center core-gap-3">
                          <div className="core-w-8 core-h-8 core-rounded-lg core-bg-cyan-500/10 core-flex core-items-center core-justify-center core-text-cyan-600 dark:core-text-cyan-400 core-group-hover:core-bg-cyan-500 core-group-hover:core-text-white core-transition-colors core-duration-200">
                            <IconShieldCheck size={16} />
                          </div>
                          <div>
                            <p className="core-text-[12px] core-font-semibold core-text-textPrimary-light dark:core-text-textPrimary-dark">pFirst 2.0 Insights</p>
                            <p className="core-text-[10px] core-text-textMuted-light dark:core-text-textMuted-dark">App metrics overview</p>
                          </div>
                        </div>
                        <IconChevronDown size={14} className={`core-text-textMuted-light dark:core-text-textMuted-dark core-transition-transform ${adminExpanded ? "core-rotate-180" : ""}`} />
                      </button>

                      {adminExpanded && (
                        <div className="core-pl-4 core-pr-1 core-py-1 core-space-y-0.5 core-border-l-2 core-border-indigo-500/20 core-ml-5 core-my-1 core-animate-in core-fade-in core-slide-in-from-top-1 core-duration-200">
                          {visibleAdminTools.map((tool) => {
                            const ToolIcon = tool.icon;
                            return (
                              <button
                                key={tool.id}
                                className="core-w-full core-flex core-items-center core-gap-2.5 core-px-2.5 core-py-1.5 core-rounded-lg core-transition-all core-duration-200 hover:core-bg-indigo-500/10 core-text-left core-group"
                                onClick={() => {
                                  onOpenAdminTool(tool.id);
                                  setUserDropdownOpen(false);
                                }}
                              >
                                <ToolIcon size={14} className="core-text-textMuted-light dark:core-text-textMuted-dark core-group-hover:core-text-indigo-500" />
                                <span className="core-text-[12px] core-font-medium core-text-textPrimary-light dark:core-text-textPrimary-dark">{tool.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <div className="core-h-px core-my-1.5 core-mx-2 core-bg-borderBase-light dark:core-bg-borderBase-dark" />
                    </>
                  )}

                  {visibleAdminTools.length === 0 && currentUser.isAdmin && (
                    <>
                      <button
                        className="core-w-full core-flex core-items-center core-gap-3 core-px-3 core-py-1.5 core-rounded-xl core-text-left core-opacity-70"
                        disabled
                      >
                        <div className="core-w-8 core-h-8 core-rounded-lg core-bg-slate-500/10 core-flex core-items-center core-justify-center core-text-slate-500">
                          <IconShieldCheck size={16} />
                        </div>
                        <div>
                          <p className="core-text-[12px] core-font-semibold core-text-textPrimary-light dark:core-text-textPrimary-dark">Admin Tools</p>
                          <p className="core-text-[10px] core-text-textMuted-light dark:core-text-textMuted-dark">No tools available</p>
                        </div>
                      </button>

                      <div className="core-h-px core-my-1.5 core-mx-2 core-bg-borderBase-light dark:core-bg-borderBase-dark" />
                    </>
                  )}

                  <button
                    className="core-w-full core-flex core-items-center core-gap-3 core-px-3 core-py-1.5 core-rounded-xl core-transition-all core-duration-200 hover:core-bg-rose-500/10 core-text-left core-group"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="core-w-8 core-h-8 core-rounded-lg core-bg-rose-500/10 core-flex core-items-center core-justify-center core-text-rose-500 core-group-hover:core-bg-rose-500 core-group-hover:core-text-white core-transition-colors core-duration-200">
                      <IconLogout size={16} />
                    </div>
                    <div>
                      <p className="core-text-[12px] core-font-semibold core-text-textPrimary-light dark:core-text-textPrimary-dark">Sign out</p>
                      <p className="core-text-[10px] core-text-textMuted-light dark:core-text-textMuted-dark">Log out of account</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {mobileSearch && (
        <div className="sm:core-hidden core-sticky core-top-[53px] core-z-20 core-px-3 core-py-3 core-backdrop-blur-2xl core-border-b core-border-borderBase-light dark:core-border-borderBase-dark core-bg-page-light/90 dark:core-bg-page-dark/90 core-animate-in core-slide-in-from-top core-duration-300">
          <div className="core-relative core-flex core-items-center core-gap-2.5 core-rounded-2xl core-border core-px-4 core-py-2.5 core-bg-white/60 dark:core-bg-black/40 core-border-indigo-500/20 dark:core-border-white/10 core-shadow-lg">
            <IconSearch size={16} className="core-text-indigo-500" />
            <input
              autoFocus
              id="pm-search"
              className="core-bg-transparent core-text-[14px] core-outline-none core-flex-1 core-min-w-0 core-text-textPrimary-light dark:core-text-textPrimary-dark"
              placeholder="Search apps, dashboards..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
            />
            {search && (
              <button onClick={() => {
                setSearch("");
                setSearchOpen(false);
              }} className="core-text-textMuted-light">
                <IconX size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {searchOpen && search.trim() && searchResults && (
        <Suspense fallback={null}>
          <GlobalSearchModal
            dark={dark}
            search={search}
            setSearch={setSearch}
            setSearchOpen={setSearchOpen}
            searchResults={searchResults}
            workflowStatuses={workflowStatuses}
            setActiveSection={setActiveSection}
            setAppsView={setAppsView}
            setAppSearch={setAppSearch}
            paletteRef={paletteRef}
            setMaximizedSection={setMaximizedSection}
            onSelectApp={onSelectApp}
          />
        </Suspense>
      )}
    </>
  );
}

interface WorkspaceViewsProps {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
}

export function WorkspaceViews({ activeSection, setActiveSection }: WorkspaceViewsProps) {
  let content: React.ReactNode;
  let fallback: React.ReactNode;
  switch (activeSection) {
    case "profile":
      content = <ProfileDetails />;
      fallback = <WorkspaceProfileSkeleton />;
      break;
    case "project_search":
      content = <ProjectSearch />;
      fallback = <WorkspaceGridSkeleton />;
      break;
    case "employee_search":
      content = <EmployeeSearch />;
      fallback = <WorkspaceListSkeleton />;
      break;
    case "help":
      content = <Help />;
      fallback = <WorkspaceHelpSkeleton />;
      break;
    case "feedback":
      content = (
        <Feedback
          onSubmit={() => {
            alert("Feedback submitted!");
            setActiveSection("dashboard");
          }}
        />
      );
      fallback = <WorkspaceFeedbackSkeleton />;
      break;
    default:
      return null;
  }

  return (
    <Suspense fallback={fallback}>
      {content}
    </Suspense>
  );
}
