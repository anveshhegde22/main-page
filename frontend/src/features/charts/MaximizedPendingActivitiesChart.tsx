import { IconActivity, IconMinimize } from "@tabler/icons-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CustomTooltip } from "../../shared/components/charts";
import type { MaximizedSection, WorkflowItem } from "../../shared/types";
import { useScrollLock } from "../../app/hooks/useScrollLock";


interface MaximizedPendingActivitiesChartProps {
  dark: boolean;
  workflows: WorkflowItem[];
  setMaximizedSection: React.Dispatch<React.SetStateAction<MaximizedSection | null>>;
}

export default function MaximizedPendingActivitiesChart({
  dark,
  workflows,
  setMaximizedSection,
}: MaximizedPendingActivitiesChartProps) {
  useScrollLock();
  return (
    <div className="core-flex core-h-full core-flex-col core-bg-page-light dark:core-bg-page-dark core-animate-in core-zoom-in-95 core-duration-300">
      <header className="core-flex core-flex-wrap core-items-start core-justify-between core-gap-3 core-px-4 sm:core-px-6 core-py-1.5 sm:core-py-2 core-border-b core-border-borderBase-light dark:core-border-borderBase-dark core-bg-white/50 dark:core-bg-black/20 core-backdrop-blur-md">
        <div className="core-flex core-min-w-0 core-flex-1 core-items-center core-gap-3">
          <div className="core-w-8 core-h-8 core-rounded-lg core-bg-gradient-to-br core-from-indigo-500 core-to-purple-600 core-flex core-items-center core-justify-center core-shadow-lg core-shadow-indigo-500/20">
            <IconActivity color="#fff" size={16} />
          </div>
          <h2 className="core-text-sm sm:core-text-base core-font-bold core-text-textPrimary-light dark:core-text-textPrimary-dark">Pending Activities Analysis</h2>
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
        <div className="core-flex core-h-full core-min-h-0 core-flex-col core-gap-4 lg:core-gap-6">
          <div className="core-grid core-grid-cols-1 sm:core-grid-cols-2 xl:core-grid-cols-4 core-gap-3 sm:core-gap-4 lg:core-gap-5 core-flex-shrink-0">
            {[
              { label: "Total Pending", value: "81", trend: "+12%", up: true },
              { label: "Avg Age", value: "14 Days", trend: "-2 days", up: false },
              { label: "Critical", value: "8", trend: "High", up: true },
              { label: "Resolution Rate", value: "92%", trend: "+5%", up: true },
            ].map((stat, index) => (
              <div key={index} className="core-bg-card-light dark:core-bg-card-dark core-p-4 core-rounded-2xl core-border core-border-borderBase-light dark:core-border-borderBase-dark">
                <p className="core-text-[10px] core-font-bold core-uppercase core-tracking-wider core-text-textMuted-light core-mb-1">{stat.label}</p>
                <p className="core-text-2xl core-font-black core-text-textPrimary-light dark:core-text-textPrimary-dark">{stat.value}</p>
                <div className={`core-mt-1 core-text-[10px] core-font-bold ${stat.up ? "core-text-emerald-500" : "core-text-rose-500"}`}>{stat.trend} from last week</div>
              </div>
            ))}
          </div>
            <div className="core-flex-1 core-min-h-[260px] core-bg-card-light dark:core-bg-card-dark core-p-4 core-rounded-3xl core-border core-border-borderBase-light dark:core-border-borderBase-dark core-shadow-2xl core-flex core-flex-col">
              {workflows.length === 0 ? (
                <div className="core-flex-1 core-flex core-flex-col core-items-center core-justify-center core-gap-3 core-rounded-2xl core-border-2 core-border-dashed core-border-borderBase-light dark:core-border-borderBase-dark core-text-textMuted-light dark:core-text-textMuted-dark">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="core-opacity-30"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/></svg>
                  <div className="core-text-center">
                    <p className="core-text-sm core-font-bold core-opacity-40">No data available</p>
                    <p className="core-text-xs core-opacity-30 core-mt-1">Pending activities will appear here</p>
                  </div>
                </div>
              ) : (
              <div className="core-flex-1 core-min-h-0 core-w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workflows} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e1c38" : "#edeaf9"} vertical={false} />
                    <XAxis dataKey="app" tick={{ fontSize: 12, fill: dark ? "#7b77a8" : "#7874a3" }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis domain={[0, 50]} ticks={[0, 10, 20, 30, 40, 50]} interval={0} tick={{ fontSize: 12, fill: dark ? "#7b77a8" : "#7874a3" }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip content={CustomTooltip} />
                    <Bar dataKey="pending" fill="url(#barGradMax)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="barGradMax" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
