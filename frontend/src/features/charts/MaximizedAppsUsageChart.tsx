import { IconActivity, IconMinimize } from "@tabler/icons-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CustomAppTick, CustomTooltip } from "../../shared/components/charts";
import { topAppsBarShape } from "../../shared/chartUtils";
import { APP_USAGE_RANGES } from "../../app/constants";
import type { AppUsageRange, MaximizedSection, TopAppsData } from "../../shared/types";
import { useScrollLock } from "../../app/hooks/useScrollLock";

interface MaximizedAppsUsageChartProps {
  dark: boolean;
  appUsageRange: AppUsageRange;
  setAppUsageRange: React.Dispatch<React.SetStateAction<AppUsageRange>>;
  topAppsData: TopAppsData;
  setMaximizedSection: React.Dispatch<React.SetStateAction<MaximizedSection | null>>;
}

export default function MaximizedAppsUsageChart({
  dark,
  appUsageRange,
  setAppUsageRange,
  topAppsData,
  setMaximizedSection,
}: MaximizedAppsUsageChartProps) {
  useScrollLock();
  return (
    <div className="core-flex core-h-full core-flex-col core-bg-page-light dark:core-bg-page-dark core-animate-in core-zoom-in-95 core-duration-300">
      <header className="core-flex core-flex-wrap core-items-start core-justify-between core-gap-3 core-px-4 sm:core-px-6 core-py-1.5 sm:core-py-2 core-border-b core-border-borderBase-light dark:core-border-borderBase-dark core-bg-white/50 dark:core-bg-black/20 core-backdrop-blur-md">
        <div className="core-flex core-min-w-0 core-flex-1 core-items-center core-gap-3">
          <div className="core-w-8 core-h-8 core-rounded-lg core-bg-gradient-to-br core-from-indigo-500 core-to-purple-600 core-flex core-items-center core-justify-center core-shadow-lg core-shadow-indigo-500/20">
            <IconActivity color="#fff" size={16} />
          </div>
          <h2 className="core-text-sm sm:core-text-base core-font-bold core-text-textPrimary-light dark:core-text-textPrimary-dark">Most Used Applications Analysis</h2>
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
        <div className="core-flex core-h-full core-min-h-0 core-flex-col core-bg-card-light dark:core-bg-card-dark core-p-4 core-rounded-3xl core-border core-border-borderBase-light dark:core-border-borderBase-dark core-shadow-2xl">
          <div className="core-mb-4 core-flex core-items-end core-justify-between core-flex-shrink-0">
            <div>
              <h3 className="core-text-lg core-font-black">App Usage Analysis</h3>
              <p className="core-text-xs core-text-textMuted-light dark:core-text-textMuted-dark">Top 5 apps by visit frequency</p>
            </div>
            <div className="core-flex core-items-center core-gap-1 core-bg-black/5 dark:core-bg-white/5 core-p-1 core-rounded-lg">
              {APP_USAGE_RANGES.map((range) => (
                <button
                  key={range}
                  onClick={() => setAppUsageRange(range)}
                  className={`core-text-[10px] core-font-bold core-uppercase core-tracking-wider core-px-3 core-py-1.5 core-rounded-md core-transition-all ${appUsageRange === range ? "core-bg-indigo-600 core-text-white" : "core-text-textMuted-light hover:core-bg-black/5 dark:hover:core-bg-white/5"}`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="core-flex-1 core-min-h-0 core-w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topAppsData[appUsageRange]} margin={{ left: 10, right: 30 }}>
                <defs>
                  <linearGradient id="gradMax0" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                  <linearGradient id="gradMax1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                  <linearGradient id="gradMax2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                  <linearGradient id="gradMax3" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="50%" stopColor="#d946ef" />
                    <stop offset="100%" stopColor="#f472b6" />
                  </linearGradient>
                  <linearGradient id="gradMax4" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e1c38" : "#edeaf9"} vertical={false} strokeOpacity={0.5} />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={(props) => (
                    <CustomAppTick
                      {...props}
                      dark={dark}
                      limit={12}
                      size={12}
                      weight={700}
                      color={dark ? "#ffffff" : "#0f172a"}
                      width={120}
                    />
                  )}
                  axisLine={false}
                  tickLine={false}
                  width={120}
                />
                <Tooltip content={CustomTooltip} cursor={{ fill: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }} />
                <Bar
                  dataKey="value"
                  radius={[0, 6, 6, 0]}
                  barSize={30}
                  label={{ position: "right", fill: dark ? "#a5b4fc" : "#4338ca", fontSize: 12, fontWeight: 700, offset: 10 }}
                  shape={topAppsBarShape("gradMax")}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
