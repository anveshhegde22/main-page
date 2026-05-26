import { IconArrowUpRight, IconCode } from "@tabler/icons-react";
import { DEV_LINKS } from "../../shared/data";

export default function DevCenter() {
  return (
    <div className="md:core-col-span-1 lg:core-col-span-2 core-rounded-2xl core-overflow-hidden core-shadow-lg core-bg-card-light dark:core-bg-card-dark core-border core-border-borderBase-light dark:core-border-borderBase-dark">
      <div className="core-flex core-items-center core-gap-2.5 core-px-5 core-py-2.5 core-border-b core-border-borderBase-light dark:core-border-borderBase-dark">
        <div className="core-w-8 core-h-8 core-rounded-xl core-bg-gradient-to-br core-from-sky-500 core-to-blue-600 core-flex core-items-center core-justify-center core-shadow-lg core-shadow-sky-500/25">
          <IconCode size={15} color="#fff" />
        </div>
        <div>
          <p className="core-text-sm core-font-bold core-leading-tight core-text-textPrimary-light dark:core-text-textPrimary-dark">Dev Center</p>
          <p className="core-text-[11px] core-text-textMuted-light dark:core-text-textMuted-dark">3 resources</p>
        </div>
      </div>
      <div className="core-p-3 core-space-y-1">
        {DEV_LINKS.map((item, index) => {
          const Icon = item.icon;
          return (
            <a key={index} href={item.url} target="_blank" rel="noopener noreferrer" className="core-flex core-items-center core-gap-3 core-px-3 core-py-2 core-rounded-xl core-group core-cursor-pointer core-transition-all core-duration-200 hover:core-bg-navHover-light dark:hover:core-bg-navHover-dark core-no-underline">
              <div
                className="core-w-10 core-h-10 core-rounded-xl core-flex core-items-center core-justify-center core-flex-shrink-0 core-border"
                style={{ background: `${item.color}18`, borderColor: `${item.color}25` }}
              >
                <Icon size={18} style={{ color: item.color }} />
              </div>
              <div className="core-flex-1 core-min-w-0">
                <p className="core-text-[12px] core-font-semibold core-leading-tight core-text-textPrimary-light dark:core-text-textPrimary-dark">{item.label}</p>
                <p className="core-text-[11px] core-text-textMuted-light dark:core-text-textMuted-dark">{item.desc}</p>
              </div>
              <IconArrowUpRight size={13} className="core-opacity-0 group-hover:core-opacity-50 core-transition-opacity core-flex-shrink-0 core-text-textMuted-light dark:core-text-textMuted-dark" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
