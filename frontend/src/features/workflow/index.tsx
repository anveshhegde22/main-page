import { memo, useCallback } from "react";
import { IconArrowUpRight, IconChecklist, IconMaximize, IconPointFilled } from "@tabler/icons-react";
import { MAXIMIZED_SECTIONS } from "../../app/constants";
import type { MaximizedSection, WorkflowItem, WorkflowStatus } from "../../shared/types";

interface WorkflowTableProps {
  workflowStatuses: WorkflowStatus[];
  workflows: WorkflowItem[];
  setMaximizedSection: React.Dispatch<React.SetStateAction<MaximizedSection | null>>;
}

function WorkflowTable({
  workflowStatuses,
  workflows,
  setMaximizedSection,
}: WorkflowTableProps) {
  const maximizeWorkflow = useCallback(() => {
    setMaximizedSection(MAXIMIZED_SECTIONS.workflow);
  }, [setMaximizedSection]);

  return (
    <div id="workflow-approvals-table" className="core-rounded-2xl core-overflow-hidden core-shadow-lg core-scroll-mt-6 core-bg-card-light dark:core-bg-card-dark core-border core-border-borderBase-light dark:core-border-borderBase-dark">
      <div className="core-flex core-items-center core-justify-between core-px-4 sm:core-px-6 core-py-4 core-border-b core-border-borderBase-light dark:core-border-borderBase-dark core-bg-black/1 dark:core-bg-white/2 core-gap-3">
        <div className="core-flex core-items-center core-gap-3 core-min-w-0">
          <div className="core-w-9 core-h-9 core-rounded-xl core-bg-gradient-to-br core-from-indigo-500 core-to-purple-600 core-flex core-items-center core-justify-center core-shadow-lg core-shadow-indigo-500/20 core-flex-shrink-0">
            <IconChecklist size={16} color="#fff" />
          </div>
          <div className="core-min-w-0">
            <p className="core-text-sm core-font-bold core-leading-tight core-text-textPrimary-light dark:core-text-textPrimary-dark core-truncate">Workflow Approvals</p>
            <p className="core-text-[11px] core-text-textMuted-light dark:core-text-textMuted-dark core-truncate">Overview of pending actions across platforms</p>
          </div>
        </div>
        <button
          onClick={maximizeWorkflow}
          className="core-p-2 core-rounded-xl core-transition-all hover:core-bg-black/5 dark:hover:core-bg-white/10 core-text-textMuted-light dark:core-text-textMuted-dark core-flex-shrink-0"
          title="Maximize"
        >
          <IconMaximize size={18} />
        </button>
      </div>
      <div className="core-overflow-x-auto core-pb-1.5">
        <table className="core-w-full core-text-left core-border-collapse core-whitespace-nowrap">
          <thead className="core-bg-slate-100/80 dark:core-bg-slate-800/40">
            <tr className="core-border-b core-border-borderBase-light dark:core-border-borderBase-dark">
              {["#", "App Name", "Workflow Name", "Pending Approvals", "Action"].map((header, index) => (
                <th key={header} className={`core-px-5 core-py-2.5 core-text-[10px] core-font-bold core-uppercase core-tracking-[0.18em] core-border-r core-border-borderBase-light dark:core-border-borderBase-dark core-text-textMuted-light dark:core-text-textMuted-dark ${index === 3 ? "core-text-center" : ""} ${index === 4 ? "core-text-center core-w-[68px] core-border-r-0" : ""}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="core-divide-y core-divide-borderBase-light dark:core-divide-borderBase-dark">
            {workflows.length === 0 ? (
              <tr>
                <td colSpan={5} className="core-px-5 core-py-10 core-text-center core-text-[12px] core-font-semibold core-text-textMuted-light dark:core-text-textMuted-dark">
                  No task found
                </td>
              </tr>
            ) : workflows.map((row, index) => {
              const { dotColor, badgeBg, badgeText, badgeBorder } = workflowStatuses[index];
              return (
                <tr key={row.id} className="core-group core-transition-all core-duration-300 core-cursor-pointer odd:core-bg-transparent even:core-bg-black/[0.02] dark:even:core-bg-white/[0.02] hover:core-bg-indigo-500/5 dark:hover:core-bg-indigo-500/10">
                  <td className="core-px-5 core-py-2 core-text-[12px] core-font-semibold core-border-r core-border-borderBase-light dark:core-border-borderBase-dark core-text-textMuted-light dark:core-text-textMuted-dark">
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  <td className="core-px-5 core-py-2 core-border-r core-border-borderBase-light dark:core-border-borderBase-dark">
                    <div className="core-flex core-items-center core-gap-2">
                      <div
                        className="core-w-6.5 core-h-6.5 core-rounded-lg core-flex core-items-center core-justify-center core-flex-shrink-0 core-transition-transform core-duration-300 group-hover:core-scale-110 core-border"
                        style={{ background: `${dotColor}15`, borderColor: `${dotColor}30` }}
                      >
                        <IconPointFilled size={11} style={{ color: dotColor }} />
                      </div>
                      <span className="core-text-[12px] core-font-bold core-text-textPrimary-light dark:core-text-textPrimary-dark">{row.app}</span>
                    </div>
                  </td>
                  <td className="core-px-5 core-py-2 core-border-r core-border-borderBase-light dark:core-border-borderBase-dark">
                    <span className="core-text-[12px] core-font-semibold core-text-textPrimary-light dark:core-text-textPrimary-dark">{row.workflow}</span>
                  </td>
                  <td className="core-px-5 core-py-2 core-text-center core-border-r core-border-borderBase-light dark:core-border-borderBase-dark">
                    <div
                      className="core-inline-flex core-items-center core-justify-center core-gap-1 core-px-2.5 core-py-[5px] core-rounded-full core-text-[11px] core-font-bold core-transition-all core-duration-300 group-hover:core-scale-105 core-border"
                      style={{ minWidth: "92px", background: badgeBg, color: badgeText, borderColor: badgeBorder }}
                    >
                      <span>{row.pending}</span>
                      <span className="core-opacity-70 core-text-[9px] core-font-medium core-uppercase core-tracking-wide">pending</span>
                    </div>
                  </td>
                  <td className="core-px-5 core-py-2 core-text-center">
                    <button className="core-w-8 core-h-8 core-inline-flex core-items-center core-justify-center core-rounded-xl core-transition-all core-duration-300 hover:core-scale-105 hover:core-shadow-lg core-bg-indigo-500/10 dark:core-bg-indigo-500/15 core-text-indigo-600 dark:core-text-indigo-400 core-border core-border-indigo-500/20 dark:core-border-indigo-500/30">
                      <IconArrowUpRight size={14} stroke={2.4} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(WorkflowTable);
