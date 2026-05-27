import { IconActivity, IconMinimize } from "@tabler/icons-react";
import { Label, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PIE_COLORS } from "../../shared/data";
import { CustomTooltip, PieLabelLarge } from "../../shared/components/charts";
import { pieSliceShape } from "../../shared/chartUtils";
import type { MaximizedSection, PieEntry } from "../../shared/types";
import { useScrollLock } from "../../app/hooks/useScrollLock";

interface MaximizedRequestStatusChartProps {
  pieData: PieEntry[];
  setMaximizedSection: React.Dispatch<React.SetStateAction<MaximizedSection | null>>;
}

export default function MaximizedRequestStatusChart({
  pieData,
  setMaximizedSection,
}: MaximizedRequestStatusChartProps) {
  useScrollLock();
  return (
    <div className="core-flex core-h-full core-flex-col core-bg-page-light dark:core-bg-page-dark core-animate-in core-zoom-in-95 core-duration-300">
      <header className="core-flex core-flex-wrap core-items-start core-justify-between core-gap-3 core-px-4 sm:core-px-6 core-py-1.5 sm:core-py-2 core-border-b core-border-borderBase-light dark:core-border-borderBase-dark core-bg-white/50 dark:core-bg-black/20 core-backdrop-blur-md">
        <div className="core-flex core-min-w-0 core-flex-1 core-items-center core-gap-3">
          <div className="core-w-8 core-h-8 core-rounded-lg core-bg-gradient-to-br core-from-indigo-500 core-to-purple-600 core-flex core-items-center core-justify-center core-shadow-lg core-shadow-indigo-500/20">
            <IconActivity color="#fff" size={16} />
          </div>
          <h2 className="core-text-sm sm:core-text-base core-font-bold core-text-textPrimary-light dark:core-text-textPrimary-dark">Request Status Analysis</h2>
        </div>
        <button
          onClick={() => setMaximizedSection(null)}
          className="core-flex core-items-center core-gap-2 core-px-3.5 sm:core-px-4 core-py-2 core-rounded-xl core-bg-rose-500/10 core-text-rose-600 dark:core-text-rose-400 core-font-bold core-text-sm core-transition-all hover:core-bg-rose-500 hover:core-text-white dark:hover:core-text-white group"
        >
          <IconMinimize size={18} className="group-hover:core-text-white" />
          <span className="group-hover:core-text-white">Minimize</span>
        </button>
      </header>

      <div className="core-flex-1 core-min-h-0 core-p-4 sm:core-p-6 lg:core-p-8 core-overflow-y-auto custom-scrollbar">
        <div className="core-flex core-h-full core-min-h-0 core-flex-col core-gap-4">
          <div className="core-grid core-grid-cols-1 sm:core-grid-cols-2 lg:core-grid-cols-3 core-gap-3 core-flex-shrink-0">
            {pieData.map((entry, index) => (
              <div key={index} className="core-bg-slate-50 dark:core-bg-white/5 core-p-3 core-rounded-xl core-border core-border-borderBase-light dark:core-border-borderBase-dark core-flex core-items-center core-justify-between core-gap-3">
                <div className="core-flex core-min-w-0 core-items-center core-gap-3">
                  <div className="core-w-3 core-h-3 core-rounded-full core-flex-shrink-0" style={{ background: PIE_COLORS[index] }} />
                  <div className="core-min-w-0">
                    <p className="core-text-sm sm:core-text-base core-font-bold">{entry.name}</p>
                    <p className="core-text-xs core-text-textMuted-light dark:core-text-textMuted-dark">Standard Ticket Severity</p>
                  </div>
                </div>
                <div className="core-text-right core-flex-shrink-0">
                  <p className="core-text-lg sm:core-text-xl core-font-black">{entry.value}%</p>
                  <div className="core-w-20 sm:core-w-24 core-h-1.5 core-bg-black/10 dark:core-bg-white/10 core-rounded-full core-mt-1 core-overflow-hidden">
                    <div className="core-h-full" style={{ width: `${entry.value}%`, background: PIE_COLORS[index] }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {pieData.length === 0 ? (
            <div className="core-flex-1 core-min-h-[240px] sm:core-min-h-[300px] core-flex core-flex-col core-items-center core-justify-center core-gap-3 core-rounded-2xl core-border-2 core-border-dashed core-border-borderBase-light dark:core-border-borderBase-dark core-text-textMuted-light dark:core-text-textMuted-dark">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="core-opacity-30"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 6.364 15.364M12 3v9l4 4"/></svg>
              <div className="core-text-center">
                <p className="core-text-sm core-font-bold core-opacity-40">No data available</p>
                <p className="core-text-xs core-opacity-30 core-mt-1">Request status breakdown will appear here</p>
              </div>
            </div>
          ) : (
          <div className="core-flex-1 core-min-h-[240px] sm:core-min-h-[300px] core-bg-card-light dark:core-bg-card-dark core-p-4 sm:core-p-5 lg:core-p-6 core-rounded-3xl core-border core-border-borderBase-light dark:core-border-borderBase-dark core-shadow-2xl core-flex core-flex-col">
            <div className="core-flex-1 core-min-h-0 core-w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius="38%"
                    outerRadius="64%"
                    paddingAngle={6}
                    dataKey="value"
                    strokeWidth={0}
                    shape={pieSliceShape}
                  >
                    <Label content={PieLabelLarge} />
                  </Pie>
                  <Tooltip content={CustomTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
