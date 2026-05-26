import React from "react";
import { IconLock, IconX } from "@tabler/icons-react";
import type { AdminToolDefinition, AdminToolId, CurrentUser } from "../../shared/types";
import { AppSummarySkeleton, GeneralSkeleton } from "../../shared/components/skeletons";

interface AdminToolsOverlayProps {
  activeAdminTool: AdminToolId | null;
  adminTools: readonly AdminToolDefinition[];
  currentUser: CurrentUser;
  onClose: () => void;
}

export default function AdminToolsOverlay({
  activeAdminTool,
  adminTools,
  currentUser,
  onClose,
}: AdminToolsOverlayProps) {
  if (!activeAdminTool) {
    return null;
  }

  const tool = adminTools.find((item) => item.id === activeAdminTool);

  return (
    <div className="core-fixed core-inset-0 core-z-[110] core-bg-page-light dark:core-bg-page-dark">
      {!tool || !currentUser.isAdmin ? (
        <div className="core-h-full core-flex core-items-center core-justify-center core-p-6 core-bg-page-light dark:core-bg-page-dark">
          <button
            type="button"
            onClick={onClose}
            className="core-fixed core-right-4 core-top-4 core-z-[130] core-w-10 core-h-10 core-rounded-full core-flex core-items-center core-justify-center core-bg-white/95 dark:core-bg-[#1a1730]/95 core-border core-border-borderBase-light dark:core-border-borderBase-dark core-shadow-xl hover:core-border-indigo-500/40 core-transition-colors"
            title="Close"
          >
            <IconX size={18} className="core-text-textPrimary-light dark:core-text-textPrimary-dark" />
          </button>
          <div className="core-w-full core-max-w-sm core-rounded-2xl core-p-6 core-text-center core-bg-card-light dark:core-bg-card-dark core-border core-border-borderBase-light dark:core-border-borderBase-dark core-shadow-2xl">
            <div className="core-mx-auto core-mb-4 core-w-12 core-h-12 core-rounded-2xl core-flex core-items-center core-justify-center core-bg-rose-500/10 core-text-rose-500">
              <IconLock size={22} />
            </div>
            <p className="core-text-[15px] core-font-bold core-text-textPrimary-light dark:core-text-textPrimary-dark">Access restricted</p>
            <p className="core-mt-2 core-text-[12px] core-text-textMuted-light dark:core-text-textMuted-dark">This admin tool is not available for your account.</p>
          </div>
        </div>
      ) : (
        <React.Suspense
          fallback={activeAdminTool === "app-summary" ? <AppSummarySkeleton /> : <GeneralSkeleton />}
        >
          <tool.Component onClose={onClose} />
        </React.Suspense>
      )}
    </div>
  );
}
