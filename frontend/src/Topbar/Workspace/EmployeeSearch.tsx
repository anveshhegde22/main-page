import { useEffect } from "react";
import { IconMessage, IconSearch } from "@tabler/icons-react";
import { useEmployeeData } from "../../shared/api/useWorkspaceData";

export default function EmployeeSearch() {
  const { employees, loading, fetchEmployees } = useEmployeeData({ skipInitialFetch: true });

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return (
    <div className="core-animate-in core-fade-in core-slide-in-from-bottom-4 core-duration-500 core-space-y-4">
      <div className="core-flex core-items-center core-justify-between core-gap-4 core-flex-wrap">
        <div>
          <h2 className="core-text-xl core-font-black core-text-textPrimary-light dark:core-text-textPrimary-dark">Employee Directory</h2>
          <p className="core-text-sm core-text-textMuted-light dark:core-text-textMuted-dark core-mt-1">Search for colleagues across departments</p>
        </div>
        <div className="core-flex core-items-center core-gap-2.5 core-rounded-full core-border core-px-4 core-py-2.5 core-bg-card-light dark:core-bg-card-dark core-border-indigo-500/15 dark:core-border-indigo-500/22 core-w-full sm:core-w-80 core-shadow-sm">
          <IconSearch size={16} className="core-text-textMuted-light dark:core-text-textMuted-dark" />
          <input id="pm-search" className="core-bg-transparent core-text-sm core-outline-none core-flex-1 core-text-textPrimary-light dark:core-text-textPrimary-dark" placeholder="Name, role, or department..." />
        </div>
      </div>
      <div className="core-rounded-2xl core-overflow-hidden core-shadow-lg core-bg-card-light dark:core-bg-card-dark core-border core-border-borderBase-light dark:core-border-borderBase-dark core-overflow-x-auto">
        <table className="core-w-full core-text-left core-border-collapse core-whitespace-nowrap">
          <thead className="core-bg-slate-100/80 dark:core-bg-slate-800/40">
            <tr className="core-border-b core-border-borderBase-light dark:core-border-borderBase-dark">
              {["Employee", "Role", "Department", "Contact"].map((header, index) => (
                <th key={header} className={`core-px-5 core-py-3 core-text-[11px] core-font-bold core-uppercase core-tracking-wider core-text-textMuted-light dark:core-text-textMuted-dark ${index === 3 ? "core-text-right" : ""}`}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="core-divide-y core-divide-borderBase-light dark:core-divide-borderBase-dark">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={4} className="core-px-5 core-py-3.5">
                    <div className="core-h-8 core-rounded-lg core-bg-slate-100 dark:core-bg-white/5 core-animate-pulse" />
                  </td>
                </tr>
              ))
            ) : (
              employees.map((employee, index) => (
                <tr key={index} className="hover:core-bg-black/[0.02] dark:hover:core-bg-white/[0.02] core-transition-colors">
                  <td className="core-px-5 core-py-3.5">
                    <div className="core-flex core-items-center core-gap-3">
                      <div className={`core-w-8 core-h-8 core-rounded-full core-bg-gradient-to-br ${employee.color} core-flex core-items-center core-justify-center core-text-white core-text-[10px] core-font-bold`}>{employee.initials}</div>
                      <span className="core-text-[12px] core-font-semibold core-text-textPrimary-light dark:core-text-textPrimary-dark">{employee.name}</span>
                    </div>
                  </td>
                  <td className="core-px-5 core-py-3.5 core-text-[12px] core-text-textMuted-light dark:core-text-textMuted-dark">{employee.role}</td>
                  <td className="core-px-5 core-py-3.5">
                    <span className="core-px-2.5 core-py-1 core-rounded-lg core-bg-slate-100 dark:core-bg-white/5 core-text-[11px] core-font-medium core-text-textPrimary-light dark:core-text-textPrimary-dark">{employee.dept}</span>
                  </td>
                  <td className="core-px-5 core-py-3.5 core-text-right">
                    <button className="core-w-7 core-h-7 core-inline-flex core-items-center core-justify-center core-rounded-lg hover:core-bg-indigo-500/10 core-text-indigo-600 dark:core-text-indigo-400 core-transition-colors">
                      <IconMessage size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
