import {
  IconArrowUpRight,
  IconChecklist,
  IconHistory,
  IconMinimize,
  IconPointFilled,
} from "@tabler/icons-react";
import { SearchInput } from "../../shared/components/ui";
import { getWorkflowStatus } from "../../shared/utils";
import type { MaximizedSection, WorkflowItem, WorkflowStatus } from "../../shared/types";
import { useScrollLock } from "../../app/hooks/useScrollLock";


interface MaximizedWorkflowTableProps {
  dark: boolean;
  workflowStatuses: WorkflowStatus[];
  workflows: WorkflowItem[];
  setMaximizedSection: React.Dispatch<React.SetStateAction<MaximizedSection | null>>;
}

export default function MaximizedWorkflowTable({
  dark,
  workflowStatuses,
  workflows,
  setMaximizedSection,
}: MaximizedWorkflowTableProps) {
  useScrollLock();
  return (
    <div className="core-flex core-h-full core-flex-col core-bg-page-light dark:core-bg-page-dark core-animate-in core-zoom-in-95 core-duration-300">
      <header className="core-flex core-flex-wrap core-items-start core-justify-between core-gap-3 core-px-4 sm:core-px-6 core-py-1.5 sm:core-py-2 core-border-b core-border-borderBase-light dark:core-border-borderBase-dark core-bg-white/50 dark:core-bg-black/20 core-backdrop-blur-md">
        <div className="core-flex core-min-w-0 core-flex-1 core-items-center core-gap-3">
          <div className="core-w-8 core-h-8 core-rounded-lg core-bg-gradient-to-br core-from-indigo-500 core-to-purple-600 core-flex core-items-center core-justify-center core-shadow-lg core-shadow-indigo-500/20">
            <IconChecklist color="#fff" size={16} />
          </div>
          <h2 className="core-text-sm sm:core-text-base core-font-bold core-text-textPrimary-light dark:core-text-textPrimary-dark">Workflow Approvals Detailed View</h2>
        </div>
        <button
          onClick={() => setMaximizedSection(null)}
          className="core-flex core-items-center core-gap-2 core-px-3.5 sm:core-px-4 core-py-2 core-rounded-xl core-bg-rose-500/10 core-text-rose-600 dark:core-text-rose-400 core-font-bold core-text-sm core-transition-all hover:core-bg-rose-500 hover:core-text-white dark:hover:core-text-white group"
        >
          <IconMinimize size={18} className="group-hover:core-text-white" />
          <span className="group-hover:core-text-white">Minimize</span>
        </button>
      </header>

      <div className="core-flex-1 core-min-h-0 core-p-4 sm:core-p-6 lg:core-p-8 core-overflow-y-auto core-custom-scrollbar">
        <div className="core-bg-card-light dark:core-bg-card-dark core-rounded-3xl core-overflow-hidden core-shadow-2xl core-border core-border-borderBase-light dark:core-border-borderBase-dark">
          <div className="core-p-4 sm:core-p-6 core-border-b core-border-borderBase-light dark:core-border-borderBase-dark core-flex core-flex-col xl:core-flex-row xl:core-items-center xl:core-justify-between core-gap-4">
            <div className="core-flex core-min-w-0 core-items-center core-gap-4">
              <div className="core-w-12 core-h-12 core-rounded-2xl core-bg-indigo-500/10 core-flex core-items-center core-justify-center core-text-indigo-600">
                <IconChecklist size={24} />
              </div>
              <div className="core-min-w-0">
                <p className="core-text-lg core-font-bold">Pending Approvals</p>
                <p className="core-text-sm core-text-textMuted-light dark:core-text-textMuted-dark core-break-words">Showing {workflows.length} active workflows</p>
              </div>
            </div>
            <div className="core-flex core-w-full xl:core-w-auto core-flex-col sm:core-flex-row core-items-stretch sm:core-items-center core-gap-3">
              <SearchInput value="" onChange={() => {}} placeholder="Filter workflows..." compact className="core-w-full sm:core-w-64" />
              <button className="core-px-4 core-py-2 core-rounded-xl core-bg-emerald-500 core-text-white core-font-bold core-text-sm">Export CSV</button>
            </div>
          </div>
          <div className="core-overflow-x-auto">
            <table className="core-w-full core-text-left core-border-collapse">
              <thead className="core-bg-slate-50 dark:core-bg-white/5">
                <tr>
                  {["ID", "Application", "Workflow Type", "System Status", "Pending", "Due Date", "Risk", "Actions"].map((header) => (
                    <th key={header} className="core-px-6 core-py-4 core-text-[11px] core-font-black core-uppercase core-tracking-widest core-text-textMuted-light dark:core-text-textMuted-dark core-border-b core-border-borderBase-light dark:core-border-borderBase-dark">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="core-divide-y core-divide-borderBase-light dark:core-divide-borderBase-dark">
                {workflows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="core-px-6 core-py-12 core-text-center core-text-sm core-font-semibold core-text-textMuted-light dark:core-text-textMuted-dark">
                      No task found
                    </td>
                  </tr>
                ) : workflows.map((row) => {
                  const fallback = getWorkflowStatus(row.pending, dark);
                  const { dotColor, badgeBg, badgeText, badgeBorder } = workflowStatuses.find((status) => status.id === row.id) ?? fallback;
                  return (
                    <tr key={row.id} className="hover:core-bg-indigo-500/[0.03] core-transition-colors">
                      <td className="core-px-6 core-py-5 core-text-sm core-font-mono core-text-textMuted-light">#WF-00{row.id}</td>
                      <td className="core-px-6 core-py-5">
                        <div className="core-flex core-items-center core-gap-3">
                          <div className="core-w-8 core-h-8 core-rounded-lg core-flex core-items-center core-justify-center core-border" style={{ background: `${dotColor}10`, borderColor: `${dotColor}20` }}>
                            <IconPointFilled size={12} style={{ color: dotColor }} />
                          </div>
                          <span className="core-text-sm core-font-bold">{row.app}</span>
                        </div>
                      </td>
                      <td className="core-px-6 core-py-5 core-text-sm core-font-semibold">{row.workflow}</td>
                      <td className="core-px-6 core-py-5">
                        <span className="core-px-3 core-py-1 core-rounded-full core-bg-emerald-500/10 core-text-emerald-600 core-text-[10px] core-font-black core-uppercase">Active</span>
                      </td>
                      <td className="core-px-6 core-py-5">
                        <div className="core-inline-flex core-items-center core-gap-2 core-px-3 core-py-1.5 core-rounded-full core-text-xs core-font-bold core-border" style={{ background: badgeBg, color: badgeText, borderColor: badgeBorder }}>
                          {row.pending} Items
                        </div>
                      </td>
                      <td className="core-px-6 core-py-5 core-text-sm core-text-textMuted-light">24 Apr 2026</td>
                      <td className="core-px-6 core-py-5">
                        {row.pending > 15 ? <span className="core-text-rose-500 core-font-bold core-text-xs">High Risk</span> : <span className="core-text-emerald-500 core-font-bold core-text-xs">Low Risk</span>}
                      </td>
                      <td className="core-px-6 core-py-5">
                        <div className="core-flex core-items-center core-gap-2">
                          <button className="core-p-2 core-rounded-lg core-bg-indigo-600 core-text-white hover:core-bg-indigo-700 core-transition-all"><IconArrowUpRight size={16} /></button>
                          <button className="core-p-2 core-rounded-lg core-bg-black/5 dark:core-bg-white/5 hover:core-bg-black/10 dark:hover:core-bg-white/10 core-transition-all"><IconHistory size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
