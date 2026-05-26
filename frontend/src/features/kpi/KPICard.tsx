import React, { memo } from "react";

interface KPICardProps {
  icon: React.ElementType;
  label: string;
  className: string;
  iconClassName: string;
  trend?: string;
  trendUp?: boolean;
  onClick?: () => void;
}

const KPICard = memo(function KPICard({
  icon: Icon,
  label,
  className,
  iconClassName,
  trend,
  trendUp,
  onClick,
}: KPICardProps) {
  return (
    <div
      onClick={onClick}
      className={`core-relative core-overflow-hidden core-rounded-2xl core-p-3 sm:core-p-4 core-flex core-flex-col core-gap-2 sm:core-gap-2.5 core-shadow-xl core-group core-cursor-pointer core-transition-all core-duration-300 hover:core--translate-y-1 hover:core-shadow-2xl ${onClick ? "active:core-scale-95" : ""} core-border core-border-white/10 ${className}`}
    >
      <div className="core-flex core-items-center core-justify-between">
        <div className={`core-w-8 core-h-8 sm:core-w-10 sm:core-h-10 core-rounded-xl core-flex core-items-center core-justify-center ${iconClassName}`}>
          <Icon size={16} color="#fff" stroke={1.8} className="sm:core-hidden" />
          <Icon size={20} color="#fff" stroke={1.8} className="core-hidden sm:core-block" />
        </div>
      </div>
      <div>
        <p className="core-text-[10px] sm:core-text-[12px] core-font-semibold core-uppercase core-tracking-widest core-mb-0.5 core-text-white/65">{label}</p>
        {trend && (
          <p className={`core-mt-1 core-text-[10px] sm:core-text-[11px] core-font-semibold ${trendUp ? "core-text-emerald-100" : "core-text-white/70"}`}>
            {trend}
          </p>
        )}
      </div>
      <div className="core-absolute core--right-5 core--top-5 core-w-24 core-h-24 core-rounded-full core-opacity-10 core-bg-white" />
      <div className="core-absolute core--right-2 core--bottom-8 core-w-16 core-h-16 core-rounded-full core-opacity-[0.06] core-bg-white" />
    </div>
  );
});

export default KPICard;
