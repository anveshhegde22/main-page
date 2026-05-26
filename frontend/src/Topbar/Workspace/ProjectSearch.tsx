import { IconBriefcase, IconSearch } from "@tabler/icons-react";

export default function ProjectSearch() {
  return (
    <div className="core-animate-in core-fade-in core-slide-in-from-bottom-4 core-duration-500 core-space-y-4">
      <div className="core-flex core-items-center core-justify-between core-gap-4 core-flex-wrap">
        <div>
          <h2 className="core-text-xl core-font-black core-text-textPrimary-light dark:core-text-textPrimary-dark">Project Search</h2>
          <p className="core-text-sm core-text-textMuted-light dark:core-text-textMuted-dark core-mt-1">Find and manage ongoing organizational projects</p>
        </div>
        <div className="core-flex core-items-center core-gap-2.5 core-rounded-full core-border core-px-4 core-py-2.5 core-bg-card-light dark:core-bg-card-dark core-border-indigo-500/15 dark:core-border-indigo-500/22 core-w-full sm:core-w-80 core-shadow-sm">
          <IconSearch size={16} className="core-text-textMuted-light dark:core-text-textMuted-dark" />
          <input id="pm-search" className="core-bg-transparent core-text-sm core-outline-none core-flex-1 core-text-textPrimary-light dark:core-text-textPrimary-dark" placeholder="Search by project name or ID..." />
        </div>
      </div>
      <div className="core-grid core-grid-cols-1 md:core-grid-cols-2 lg:core-grid-cols-3 core-gap-4">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="core-rounded-2xl core-p-5 core-shadow-lg core-bg-card-light dark:core-bg-card-dark core-border core-border-borderBase-light dark:core-border-borderBase-dark core-group hover:core-border-indigo-500/30 core-transition-all core-cursor-pointer">
            <div className="core-flex core-justify-between core-items-start core-mb-4">
              <div className="core-w-10 core-h-10 core-rounded-xl core-bg-gradient-to-br core-from-sky-500/20 core-to-blue-600/20 core-flex core-items-center core-justify-center core-border core-border-sky-500/30">
                <IconBriefcase size={18} className="core-text-sky-600 dark:core-text-sky-400" />
              </div>
              <span className="core-px-2.5 core-py-1 core-rounded-full core-text-[10px] core-font-bold core-uppercase core-bg-emerald-500/10 core-text-emerald-600 dark:core-text-emerald-400">Active</span>
            </div>
            <h3 className="core-text-[15px] core-font-bold core-text-textPrimary-light dark:core-text-textPrimary-dark">Project Alpha {index + 1}</h3>
            <p className="core-text-[12px] core-text-textMuted-light dark:core-text-textMuted-dark core-mt-1 core-mb-4 core-line-clamp-2">A strategic initiative to modernize internal communication platforms and streamline team workflows.</p>
            <div className="core-flex core-items-center core-justify-between core-pt-4 core-border-t core-border-borderBase-light dark:core-border-borderBase-dark">
              <div className="core-flex core--space-x-2">
                {["indigo", "purple", "rose"].map((color) => (
                  <div key={color} className={`core-w-6 core-h-6 core-rounded-full core-bg-${color}-500 core-border-2 core-border-card-light dark:core-border-card-dark`} />
                ))}
              </div>
              <span className="core-text-[11px] core-font-semibold core-text-[#818cf8]">View Details →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
