import { useState, useMemo, useEffect, useRef, useCallback, useDeferredValue } from "react";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, LabelList, AreaChart, Area, Legend, PieChart, Pie, ScatterChart, Scatter, ZAxis
} from "recharts";
import { IconTable, IconChartBar, IconSearch, IconDashboard, IconLayersIntersect, IconActivity, IconTargetArrow, IconApps, IconServer, IconMinimize, IconFlame } from "@tabler/icons-react";
import type { AdminToolComponentProps } from "../../../shared/types";
import { AppSummarySkeleton } from "../../../shared/components";
import "./styles.css"

// ─── Types ────────────────────────────────────────────────────────────────────
interface SortEntry {
  id: string;
  desc: boolean;
}

interface MonthStats {
  created: number;
  updated: number;
  visited: number;
}

interface AppRow {
  sr: number;
  prn: number;
  name: string;
  desc: string;
  instances: number;
  uniqueUsers: number;
  totalPoints: number;
  months: Record<string, MonthStats>;
}

interface ColumnDef {
  id?: string;
  header: string;
  accessorKey?: string;
  accessorFn?: (row: AppRow) => unknown;
  size?: number;
  footer?: () => string;
  columns?: ColumnDef[];
}

interface TableState {
  sorting?: SortEntry[];
  globalFilter?: string;
}

interface UseReactTableOptions {
  data: AppRow[];
  columns: ColumnDef[];
  state: TableState;
  onSortingChange?: (next: SortEntry[]) => void;
}

// ─── Mock TanStack Table v8 (inline implementation) ───────────────────────────
function useReactTable({ data, columns, state, onSortingChange }: UseReactTableOptions) {
  const [internalSorting, setInternalSorting] = useState<SortEntry[]>([]);
  const sorting = state?.sorting ?? internalSorting;
  const globalFilter = state?.globalFilter ?? "";

  const filteredRows = useMemo(() => {
    if (!globalFilter) return data;
    const lower = globalFilter.toLowerCase();
    return data.filter(row =>
      Object.values(row).some(v => String(v).toLowerCase().includes(lower))
    );
  }, [data, globalFilter]);

  const sortedRows = useMemo(() => {
    if (!sorting.length) return filteredRows;
    return [...filteredRows].sort((a: AppRow, b: AppRow) => {
      for (const sort of sorting) {
        const { id, desc } = sort;
        const getVal = (row: AppRow): unknown => {
          const parts = id.split(".");
          let v: unknown = row;
          for (const p of parts) v = (v as Record<string, unknown>)?.[p];
          return v ?? "";
        };
        const av = getVal(a) as string | number, bv = getVal(b) as string | number;
        if (av < bv) return desc ? 1 : -1;
        if (av > bv) return desc ? -1 : 1;
      }
      return 0;
    });
  }, [filteredRows, sorting]);

  const leafColumns = useMemo(() => {
    const leaves: ColumnDef[] = [];
    const flatten = (cols: ColumnDef[], depth = 0) => {
      cols.forEach(col => {
        if (col.columns) flatten(col.columns, depth + 1);
        else leaves.push({ ...col, depth } as ColumnDef & { depth: number });
      });
    };
    flatten(columns);
    return leaves;
  }, [columns]);

  const handleSort = useCallback((colId: string) => {
    const existing = sorting.find((s: SortEntry) => s.id === colId);
    let next: SortEntry[];
    if (!existing) next = [{ id: colId, desc: false }];
    else if (!existing.desc) next = [{ id: colId, desc: true }];
    else next = sorting.filter((s: SortEntry) => s.id !== colId);
    if (onSortingChange) onSortingChange(next);
    else setInternalSorting(next);
  }, [sorting, onSortingChange]);

  return {
    getHeaderGroups: () => buildHeaderGroups(columns, handleSort, sorting),
    getRowModel: () => ({
      rows: sortedRows.map((row: AppRow, i: number) => ({
        id: String(i),
        original: row,
        getVisibleCells: () => leafColumns.map(col => ({
          id: col.id ?? col.accessorKey,
          column: col,
          getValue: () => {
            const key = col.accessorKey;
            if (!key) return col.accessorFn ? col.accessorFn(row) : "";
            const parts = key.split(".");
            let v: unknown = row;
            for (const p of parts) v = (v as Record<string, unknown>)?.[p];
            return v ?? "";
          },
          renderValue: () => {
            const key = col.accessorKey;
            if (!key) return col.accessorFn ? col.accessorFn(row) : "";
            const parts = key.split(".");
            let v: unknown = row;
            for (const p of parts) v = (v as Record<string, unknown>)?.[p];
            return v ?? "";
          },
          row: { original: row }
        }))
      }))
    }),
    getFooterGroups: () => buildHeaderGroups(columns, handleSort, sorting),
    getFilteredRowModel: () => ({ rows: filteredRows.map((r: AppRow, i: number) => ({ id: String(i), original: r })) }),
    filteredRows
  };
}

interface HeaderEntry {
  id: string;
  column: ColumnDef;
  colSpan: number;
  rowSpan: number;
  isGroup: boolean;
  getSortHandler?: () => () => void;
  getSortingIndicator?: () => string | null;
  getContext?: () => { column: ColumnDef };
}

interface HeaderGroup {
  id: string;
  headers: HeaderEntry[];
}

function buildHeaderGroups(
  columns: ColumnDef[],
  handleSort: (id: string) => void,
  sorting: SortEntry[]
): HeaderGroup[] {
  const groups: HeaderGroup[] = [];
  const buildLevel = (cols: ColumnDef[], depth: number) => {
    if (!cols.some(c => c.columns)) return;
    const headers: HeaderEntry[] = [];
    cols.forEach(col => {
      if (col.columns) {
        headers.push({ id: col.id ?? col.header, column: col, colSpan: countLeaves(col), rowSpan: 1, isGroup: true });
      } else {
        headers.push({ id: col.id ?? col.accessorKey ?? "", column: col, colSpan: 1, rowSpan: 2, isGroup: false });
      }
    });
    groups.push({ id: String(depth), headers });
    const subCols = cols.flatMap(c => c.columns ?? []);
    if (subCols.length) buildLevel(subCols, depth + 1);
  };

  const hasGroups = columns.some(c => c.columns);
  if (hasGroups) {
    buildLevel(columns, 0);
  } else {
    const headers: HeaderEntry[] = columns.map(col => ({
      id: col.id ?? col.accessorKey ?? "",
      column: col,
      colSpan: 1,
      rowSpan: 1,
      isGroup: false,
      getContext: () => ({ column: col }),
      getSortHandler: () => () => handleSort(col.id ?? col.accessorKey ?? ""),
      getSortingIndicator: () => {
        const s = sorting.find(s => s.id === (col.id ?? col.accessorKey));
        return s ? (s.desc ? "↓" : "↑") : null;
      }
    }));
    groups.push({ id: "0", headers });
  }

  // Attach sort handler to all leaf headers
  groups.forEach(group => {
    group.headers.forEach(h => {
      if (!h.isGroup && !h.getSortHandler) {
        const colId = h.id;
        h.getSortHandler = () => () => handleSort(colId);
        h.getSortingIndicator = () => {
          const s = sorting.find(s => s.id === colId);
          return s ? (s.desc ? "↓" : "↑") : null;
        };
        h.getContext = () => ({ column: h.column });
      }
    });
  });

  return groups;
}

function countLeaves(col: ColumnDef): number {
  if (!col.columns) return 1;
  return col.columns.reduce((sum: number, c: ColumnDef) => sum + countLeaves(c), 0);
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface MonthBase {
  created: number;
  updated: number;
  visited: number;
}

function makeMonthData(base: MonthBase): Record<string, MonthStats> {
  const obj: Record<string, MonthStats> = {};
  MONTHS.forEach((m, i) => {
    const scale = 1 + Math.sin(i * 0.5) * 0.3;
    obj[m] = {
      created: Math.round(base.created * scale * (0.8 + Math.random() * 0.4)),
      updated: Math.round(base.updated * scale * (0.8 + Math.random() * 0.4)),
      visited: Math.round(base.visited * scale * (0.8 + Math.random() * 0.4)),
    };
  });
  return obj;
}

const RAW_DATA: AppRow[] = [
  { sr: 1, prn: 1, name: "M-SM", desc: "Strategic Management System for enterprise resource planning and coordination", instances: 1, uniqueUsers: 820, totalPoints: 504, months: makeMonthData({ created: 30, updated: 50, visited: 1200 }) },
  { sr: 2, prn: 12, name: "MINTS INTERNAL", desc: "Internal monitoring and analytics platform for operational intelligence", instances: 40, uniqueUsers: 1776, totalPoints: 8128, months: makeMonthData({ created: 1200, updated: 1900, visited: 3800 }) },
  { sr: 3, prn: 12, name: "VCMS", desc: "Value Change Management System – supports validation and approval lifecycle", instances: 1, uniqueUsers: 38046, totalPoints: 5494, months: makeMonthData({ created: 800, updated: 1200, visited: 2800 }) },
  { sr: 4, prn: 12, name: "pl'mt_Apps", desc: "Application used in OET shop floor for validation and production of Closed-Cabinet list items", instances: 1, uniqueUsers: 235, totalPoints: 3488, months: makeMonthData({ created: 400, updated: 600, visited: 1100 }) },
  { sr: 5, prn: 66, name: "VPD", desc: "Dashboard for managing VC shopping with pre-response data utilizer hooks", instances: 1, uniqueUsers: 215, totalPoints: 300, months: makeMonthData({ created: 40, updated: 80, visited: 450 }) },
  { sr: 6, prn: 72, name: "pl'mt_Apps v2", desc: "Variants of production management apps for micro-services coordination", instances: 4, uniqueUsers: 12, totalPoints: 64, months: makeMonthData({ created: 10, updated: 20, visited: 80 }) },
  { sr: 7, prn: 73, name: "iConnect Tracker", desc: "Generic Tracker Manager – links resources, employees, and project timelines across teams", instances: 1, uniqueUsers: 8017, totalPoints: 6316, months: makeMonthData({ created: 1000, updated: 2200, visited: 3200 }) },
  { sr: 8, prn: 14, name: "SupplyChain Hub", desc: "End-to-end supply chain visibility and logistics coordination platform for global operations", instances: 3, uniqueUsers: 4200, totalPoints: 2910, months: makeMonthData({ created: 500, updated: 900, visited: 2100 }) },
  { sr: 9, prn: 21, name: "HR Connect", desc: "Human resources management portal covering recruitment, onboarding, and performance reviews", instances: 2, uniqueUsers: 6300, totalPoints: 4100, months: makeMonthData({ created: 700, updated: 1100, visited: 2500 }) },
  { sr: 10, prn: 21, name: "PayrollX", desc: "Automated payroll processing system with tax compliance and multi-currency support", instances: 1, uniqueUsers: 890, totalPoints: 1750, months: makeMonthData({ created: 200, updated: 450, visited: 980 }) },
  { sr: 11, prn: 34, name: "AssetTrack", desc: "Real-time tracking and lifecycle management of physical and digital enterprise assets", instances: 5, uniqueUsers: 3100, totalPoints: 3380, months: makeMonthData({ created: 430, updated: 770, visited: 1800 }) },
  { sr: 12, prn: 34, name: "FieldOps", desc: "Mobile-first field operations management tool for on-site technician dispatching and reporting", instances: 6, uniqueUsers: 1450, totalPoints: 2210, months: makeMonthData({ created: 310, updated: 560, visited: 1320 }) },
  { sr: 13, prn: 45, name: "DataVault", desc: "Secure enterprise data archiving and retrieval system with audit trail and compliance controls", instances: 2, uniqueUsers: 520, totalPoints: 1870, months: makeMonthData({ created: 180, updated: 300, visited: 870 }) },
  { sr: 14, prn: 45, name: "ComplianceGuard", desc: "Regulatory compliance tracking platform covering ISO, SOX, GDPR, and industry-specific mandates", instances: 1, uniqueUsers: 340, totalPoints: 1640, months: makeMonthData({ created: 140, updated: 260, visited: 760 }) },
  { sr: 15, prn: 52, name: "ProjectPulse", desc: "Agile project management suite with sprint planning, burndown charts, and stakeholder dashboards", instances: 8, uniqueUsers: 9200, totalPoints: 7140, months: makeMonthData({ created: 1100, updated: 2000, visited: 4200 }) },
  { sr: 16, prn: 52, name: "BudgetLens", desc: "Enterprise budget planning and cost allocation tool with real-time variance analysis", instances: 2, uniqueUsers: 670, totalPoints: 2080, months: makeMonthData({ created: 230, updated: 410, visited: 1050 }) },
  { sr: 17, prn: 58, name: "ClientPortal", desc: "Self-service customer portal for order tracking, invoice management, and support ticket submission", instances: 3, uniqueUsers: 14500, totalPoints: 5830, months: makeMonthData({ created: 900, updated: 1600, visited: 5600 }) },
  { sr: 18, prn: 58, name: "SalesForce CRM", desc: "Integrated CRM platform for managing leads, opportunities, and customer account hierarchies", instances: 5, uniqueUsers: 11200, totalPoints: 6720, months: makeMonthData({ created: 980, updated: 1750, visited: 4900 }) },
  { sr: 19, prn: 61, name: "InventoryIQ", desc: "AI-powered inventory optimisation system with demand forecasting and automated reorder triggers", instances: 4, uniqueUsers: 2800, totalPoints: 3960, months: makeMonthData({ created: 550, updated: 980, visited: 2300 }) },
  { sr: 20, prn: 61, name: "QualityWatch", desc: "Quality assurance management platform for defect tracking, root cause analysis, and corrective actions", instances: 2, uniqueUsers: 1100, totalPoints: 2540, months: makeMonthData({ created: 330, updated: 590, visited: 1400 }) },
  { sr: 21, prn: 67, name: "EnergyMonitor", desc: "Real-time energy consumption monitoring and sustainability reporting across facilities", instances: 3, uniqueUsers: 480, totalPoints: 1320, months: makeMonthData({ created: 120, updated: 220, visited: 610 }) },
  { sr: 22, prn: 67, name: "FleetManager", desc: "Fleet vehicle management system covering scheduling, maintenance alerts, and driver performance metrics", instances: 7, uniqueUsers: 2200, totalPoints: 4100, months: makeMonthData({ created: 620, updated: 1100, visited: 2700 }) },
  { sr: 23, prn: 74, name: "DocuFlow", desc: "Intelligent document workflow automation for approvals, versioning, and cross-department routing", instances: 2, uniqueUsers: 7600, totalPoints: 5210, months: makeMonthData({ created: 800, updated: 1400, visited: 3600 }) },
  { sr: 24, prn: 74, name: "KnowledgeBase Pro", desc: "Centralised enterprise knowledge repository with semantic search and AI-assisted content curation", instances: 1, uniqueUsers: 5400, totalPoints: 3780, months: makeMonthData({ created: 600, updated: 1050, visited: 2900 }) },
  { sr: 25, prn: 80, name: "RiskRadar", desc: "Enterprise risk management platform with threat modelling, mitigation tracking, and board-level dashboards", instances: 1, uniqueUsers: 290, totalPoints: 1180, months: makeMonthData({ created: 100, updated: 190, visited: 520 }) },
  { sr: 26, prn: 80, name: "AuditPro", desc: "Internal audit management tool supporting planning, fieldwork, findings, and remediation workflows", instances: 1, uniqueUsers: 160, totalPoints: 980, months: makeMonthData({ created: 80, updated: 150, visited: 430 }) },
  { sr: 27, prn: 85, name: "TrainingHub", desc: "Learning management system with course authoring, certification tracking, and skills gap analysis", instances: 4, uniqueUsers: 18000, totalPoints: 9240, months: makeMonthData({ created: 1400, updated: 2400, visited: 7200 }) },
  { sr: 28, prn: 85, name: "OnboardEase", desc: "Digital onboarding platform streamlining new hire documentation, orientation, and buddy assignment", instances: 2, uniqueUsers: 3400, totalPoints: 2670, months: makeMonthData({ created: 380, updated: 680, visited: 1700 }) },
  { sr: 29, prn: 91, name: "ProcureNet", desc: "End-to-end procurement management system covering requisitions, sourcing, and purchase orders", instances: 3, uniqueUsers: 1900, totalPoints: 3120, months: makeMonthData({ created: 420, updated: 750, visited: 1950 }) },
  { sr: 30, prn: 91, name: "VendorHub", desc: "Supplier relationship management portal for onboarding, scorecards, and contract lifecycle tracking", instances: 2, uniqueUsers: 640, totalPoints: 1860, months: makeMonthData({ created: 180, updated: 320, visited: 890 }) },
  { sr: 31, prn: 95, name: "HealthSafe", desc: "Workplace health and safety incident reporting, risk assessment, and regulatory submission platform", instances: 1, uniqueUsers: 2700, totalPoints: 2290, months: makeMonthData({ created: 300, updated: 540, visited: 1400 }) },
  { sr: 32, prn: 95, name: "LeaveTracker", desc: "Employee leave and absence management system integrated with payroll and team calendars", instances: 1, uniqueUsers: 12400, totalPoints: 4560, months: makeMonthData({ created: 700, updated: 1200, visited: 4800 }) },
  { sr: 33, prn: 102, name: "ITServiceDesk", desc: "ITIL-aligned service desk for incident management, problem tracking, and change advisory processes", instances: 5, uniqueUsers: 9800, totalPoints: 6180, months: makeMonthData({ created: 950, updated: 1700, visited: 4300 }) },
  { sr: 34, prn: 102, name: "NetworkOps", desc: "Network infrastructure monitoring and alerting platform with auto-remediation playbooks", instances: 3, uniqueUsers: 310, totalPoints: 1430, months: makeMonthData({ created: 130, updated: 240, visited: 670 }) },
  { sr: 35, prn: 108, name: "MarketingCentral", desc: "Omnichannel marketing campaign planning, execution, and ROI measurement platform", instances: 2, uniqueUsers: 4700, totalPoints: 3870, months: makeMonthData({ created: 580, updated: 1020, visited: 2600 }) },
  { sr: 36, prn: 108, name: "BrandAssetMgr", desc: "Digital asset management system for centralising brand guidelines, logos, and creative collateral", instances: 1, uniqueUsers: 1300, totalPoints: 1540, months: makeMonthData({ created: 160, updated: 290, visited: 820 }) },
  { sr: 37, prn: 115, name: "AnalyticsEdge", desc: "Self-service business intelligence platform with drag-and-drop report builder and AI-driven insights", instances: 6, uniqueUsers: 7200, totalPoints: 5960, months: makeMonthData({ created: 880, updated: 1580, visited: 3900 }) },
];

// ─── Colour palette ───────────────────────────────────────────────────────────
const PALETTE = ["#0ea5e9", "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#10b981", "#f59e0b", "#14b8a6"];

// ─── Analytics Charts Components ──────────────────────────────────────────────

interface TooltipPayloadEntry {
  name: string;
  value: number | string;
  color?: string;
  fill?: string;
  payload: unknown;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="core-bg-white core-p-3 core-border core-border-slate-200 core-rounded-xl core-shadow-xl core-text-[12px]">
        <p className="core-font-bold core-text-slate-900 core-mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="core-flex core-items-center core-gap-2 core-mt-1">
            <div className="core-w-2 core-h-2 core-rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            <span className="core-text-slate-500">{entry.name}:</span>
            <span className="core-font-bold core-text-slate-800">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const BarChartComponent = ({ data, isMobile, isCompact }: { data: AppRow[], isMobile: boolean, isCompact: boolean }) => {
  const chartData = useMemo(() => data.map(r => ({
    name: r.name.length > (isMobile ? 8 : isCompact ? 12 : 16) ? r.name.slice(0, isMobile ? 8 : isCompact ? 12 : 16) + "…" : r.name,
    points: r.totalPoints,
    fullName: r.name
  })), [data, isMobile, isCompact]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 20, right: 16, left: isMobile ? -20 : 0, bottom: isMobile ? 40 : 20 }}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis
          dataKey="name"
          axisLine={{ stroke: '#e2e8f0' }}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: isMobile ? 9 : 10 }}
          angle={isMobile ? -34 : isCompact ? -25 : -20}
          textAnchor="end"
          interval={0}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: isMobile ? 9 : 10 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="points" name="Usage Points" radius={[6, 6, 0, 0]} barSize={isMobile ? 24 : 48}>
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill="url(#barGradient)" />
          ))}
          <LabelList dataKey="points" position="top" fill="#6366f1" fontSize={isMobile ? 9 : 10} fontWeight={600} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const LineChartComponent = ({ data, isMobile }: { data: { created: number[], visited: number[] }, isMobile: boolean }) => {
  const chartData = useMemo(() => MONTHS.map((m, i) => ({
    name: m,
    Created: data.created[i],
    Visited: data.visited[i]
  })), [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: isMobile ? -20 : 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorVisited" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis
          dataKey="name"
          axisLine={{ stroke: '#e2e8f0' }}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: isMobile ? 9 : 10 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: isMobile ? 9 : 10 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          align="center"
          iconType="circle"
          wrapperStyle={{ paddingBottom: '20px', fontSize: isMobile ? 10 : 11, fontWeight: 500, color: '#64748b' }}
        />
        <Area type="monotone" dataKey="Created" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorCreated)" />
        <Area type="monotone" dataKey="Visited" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisited)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const PieChartComponent = ({ data, isCompact }: { data: { name: string, value: number }[], isCompact: boolean }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const d = payload[0].payload as { name: string, value: number, fill: string };
              const total = data.reduce((s, r) => s + r.value, 0);
              const percent = ((d.value / total) * 100).toFixed(1);
              return (
                <div className="core-bg-white core-p-3 core-border core-border-slate-200 core-rounded-xl core-shadow-xl core-text-[12px]">
                  <p className="core-font-bold core-text-slate-900 core-mb-1">{d.name}</p>
                  <div className="core-flex core-items-center core-gap-2">
                    <div className="core-w-2 core-h-2 core-rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
                    <span className="core-text-slate-500">Instances:</span>
                    <span className="core-font-bold core-text-slate-800">{d.value} ({percent}%)</span>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="45%"
          outerRadius="75%"
          paddingAngle={2}
          dataKey="value"
          label={!isCompact ? { fill: '#475569', fontSize: 11, fontWeight: 500 } : false}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} stroke="#fff" strokeWidth={2} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

const HeatmapChartComponent = ({ data, names, rawData, isMobile, isCompact }: { data: [number, number, number][], names: string[], rawData: AppRow[], isMobile: boolean, isCompact: boolean }) => {
  const chartData = useMemo(() => {
    return data.map(row => ({
      x: row[0],
      y: row[1],
      value: row[2],
      month: MONTHS[row[0]],
      appName: names[row[1]],
      fullName: rawData[row[1]]?.name || names[row[1]]
    }));
  }, [data, names, rawData]);

  const getColor = (value: number) => {
    if (value === 0) return '#f8fafc'; // slate-50
    if (value < 400) return '#e0e7ff'; // indigo-100
    if (value < 800) return '#c7d2fe'; // indigo-200
    if (value < 1500) return '#818cf8'; // indigo-400
    if (value < 2500) return '#4f46e5'; // indigo-600
    return '#3730a3'; // indigo-800
  };

  return (
    <div className="core-h-full core-flex core-flex-col">
      <div className="core-flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, left: isMobile ? 0 : 20, bottom: 0 }}>
            <XAxis
              type="category"
              dataKey="month"
              name="Month"
              interval={0}
              tick={{ fontSize: isMobile ? 9 : 10, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="appName"
              name="App"
              width={isMobile ? 70 : isCompact ? 100 : 140}
              tick={{ fontSize: isMobile ? 9 : 10, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <ZAxis type="number" dataKey="value" range={[100, 100]} />
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="core-bg-white/95 core-backdrop-blur-sm core-p-3 core-border core-border-slate-200 core-rounded-xl core-shadow-xl core-text-[12px] core-animate-in core-fade-in core-zoom-in-95">
                      <p className="core-font-bold core-text-slate-900 core-mb-1">{d.fullName}</p>
                      <div className="core-flex core-items-center core-gap-2">
                        <div className="core-w-2 core-h-2 core-rounded-full" style={{ backgroundColor: getColor(d.value) }} />
                        <p className="core-text-slate-500">
                          <span className="core-font-bold core-text-slate-800">{d.value.toLocaleString()}</span> updates in {d.month}
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter data={chartData} shape={(props: { cx?: number; cy?: number; payload?: { value: number } }) => {
              const { cx = 0, cy = 0, payload } = props;
              if (!payload) return null;
              const width = isMobile ? 18 : isCompact ? 22 : 28;
              const maxHeight = Math.max(6, Math.min(16, (240 / names.length) - 2));
              const height = isMobile ? 10 : maxHeight;

              return (
                <rect
                  x={cx - width / 2}
                  y={cy - height / 2}
                  width={width}
                  height={height}
                  fill={getColor(payload.value)}
                  rx={names.length > 15 ? 1 : 2}
                  className="core-transition-colors core-duration-300"
                  style={{ stroke: '#fff', strokeWidth: 0.5 }}
                />
              );
            }} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="core-flex core-items-center core-justify-center core-gap-4 core-pt-3 core-mt-2 core-border-t core-border-slate-50">
        <span className="core-text-[10px] core-font-medium core-text-slate-400">Low</span>
        <div className="core-flex core-gap-1">
          {[0, 400, 800, 1500, 2500, 4000].map(v => (
            <div
              key={v}
              className="core-w-3 core-h-3 core-rounded-[2px]"
              style={{ backgroundColor: getColor(v) }}
            />
          ))}
        </div>
        <span className="core-text-[10px] core-font-medium core-text-slate-400">High</span>
      </div>
    </div>
  );
};

// ─── Analytics Charts ─────────────────────────────────────────────────────────
function AnalyticsView({ data }: { data: AppRow[] }) {
  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isCompact = windowWidth < 1366;

  const top5ByPoints = useMemo(() =>
    [...data].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 5),
    [data]
  );

  const trendData = useMemo(() => {
    const createdArr = new Array(12).fill(0);
    const visitedArr = new Array(12).fill(0);

    for (let i = 0; i < data.length; i++) {
      const rowMonths = data[i].months;
      for (let j = 0; j < 12; j++) {
        const m = MONTHS[j];
        if (rowMonths[m]) {
          createdArr[j] += rowMonths[m].created;
          visitedArr[j] += rowMonths[m].visited;
        }
      }
    }
    return { created: createdArr, visited: visitedArr };
  }, [data]);

  const instanceDist = useMemo(() =>
    data.filter(r => r.instances > 0).map(r => ({ name: r.name, value: r.instances })),
    [data]
  );

  const heatmapData = useMemo(() => {
    const sourceRows = isMobile || isCompact
      ? [...data].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 15)
      : [...data].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 20);
    const rows: [number, number, number][] = [];
    sourceRows.forEach((r: AppRow, ri: number) => {
      MONTHS.forEach((m, mi) => {
        rows.push([mi, ri, r.months[m]?.updated ?? 0]);
      });
    });
    return {
      rows,
      names: sourceRows.map(r => r.name.length > (isMobile ? 9 : isCompact ? 14 : 20) ? r.name.slice(0, isMobile ? 9 : isCompact ? 14 : 20) + "…" : r.name),
    };
  }, [data, isMobile, isCompact]);

  const cards = [
    {
      title: "Top 5 Apps by Usage Points",
      subtitle: "Performance metrics across leading tier",
      component: <BarChartComponent data={top5ByPoints} isMobile={isMobile} isCompact={isCompact} />,
      icon: <IconActivity className="core-w-5 core-h-5 core-text-indigo-500" />
    },
    {
      title: "Created vs Visited Trend",
      subtitle: "12-Month application engagement",
      component: <LineChartComponent data={trendData} isMobile={isMobile} />,
      icon: <IconTargetArrow className="core-w-5 core-h-5 core-text-sky-500" />
    },
    {
      title: "Instance Distribution",
      subtitle: "Categorical breakdown by type",
      component: <PieChartComponent data={instanceDist} isCompact={isCompact} />,
      icon: <IconLayersIntersect className="core-w-5 core-h-5 core-text-fuchsia-500" />
    },
    {
      title: "Monthly Update Intensity",
      subtitle: "Historical system update frequencies",
      component: <HeatmapChartComponent data={heatmapData.rows} names={heatmapData.names} rawData={data} isMobile={isMobile} isCompact={isCompact} />,
      icon: <IconFlame className="core-w-5 core-h-5 core-text-orange-500" />
    },
  ];

  return (
    <div className="core-h-full core-min-h-0 core-grid core-grid-cols-1 core-auto-rows-max core-gap-4 core-overflow-y-auto core-overflow-x-hidden core-p-4 sm:core-gap-6 sm:core-p-6 xl:core-grid-cols-2 core-custom-scrollbar core-content-start">
      {cards.map((c, i) => (
        <div key={i} style={{ minHeight: isMobile ? 310 : 370 }} className="core-flex core-flex-col core-bg-white core-rounded-2xl core-border core-border-slate-200/70 core-shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:core-shadow-md core-transition-all core-duration-300 core-overflow-hidden">
          <div className="core-px-5 core-py-4 core-border-b core-border-slate-100/60 core-flex core-items-center core-gap-3 core-shrink-0">
            <div className="core-p-2 core-bg-slate-50 core-rounded-lg core-border core-border-slate-100">
              {c.icon}
            </div>
            <div>
              <h3 className="core-text-[12px] core-font-bold core-text-slate-800">{c.title}</h3>
              <p className="core-text-[11px] core-font-medium core-text-slate-500 core-mt-0.5">{c.subtitle}</p>
            </div>
          </div>
          <div style={{ height: isMobile ? 240 : 300, minHeight: isMobile ? 240 : 300 }} className="core-p-4 core-flex-1">
            {c.component}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Instance Details Modal Component ──────────────────────────────────────
interface InstanceDetail {
  sr: number;
  projectName: string;
  projectId: number;
}

function InstanceDetailModal({
  isOpen,
  onClose,
  appName,
  instanceCount
}: {
  isOpen: boolean;
  onClose: () => void;
  appName: string;
  instanceCount: number;
}) {
  const [modalFilter, setModalFilter] = useState("");
  const [modalSort, setModalSort] = useState<{ id: string; desc: boolean } | null>(null);

  // Generate mock details based on the count
  const details = useMemo<InstanceDetail[]>(() => {
    return Array.from({ length: instanceCount }, (_, i) => ({
      sr: i + 1,
      projectName: `Project ${String.fromCharCode(65 + (i % 26))}${i + 1} - ${appName}`,
      projectId: 2000 + i
    }));
  }, [instanceCount, appName]);

  const processedDetails = useMemo(() => {
    let result = [...details];

    // Filter
    if (modalFilter) {
      const q = modalFilter.toLowerCase();
      result = result.filter(d =>
        d.projectName.toLowerCase().includes(q) ||
        String(d.projectId).includes(q)
      );
    }

    // Sort
    if (modalSort) {
      const { id, desc } = modalSort;
      result.sort((a, b) => {
        let valA = a[id as keyof InstanceDetail] as string | number;
        let valB = b[id as keyof InstanceDetail] as string | number;

        if (typeof valA === 'string' && typeof valB === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return desc ? 1 : -1;
        if (valA > valB) return desc ? -1 : 1;
        return 0;
      });
    }

    return result;
  }, [details, modalFilter, modalSort]);

  const handleSort = (id: string) => {
    if (modalSort?.id === id) {
      if (modalSort.desc) setModalSort(null);
      else setModalSort({ id, desc: true });
    } else {
      setModalSort({ id, desc: false });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="core-fixed core-inset-0 core-z-[100] core-flex core-items-center core-justify-center core-p-4 sm:core-p-6">
      <div
        className="core-absolute core-inset-0 core-bg-slate-900/60 core-backdrop-blur-[10px] core-animate-in core-fade-in core-duration-300"
        onClick={onClose}
      />

      <div className="core-relative core-bg-white core-rounded-[24px] core-shadow-[0_20px_50px_rgba(0,0,0,0.2)] core-w-full core-max-w-4xl core-max-h-[85vh] core-overflow-hidden core-flex core-flex-col core-animate-in core-zoom-in-95 core-duration-300 core-border core-border-white/20">
        {/* Modal Header */}
        <div className="core-flex core-items-center core-justify-between core-px-8 core-py-6 core-border-b core-border-slate-100">
          <div>
            <h2 className="core-text-[14px] core-font-bold core-text-slate-900">Project Details</h2>
            <p className="core-text-[12px] core-text-slate-500 core-mt-1">Showing {processedDetails.length} instances for <span className="core-font-semibold core-text-blue-600">{appName}</span></p>
          </div>
          <button
            onClick={onClose}
            className="core-p-2 core-rounded-full hover:core-bg-slate-100 core-transition-colors core-text-slate-400 hover:core-text-slate-600"
          >
            <IconSearch className="core-w-6 core-h-6 core-rotate-45" stroke={1.5} />
          </button>
        </div>

        {/* Modal Search Bar */}
        <div className="core-px-8 core-py-4 core-bg-slate-50/50 core-border-b core-border-slate-100">
          <div className="core-relative">
            <IconSearch className="core-absolute core-left-4 core-top-1/2 -core-translate-y-1/2 core-w-5 core-h-5 core-text-slate-400" />
            <input
              id="pm-search"
              type="text"
              placeholder="Search by project name or ID..."
              className="core-w-full core-pl-12 core-pr-4 core-py-3 core-bg-white core-border core-border-slate-200 core-rounded-xl core-text-[12px] core-outline-none focus:core-ring-2 focus:core-ring-blue-500/20 focus:core-border-blue-500 core-transition-all core-shadow-sm"
              value={modalFilter}
              onChange={(e) => setModalFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Modal Table Content */}
        <div className="core-flex-1 core-overflow-auto core-custom-scrollbar">
          <table className="core-w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead className="core-sticky core-top-0 core-z-10">
              <tr>
                {[
                  { id: 'sr', label: 'Sr No', align: 'left', width: '100px' },
                  { id: 'projectName', label: 'Project Name', align: 'left', width: 'auto' },
                  { id: 'projectId', label: 'Project Id', align: 'right', width: '120px' }
                ].map((col, idx, arr) => (
                  <th
                    key={col.id}
                    onClick={() => handleSort(col.id)}
                    className={`core-px-6 core-py-4 core-text-${col.align} core-text-[12px] core-font-semibold core-uppercase core-tracking-wider core-cursor-pointer hover:core-bg-slate-700 core-transition-colors core-select-none core-bg-slate-800 core-text-white core-whitespace-nowrap`}
                    style={{ width: col.width, backgroundClip: 'padding-box', boxShadow: `inset 0 -1px 0 0 #334155${idx < arr.length - 1 ? ', inset -1px 0 0 0 #334155' : ''}` }}
                  >
                    <div className={`core-flex core-items-center core-gap-2 ${col.align === 'right' ? 'core-justify-end' : 'core-justify-start'}`}>
                      <span>{col.label}</span>
                      <span className="core-text-slate-400 core-w-3 core-text-center">
                        {modalSort?.id === col.id ? (modalSort.desc ? "↓" : "↑") : ""}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="core-divide-y core-divide-slate-100">
              {processedDetails.length > 0 ? (
                processedDetails.map((d) => (
                  <tr key={d.sr} className="core-group hover:core-bg-blue-50/50 core-transition-colors">
                    <td className="core-px-6 core-py-4 core-text-[12px] core-text-slate-500 core-border-r core-border-slate-200">{d.sr}</td>
                    <td className="core-px-6 core-py-4 core-text-[12px] core-font-medium core-text-slate-800 group-hover:core-text-blue-700 core-border-r core-border-slate-200">{d.projectName}</td>
                    <td className="core-px-6 core-py-4 core-text-[12px] core-text-right core-font-mono core-text-slate-600">{d.projectId}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="core-px-6 core-py-20 core-text-center">
                    <div className="core-flex core-flex-col core-items-center core-gap-3">
                      <div className="core-p-4 core-bg-slate-50 core-rounded-full">
                        <IconSearch className="core-w-8 core-h-8 core-text-slate-300" />
                      </div>
                      <p className="core-text-slate-500 core-font-medium">No matching projects found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="core-px-8 core-py-5 core-bg-white core-border-t core-border-slate-100 core-flex core-items-center core-justify-between">
          <p className="core-text-[12px] core-font-medium core-text-slate-400">
            Showing {processedDetails.length} of {details.length} entries
          </p>
          <button
            onClick={onClose}
            className="core-px-6 core-py-2.5 core-bg-slate-900 hover:core-bg-slate-800 core-text-white core-text-[12px] core-font-semibold core-rounded-xl core-transition-all active:core-scale-95 core-shadow-lg core-shadow-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Table View ───────────────────────────────────────────────────────────────
function TableView({ data, globalFilter }: { data: AppRow[]; globalFilter: string }) {
  const [sorting, setSorting] = useState<SortEntry[]>([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [selectedApp, setSelectedApp] = useState<{ name: string; count: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const ROW_HEIGHT = 45;
  const VISIBLE_COUNT = 20;

  const columns = useMemo<ColumnDef[]>(() => [
    { id: "sr", header: "Sr No", accessorKey: "sr", size: 54 },
    { id: "prn", header: "PRN", accessorKey: "prn", size: 54 },
    { id: "name", header: "Application Name", accessorKey: "name", size: 160 },
    { id: "desc", header: "Application Description", accessorKey: "desc", size: 220 },
    {
      id: "instances", header: "Instances", accessorKey: "instances", size: 80,
      footer: () => {
        const sum = data.reduce((s: number, r: AppRow) => s + r.instances, 0);
        return `Σ ${sum}`;
      }
    },
    { id: "uniqueUsers", header: "Unique Users", accessorKey: "uniqueUsers", size: 90 },
    { id: "totalPoints", header: "Total Usage Points", accessorKey: "totalPoints", size: 90 },
    ...MONTHS.map(m => ({
      id: m,
      header: m,
      columns: [
        { id: `${m}_c`, header: "Created", accessorKey: `months.${m}.created`, size: 68 },
        { id: `${m}_u`, header: "Updated", accessorKey: `months.${m}.updated`, size: 68 },
        { id: `${m}_v`, header: "Visited", accessorKey: `months.${m}.visited`, size: 68 },
      ]
    }))
  ], [data]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
  });

  const rows = table.getRowModel().rows;

  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 5);
  const endIndex = Math.min(rows.length, startIndex + VISIBLE_COUNT + 10);

  const instancesTotal = useMemo(() => data.reduce((s: number, r: AppRow) => s + r.instances, 0), [data]);

  // Give the table headers a medium, professional shade
  const HEADER_BG = "linear-gradient(to bottom, #64748b, #475569)";
  const HEADER_TEXT = "#ffffff";
  const SUB_BG = "#475569";
  const SUB_TEXT = "#f1f5f9";

  return (
    <div className="core-h-full core-min-h-0 core-p-4 md:core-p-6">
      <div className="core-h-full core-min-h-0 core-rounded-2xl core-border core-border-slate-200 core-shadow-[0_2px_12px_rgba(0,0,0,0.04)] core-overflow-hidden core-flex core-flex-col core-bg-white">
        <div
          className="core-flex-1 core-min-h-0 core-overflow-auto core-custom-scrollbar"
          onScroll={(e) => {
            const target = e.currentTarget;
            requestAnimationFrame(() => {
              if (containerRef.current) {
                setScrollTop(target.scrollTop);
              }
            });
          }}
          ref={containerRef}
        >
          <table className="app-summary-table core-w-full" style={{ minWidth: 1200, fontSize: "12px", borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              {/* Top-level header: base cols + month groups */}
              <tr>
                {/* Sr No, PRN, App Name, App Desc, Instances, UniqueUsers, TotalPoints */}
                {["Sr No", "PRN", "Application Name", "Application Description", "Instances", "Unique Users", "Total Usage Points"].map((h, i) => {
                  const ids = ["sr", "prn", "name", "desc", "instances", "uniqueUsers", "totalPoints"];
                  const id = ids[i];
                  const widths = [60, 60, 220, 280, 90, 110, 130];
                  const lefts = [0, widths[0], widths[0] + widths[1]];
                  const isSticky = i < 3;
                  const isLastSticky = i === 2;
                  const left = isSticky ? lefts[i] : undefined;

                  return (
                    <th key={h} rowSpan={2}
                      className={`core-px-4 core-py-2 core-text-left core-font-semibold core-whitespace-nowrap core-cursor-pointer core-select-none core-transition-colors hover:core-bg-slate-600/50 ${isSticky ? `app-summary-sticky-header ${isLastSticky ? 'app-summary-sticky-header-last' : ''}` : 'app-summary-scroll-header'}`}
                      style={{
                        background: HEADER_BG,
                        color: HEADER_TEXT,
                        position: isSticky ? "sticky" : "relative",
                        top: 0,
                        left: left,
                        zIndex: isSticky ? 20 : 10,
                        height: 44,
                        width: widths[i],
                        minWidth: widths[i],
                        maxWidth: widths[i],
                        backgroundClip: 'padding-box',
                      }}
                      onClick={() => {
                        const s = sorting.find(s => s.id === id);
                        if (!s) setSorting([{ id, desc: false }]);
                        else if (!s.desc) setSorting([{ id, desc: true }]);
                        else setSorting([]);
                      }}
                    >
                      <div className="core-flex core-items-center core-justify-between core-gap-2">
                        <span>{h}</span>
                        <span className="core-text-slate-400">{(() => {
                          const s = sorting.find(s => s.id === id);
                          return s ? (s.desc ? "↓" : "↑") : "";
                        })()}</span>
                      </div>
                    </th>
                  );
                })}
                {MONTHS.map(m => (
                  <th key={m} colSpan={3} className="app-summary-scroll-header core-px-4 core-py-2 core-text-center core-font-bold core-whitespace-nowrap"
                    style={{ background: HEADER_BG, color: HEADER_TEXT, position: "sticky", top: 0, zIndex: 10, height: 44, width: 240, minWidth: 240, backgroundClip: 'padding-box', boxShadow: 'inset -1px -1px 0 0 #94a3b8' }}>
                    {m}
                  </th>
                ))}
              </tr>
              <tr>
                {MONTHS.flatMap(m => (
                  ["Created", "Updated", "Visited"].map((sub) => (
                    <th key={`${m}_${sub}`}
                      className="app-summary-scroll-subheader core-px-3 core-py-2 core-text-[12px] core-font-medium core-whitespace-nowrap core-cursor-pointer hover:core-bg-slate-600/50"
                      style={{ background: SUB_BG, color: SUB_TEXT, top: 44, position: "sticky", zIndex: 9, height: 36, width: 80, minWidth: 80, maxWidth: 80, backgroundClip: 'padding-box', boxShadow: 'inset -1px -1px 0 0 #94a3b8' }}
                      onClick={() => {
                        const id = `${m}_${sub[0].toLowerCase()}`;
                        const s = sorting.find(s => s.id === id);
                        if (!s) setSorting([{ id, desc: false }]);
                        else if (!s.desc) setSorting([{ id, desc: true }]);
                        else setSorting([]);
                      }}
                    >
                      <div className="core-flex core-items-center core-justify-between core-gap-1">
                        <span>{sub}</span>
                        <span className="core-text-slate-400">{(() => { const id = `${m}_${sub[0].toLowerCase()}`; const s = sorting.find(s => s.id === id); return s ? (s.desc ? "↓" : "↑") : ""; })()}</span>
                      </div>
                    </th>
                  ))
                ))}
              </tr>
            </thead>
            <tbody onClick={(e) => {
              const target = e.target as HTMLElement;
              const trigger = target.closest("[data-instance-trigger]");
              if (trigger) {
                const name = trigger.getAttribute("data-app-name") || "";
                const count = parseInt(trigger.getAttribute("data-instance-count") || "0", 10);
                setSelectedApp({ name, count });
              }
            }}>
              {/* Virtual Top Spacer */}
              {startIndex > 0 && <tr style={{ height: startIndex * ROW_HEIGHT }} aria-hidden="true" />}

              {rows.slice(startIndex, endIndex).map((row, relativeIdx) => {
                const idx = startIndex + relativeIdx;
                const d = row.original as AppRow;
                return (
                  <tr key={row.id} className={`core-table-row-hover ${idx % 2 === 0 ? "core-bg-white" : "core-bg-blue-50"}`} style={{ height: ROW_HEIGHT }}>
                    <td className={`app-summary-sticky-cell core-border-b core-border-r core-border-slate-200 core-px-4 core-py-3 core-text-slate-500 ${idx % 2 === 0 ? "core-bg-white" : "core-bg-blue-50"} group-hover:core-bg-slate-50`} style={{ left: 0, width: 60, minWidth: 60, maxWidth: 60 }}>{d.sr}</td>
                    <td className={`app-summary-sticky-cell core-border-b core-border-r core-border-slate-200 core-px-4 core-py-3 core-text-slate-500 ${idx % 2 === 0 ? "core-bg-white" : "core-bg-blue-50"} group-hover:core-bg-slate-50`} style={{ left: 60, width: 60, minWidth: 60, maxWidth: 60 }}>{d.prn}</td>
                    <td className={`app-summary-sticky-cell app-summary-sticky-cell-last core-border-b core-border-r core-border-slate-200 core-px-4 core-py-3 core-font-medium core-text-slate-800 core-whitespace-nowrap ${idx % 2 === 0 ? "core-bg-white" : "core-bg-blue-50"} group-hover:core-bg-slate-50`} style={{ left: 120, width: 220, minWidth: 220, maxWidth: 220 }}>{d.name}</td>
                    <td className="core-border-b core-border-r core-border-slate-200 core-px-4 core-py-3 core-text-slate-500" style={{ width: 280, minWidth: 280, maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={d.desc}>{d.desc}</td>
                    <td className="core-border-b core-border-r core-border-slate-200 core-px-4 core-py-3 core-text-center" style={{ width: 90, minWidth: 90, maxWidth: 90 }}>
                      <button
                        data-instance-trigger="true"
                        data-app-name={d.name}
                        data-instance-count={d.instances}
                        className="core-bg-transparent core-text-blue-600 hover:core-text-blue-800 hover:core-underline core-font-medium core-transition-colors"
                      >
                        {d.instances}
                      </button>
                    </td>
                    <td className="core-border-b core-border-r core-border-slate-200 core-px-4 core-py-3 core-text-right core-text-slate-600" style={{ width: 110, minWidth: 110, maxWidth: 110 }}>{d.uniqueUsers.toLocaleString()}</td>
                    <td className="core-border-b core-border-r core-border-slate-200 core-px-4 core-py-3 core-text-right" style={{ width: 130, minWidth: 130, maxWidth: 130 }}>{d.totalPoints.toLocaleString()}</td>
                    {MONTHS.flatMap(m => [
                      <td key={`${m}_c`} className="core-border-b core-border-r core-border-slate-200 core-px-3 core-py-3 core-text-right core-text-slate-500" style={{ width: 80, minWidth: 80, maxWidth: 80 }}>{d.months[m]?.created ?? 0}</td>,
                      <td key={`${m}_u`} className="core-border-b core-border-r core-border-slate-200 core-px-3 core-py-3 core-text-right core-text-slate-500" style={{ width: 80, minWidth: 80, maxWidth: 80 }}>{d.months[m]?.updated ?? 0}</td>,
                      <td key={`${m}_v`} className="core-border-b core-border-r core-border-slate-200 core-px-3 core-py-3 core-text-right core-text-slate-500" style={{ width: 80, minWidth: 80, maxWidth: 80 }}>{d.months[m]?.visited ?? 0}</td>
                    ])}
                  </tr>
                );
              })}

              {/* Virtual Bottom Spacer */}
              {endIndex < rows.length && <tr style={{ height: (rows.length - endIndex) * ROW_HEIGHT }} aria-hidden="true" />}
            </tbody>
            <tfoot>
              <tr style={{ position: "sticky", bottom: 0, zIndex: 30, background: "linear-gradient(to right, #64748b, #475569)" }} className="core-shadow-[0_-4px_10px_rgba(0,0,0,0.15)]">
                <td colSpan={3} className="core-border-t core-border-r core-border-slate-500/50 core-px-4 core-py-3 core-font-semibold core-text-white core-sticky core-z-[31]" style={{ left: 0, background: "linear-gradient(to right, #64748b, #475569)", boxShadow: '4px 0 8px -2px rgba(0,0,0,0.3)' }}>Total</td>
                <td className="core-border-t core-border-r core-border-slate-500/50 core-px-4 core-py-3 core-font-semibold core-text-white"></td>
                <td className="core-border-t core-border-r core-border-slate-500/50 core-px-4 core-py-3 core-text-center core-font-semibold core-text-blue-200">Σ {instancesTotal}</td>
                <td className="core-border-t core-border-r core-border-slate-500/50 core-px-4 core-py-3 core-text-right core-font-semibold core-text-white">{data.reduce((s: number, r: AppRow) => s + r.uniqueUsers, 0).toLocaleString()}</td>
                <td className="core-border-t core-border-r core-border-slate-500/50 core-px-4 core-py-3 core-text-right core-font-bold core-text-white">{data.reduce((s: number, r: AppRow) => s + r.totalPoints, 0).toLocaleString()}</td>
                {MONTHS.flatMap((m, mIdx) => [
                  <td key={`${m}_c`} className={`core-border-t core-border-slate-500/50 core-px-3 core-py-3 core-text-right core-font-medium core-text-slate-100 core-border-r`}>{data.reduce((s: number, r: AppRow) => s + (r.months[m]?.created ?? 0), 0)}</td>,
                  <td key={`${m}_u`} className={`core-border-t core-border-slate-500/50 core-px-3 core-py-3 core-text-right core-font-medium core-text-slate-100 core-border-r`}>{data.reduce((s: number, r: AppRow) => s + (r.months[m]?.updated ?? 0), 0)}</td>,
                  <td key={`${m}_v`} className={`core-border-t core-border-slate-500/50 core-px-3 core-py-3 core-text-right core-font-medium core-text-slate-100 ${mIdx < MONTHS.length - 1 ? 'core-border-r' : ''}`}>{data.reduce((s: number, r: AppRow) => s + (r.months[m]?.visited ?? 0), 0)}</td>
                ])}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <InstanceDetailModal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        appName={selectedApp?.name || ""}
        instanceCount={selectedApp?.count || 0}
      />
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function EnterpriseDashboard({ onClose }: AdminToolComponentProps) {
  const [view, setView] = useState("table");
  const [globalFilter, setGlobalFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const deferredFilter = useDeferredValue(globalFilter);

  const filteredData = useMemo(() => {
    if (!deferredFilter) return RAW_DATA;
    const q = deferredFilter.toLowerCase();
    return RAW_DATA.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.desc.toLowerCase().includes(q) ||
      String(r.prn).includes(q)
    );
  }, [deferredFilter]);

  const totalInstances = useMemo(() => filteredData.reduce((s: number, r: AppRow) => s + r.instances, 0), [filteredData]);

  if (isLoading) {
    return <AppSummarySkeleton />;
  }

  return (
    <div id="app-summary" className="core-dashboard-wrapper core-h-screen core-overflow-hidden core-flex core-flex-col" style={{ fontSize: "12px", background: "#f8fafc" }}>
      {/* Top bar */}
      <div className="appsum-header">
        <div className="core-flex core-flex-wrap core-items-center core-gap-4 core-px-5 core-py-1.5 sm:core-px-6 md:core-px-8">
          {/* Title */}
          <div className="core-flex core-items-center core-gap-3 core-mr-2">
            <div className="core-flex core-items-center core-justify-center core-bg-blue-600 core-rounded-lg core-shadow-sm" style={{ width: 28, height: 28 }}>
              <IconDashboard className="core-w-4 core-h-4 core-text-white" stroke={1.5} />
            </div>
            <div>
              <p className="core-text-[14px] core-font-bold core-tracking-tight core-text-slate-900" style={{ lineHeight: 1.1 }}>Application Summary</p>
              <p className="core-text-[10px] core-font-medium core-text-slate-500 core-mt-0.5 core-uppercase core-tracking-widest">pFirst Dashboard</p>
            </div>
          </div>

          {/* View Toggle */}
          <div className="active-toggle">
            {[{ id: "table", label: "Table View", icon: IconTable }, { id: "analytics", label: "Analytics", icon: IconChartBar }].map(v => (
              <button key={v.id} onClick={() => setView(v.id)}
                className={`core-flex core-bg-transparent core-items-center core-gap-2 core-px-3.5 core-py-1.5 core-text-[12px] core-font-semibold core-rounded-xl core-transition-all core-duration-200 ${view === v.id ? 'active-button' : 'core-text-slate-500 hover:core-text-slate-800 hover:core-bg-slate-200/50'}`}
              >
                <v.icon className={`core-w-4 core-h-4 ${view === v.id ? 'core-text-blue-600' : 'core-text-slate-400'}`} />
                {v.label}
              </button>
            ))}
          </div>

          {/* Spacer */}
          <div className="core-flex-1" />

          <div className="core-flex core-items-center core-gap-6 core-hidden sm:core-flex">
            <div className="core-flex core-items-center core-gap-2.5">
              <div className="core-flex core-items-center core-justify-center core-w-7 core-h-7 core-bg-blue-50 core-text-blue-600 core-rounded-lg core-border core-border-blue-100/50">
                <IconApps className="core-w-5 core-h-5" stroke={1.5} />
              </div>
              <div className="core-flex core-flex-col">
                <span className="core-text-[10px] core-font-bold core-text-slate-400 core-uppercase core-tracking-widest" style={{ lineHeight: 1 }}>Applications</span>
                <span className="core-text-[12px] core-font-bold core-text-slate-800 core-mt-0.5">{filteredData.length}</span>
              </div>
            </div>

            <div className="core-w-px core-h-6 core-bg-slate-200/80"></div>

            <div className="core-flex core-items-center core-gap-2.5">
              <div className="core-flex core-items-center core-justify-center core-w-7 core-h-7 core-bg-indigo-50 core-text-indigo-600 core-rounded-lg core-border core-border-indigo-100/50">
                <IconServer className="core-w-5 core-h-5" stroke={1.5} />
              </div>
              <div className="core-flex core-flex-col">
                <span className="core-text-[10px] core-font-bold core-text-slate-400 core-uppercase core-tracking-widest" style={{ lineHeight: 1 }}>Instances</span>
                <span className="core-text-[12px] core-font-bold core-text-slate-800 core-mt-0.5">{totalInstances}</span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="core-relative core-ml-2">
            <IconSearch className="core-absolute core-left-3 core-top-1/2 core--translate-y-1/2 core-w-4 core-h-4 core-text-slate-400" stroke={2} />
            <input
              value={globalFilter}
              id="pm-search"
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search application…"
              className="core-pl-9 core-pr-4 core-py-2 core-text-[12px] core-font-medium core-w-full sm:core-w-64 core-rounded-[14px] core-border core-border-slate-200 core-bg-slate-50 core-text-slate-800 placeholder:core-text-slate-400 focus:core-outline-none focus:core-ring-2 focus:core-ring-blue-500/20 focus:core-border-blue-500 core-transition-all core-shadow-sm"
            />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="core-flex core-items-center core-gap-2 core-px-3.5 sm:core-px-4 core-py-2 core-rounded-xl core-bg-rose-500/10 core-text-rose-600 core-font-bold core-text-sm core-transition-all hover:core-bg-rose-500 hover:core-text-white core-group"
          >
            <IconMinimize size={18} className="core-group-hover:core-text-white" />
            <span className="core-group-hover:core-text-white">Minimize</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="core-flex-1 core-min-h-0">
        {view === "table" ? (
          <TableView data={filteredData} globalFilter={globalFilter} />
        ) : (
          <div className="core-h-full core-min-h-0 core-overflow-hidden">
            <AnalyticsView data={filteredData} />
          </div>
        )}
      </div>
    </div>
  );
}
