import { memo, useCallback } from "react";
import {
  IconActivity,
  IconApps,
  IconMaximize,
  IconShieldCheck,
} from "@tabler/icons-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell
} from "recharts";
import {
  PIE_COLORS,
} from "../../shared/data";
import { CustomAppTick, CustomTooltip, PieLabelSmall } from "../../shared/components/charts";
import { topAppsBarShape } from "../../shared/chartUtils";
import { APP_USAGE_RANGES, MAXIMIZED_SECTIONS } from "../../app/constants";
import type { AppUsageRange, MaximizedSection, PieEntry, TopAppsData, WorkflowItem } from "../../shared/types";

interface ChartsProps {
  dark: boolean;
  appUsageRange: AppUsageRange;
  setAppUsageRange: React.Dispatch<React.SetStateAction<AppUsageRange>>;
  setMaximizedSection: React.Dispatch<React.SetStateAction<MaximizedSection | null>>;
  topAppsData: TopAppsData;
  pieData: PieEntry[];
  workflows: WorkflowItem[];
}

function Charts({
  dark,
  appUsageRange,
  setAppUsageRange,
  setMaximizedSection,
  topAppsData,
  pieData,
  workflows,
}: ChartsProps) {
  const maximizePendingActivities = useCallback(() => {
    setMaximizedSection(MAXIMIZED_SECTIONS.chartBar);
  }, [setMaximizedSection]);
  const maximizeAppsUsage = useCallback(() => {
    setMaximizedSection(MAXIMIZED_SECTIONS.chartAppsUsage);
  }, [setMaximizedSection]);
  const maximizeRequestStatus = useCallback(() => {
    setMaximizedSection(MAXIMIZED_SECTIONS.chartPie);
  }, [setMaximizedSection]);

  return (
    <div id="charts-section" className="core-grid core-grid-cols-1 sm:core-grid-cols-2 lg:core-grid-cols-3 core-gap-3 sm:core-gap-4 xl:core-gap-5 core-scroll-mt-6">
      <div className="core-rounded-2xl core-p-5 core-shadow-lg core-bg-card-light dark:core-bg-card-dark core-border core-border-borderBase-light dark:core-border-borderBase-dark">
        <div className="core-flex core-items-center core-justify-between core-mb-5 core-gap-2">
          <div className="core-min-w-0">
            <p className="core-text-[12px] core-font-bold core-text-textPrimary-light dark:core-text-textPrimary-dark core-truncate">Pending Activities</p>
            <p className="core-text-[11px] core-text-textMuted-light dark:core-text-textMuted-dark core-truncate">App-wise distribution</p>
          </div>
          <div className="core-flex core-items-center core-gap-2 core-flex-shrink-0">
            <div className="core-w-8 core-h-8 core-rounded-xl core-flex core-items-center core-justify-center core-bg-sky-500/12">
              <IconActivity size={15} className="core-text-sky-500" />
            </div>
            <button
              onClick={maximizePendingActivities}
              className="core-p-1.5 core-rounded-lg core-transition-all hover:core-bg-black/5 dark:hover:core-bg-white/10 core-text-textMuted-light dark:core-text-textMuted-dark"
              title="Maximize"
            >
              <IconMaximize size={15} />
            </button>
          </div>
        </div>
        {workflows.length === 0 ? (
          <div className="core-h-[160px] core-flex core-flex-col core-items-center core-justify-center core-gap-2 core-rounded-xl core-border-2 core-border-dashed core-border-borderBase-light dark:core-border-borderBase-dark core-text-textMuted-light dark:core-text-textMuted-dark">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="core-opacity-40"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/></svg>
            <p className="core-text-[11px] core-font-semibold core-opacity-50">No data available</p>
          </div>
        ) : (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={workflows} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e1c38" : "#edeaf9"} vertical={false} />
            <XAxis dataKey="app" tick={{ fontSize: 9, fill: dark ? "#7b77a8" : "#7874a3" }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 50]} ticks={[0, 10, 20, 30, 40, 50]} interval={0} tick={{ fontSize: 10, fill: dark ? "#7b77a8" : "#7874a3" }} axisLine={false} tickLine={false} width={30} />
            <Tooltip content={CustomTooltip} />
            <Bar dataKey="pending" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
        )}
      </div>

      <div className="core-rounded-2xl core-p-5 core-shadow-lg core-bg-card-light dark:core-bg-card-dark core-border core-border-borderBase-light dark:core-border-borderBase-dark">
        <div className="core-flex core-items-center core-justify-between core-mb-5 core-gap-2">
          <div className="core-min-w-0">
            <p className="core-text-[12px] core-font-bold core-text-textPrimary-light dark:core-text-textPrimary-dark core-truncate">Top 5 Most Used Apps</p>
            <div className="core-flex core-items-center core-gap-2 core-mt-1 core-overflow-x-auto core-pb-1 core-scrollbar-hide">
              {APP_USAGE_RANGES.map((range) => (
                <button
                  key={range}
                  onClick={() => setAppUsageRange(range)}
                  className={`core-text-[9px] core-font-bold core-uppercase core-tracking-wider core-px-1.5 core-py-0.5 core-rounded core-transition-all core-flex-shrink-0 ${appUsageRange === range ? "core-bg-indigo-500 core-text-white" : "core-text-textMuted-light hover:core-bg-black/5 dark:hover:core-bg-white/5"}`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="core-flex core-items-center core-gap-2 core-flex-shrink-0">
            <div className="core-w-8 core-h-8 core-rounded-xl core-flex core-items-center core-justify-center core-bg-indigo-500/12">
              <IconApps size={15} className="core-text-indigo-500" />
            </div>
            <button
              onClick={maximizeAppsUsage}
              className="core-p-1.5 core-rounded-lg core-transition-all hover:core-bg-black/5 dark:hover:core-bg-white/10 core-text-textMuted-light dark:core-text-textMuted-dark"
              title="Maximize"
            >
              <IconMaximize size={15} />
            </button>
          </div>
        </div>
        {!(topAppsData[appUsageRange]?.length) ? (
          <div className="core-h-[160px] core-flex core-flex-col core-items-center core-justify-center core-gap-2 core-rounded-xl core-border-2 core-border-dashed core-border-borderBase-light dark:core-border-borderBase-dark core-text-textMuted-light dark:core-text-textMuted-dark">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="core-opacity-40"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <p className="core-text-[11px] core-font-semibold core-opacity-50">No data available</p>
          </div>
        ) : (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart layout="vertical" data={topAppsData[appUsageRange]} margin={{ left: 0, right: 10 }}>
            <defs>
              <linearGradient id="grad0" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
              <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
              <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <linearGradient id="grad3" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#d946ef" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
              <linearGradient id="grad4" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e1c38" : "#edeaf9"} horizontal vertical={false} />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" tick={<CustomAppTick dark={dark} width={100} />} axisLine={false} tickLine={false} width={100} interval={0} />
            <Tooltip content={CustomTooltip} cursor={{ fill: "transparent" }} />
            <Bar
              dataKey="value"
              radius={[0, 4, 4, 0]}
              barSize={12}
              filter="url(#glow)"
              shape={topAppsBarShape("grad")}
            />
          </BarChart>
        </ResponsiveContainer>
        )}
      </div>

      <div className="core-rounded-2xl core-p-5 core-shadow-lg core-bg-card-light dark:core-bg-card-dark core-border core-border-borderBase-light dark:core-border-borderBase-dark">
        <div className="core-flex core-items-center core-justify-between core-mb-4 core-gap-2">
          <div className="core-min-w-0">
            <p className="core-text-[12px] core-font-bold core-text-textPrimary-light dark:core-text-textPrimary-dark core-truncate">Request Status Breakdown</p>
            <p className="core-text-[11px] core-text-textMuted-light dark:core-text-textMuted-dark core-truncate">Overall request lifecycle</p>
          </div>
          <div className="core-flex core-items-center core-gap-2 core-flex-shrink-0">
            <div className="core-w-8 core-h-8 core-rounded-xl core-flex core-items-center core-justify-center core-bg-rose-500/12">
              <IconShieldCheck size={15} className="core-text-rose-500" />
            </div>
            <button
              onClick={maximizeRequestStatus}
              className="core-p-1.5 core-rounded-lg core-transition-all hover:core-bg-black/5 dark:hover:core-bg-white/10 core-text-textMuted-light dark:core-text-textMuted-dark"
              title="Maximize"
            >
              <IconMaximize size={15} />
            </button>
          </div>
        </div>
        {pieData.length === 0 ? (
          <div className="core-h-[160px] core-flex core-flex-col core-items-center core-justify-center core-gap-2 core-rounded-xl core-border-2 core-border-dashed core-border-borderBase-light dark:core-border-borderBase-dark core-text-textMuted-light dark:core-text-textMuted-dark">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="core-opacity-40"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 6.364 15.364M12 3v9l4 4"/></svg>
            <p className="core-text-[11px] core-font-semibold core-opacity-50">No data available</p>
          </div>
        ) : (
        <div className="core-flex core-items-center core-gap-2">
          <ResponsiveContainer width="52%" height={160}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={68}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index]}
                  />
                ))}

                <Label content={PieLabelSmall} />
              </Pie>

              <Tooltip content={CustomTooltip} />
            </PieChart>
          </ResponsiveContainer>
          <div className="core-flex-1 core-space-y-2">
            {pieData.map((entry, index) => (
              <div key={index} className="core-flex core-items-center core-justify-between">
                <div className="core-flex core-items-center core-gap-2">
                  <span className="core-w-2 core-h-2 core-rounded-full core-flex-shrink-0" style={{ background: PIE_COLORS[index] }} />
                  <span className="core-text-[11px] core-text-textMuted-light dark:core-text-textMuted-dark">{entry.name}</span>
                </div>
                <span className="core-text-[12px] core-font-bold core-text-textPrimary-light dark:core-text-textPrimary-dark">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default memo(Charts);
