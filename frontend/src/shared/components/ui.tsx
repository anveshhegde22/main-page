import { memo, useCallback } from "react";
import {
  IconArrowUpRight,
  IconPointFilled,
  IconSearch,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import { getAccessTypeStyle } from "../utils";
import type { AppItem } from "../types";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  showClear?: boolean;
  compact?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
}

export const SearchInput = memo(function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  autoFocus,
  showClear,
  compact,
  onBlur,
  onFocus,
}: SearchInputProps) {
  return (
    <div className={`core-flex core-items-center ${compact ? "core-gap-2 core-rounded-lg core-px-3 core-py-[2px]" : "core-gap-2.5 core-rounded-xl core-px-3.5 core-py-1"} core-border core-bg-inputBg-light dark:core-bg-inputBg-dark core-border-indigo-500/15 dark:core-border-indigo-500/22 ${className}`}>
      <IconSearch size={compact ? 12 : 13} className="core-text-textMuted-light dark:core-text-textMuted-dark core-flex-shrink-0" />
      <input
        id="pm-search"
        className={`core-bg-transparent core-outline-none core-flex-1 core-min-w-0 core-text-textPrimary-light dark:core-text-textPrimary-dark ${compact ? "core-text-[12px]" : "core-text-[12px]"}`}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoFocus={autoFocus}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      {showClear && value && (
        <button onClick={() => onChange("")} className="core-text-textMuted-light dark:core-text-textMuted-dark">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
});

interface AppRowProps {
  app: AppItem;
  isFav: boolean;
  onToggleFav: (app: AppItem) => void;
  compact?: boolean;
}

export const AppRow = memo(function AppRow({ app, isFav, onToggleFav, compact }: AppRowProps) {
  const handleFav = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onToggleFav(app);
  }, [app, onToggleFav]);

  const iconSize = compact ? 12 : 13;
  const rowPadding = compact ? "core-px-5 core-py-2" : "core-px-4 core-py-2.5 core-mx-2 core-rounded-xl";
  const iconBox = compact ? "core-w-9 core-h-9 core-rounded-xl" : "core-w-10 core-h-10 core-rounded-xl";

  return (
    <a href={`/pFirst/app${app.app_id}/1/`} target="_blank" rel="noopener noreferrer" className={`core-flex core-items-center core-gap-4 ${rowPadding} core-group core-cursor-pointer core-transition-all core-duration-200 hover:core-bg-navHover-light dark:hover:core-bg-navHover-dark core-no-underline`}>
      <div
        className={`${iconBox} core-flex core-items-center core-justify-center core-flex-shrink-0 core-border`}
        style={{ background: `${app.dot}20`, borderColor: `${app.dot}40` }}
      >
        <IconPointFilled size={iconSize} style={{ color: app.dot }} />
      </div>
      <div className="core-flex-1 core-min-w-0">
        <p className="core-text-[12px] core-font-semibold core-leading-tight core-text-textPrimary-light dark:core-text-textPrimary-dark">{app.name}</p>
        <p className="core-text-[11px] core-text-textMuted-light dark:core-text-textMuted-dark core-truncate" title={app.tag}>{app.tag}</p>
      </div>
      <div className="core-flex core-items-center core-gap-2">
        <button
          onClick={(event) => event.stopPropagation()}
          title="Open app"
          className="core-flex-shrink-0 core-w-7 core-h-7 core-flex core-items-center core-justify-center core-rounded-lg core-opacity-0 group-hover:core-opacity-100 core-transition-all core-duration-200 hover:core-bg-indigo-500/10"
        >
          <IconArrowUpRight size={compact ? 14 : 13} className="core-text-[#818cf8]" />
        </button>
        <div className={`core-w-[80px] core-flex core-items-center core-justify-center core-px-1 core-py-0.5 core-rounded-md core-text-[9px] core-font-bold core-uppercase core-tracking-wider core-border ${getAccessTypeStyle(app.accessType)}`}>
          {app.accessType}
        </div>
        <button
          onClick={handleFav}
          title={isFav ? "Remove from favourites" : "Add to favourites"}
          className={`core-flex-shrink-0 core-w-7 core-h-7 core-flex core-items-center core-justify-center core-rounded-lg core-transition-all core-duration-200 ${isFav ? "core-bg-yellow-500/12" : "hover:core-bg-black/5 dark:hover:core-bg-white/10"}`}
        >
          {isFav
            ? <IconStarFilled size={compact ? 15 : 14} className="core-text-yellow-500" />
            : <IconStar size={compact ? 15 : 14} className="core-opacity-30 group-hover:core-opacity-100 core-transition-all core-duration-200 core-text-textMuted-light dark:core-text-textMuted-dark" />
          }
        </button>
      </div>
    </a>
  );
});
