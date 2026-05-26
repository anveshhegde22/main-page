import { IconStarFilled } from "@tabler/icons-react";

import type { AppItem } from "../../shared/types";

interface FavoriteConfirmDialogProps {
  confirmFav: { app: AppItem; isAdding: boolean } | null;
  setConfirmFav: React.Dispatch<React.SetStateAction<{ app: AppItem; isAdding: boolean } | null>>;
  toggleFav: (app: AppItem) => void;
}

export default function FavoriteConfirmDialog({
  confirmFav,
  setConfirmFav,
  toggleFav,
}: FavoriteConfirmDialogProps) {
  if (!confirmFav) {
    return null;
  }

  return (
    <div className="core-fixed core-inset-0 core-z-[200] core-flex core-items-center core-justify-center core-px-4">
      <div className="core-absolute core-inset-0 core-bg-black/40 core-backdrop-blur-sm" onClick={() => setConfirmFav(null)} />
      <div className="core-relative core-bg-card-light dark:core-bg-card-dark core-rounded-3xl core-p-8 core-max-w-md core-w-full core-shadow-2xl core-border core-border-borderBase-light dark:core-border-borderBase-dark core-animate-in core-zoom-in-95">
        <div className="core-flex core-flex-col core-items-center core-text-center">
          <div className={`core-w-16 core-h-16 core-rounded-2xl core-flex core-items-center core-justify-center core-mb-6 ${confirmFav.isAdding ? "core-bg-yellow-500/10 core-text-yellow-500" : "core-bg-rose-500/10 core-text-rose-500"}`}>
            <IconStarFilled size={32} />
          </div>
          <h3 className="core-text-xl core-font-bold core-mb-2">
            {confirmFav.isAdding ? "Add to Favorites?" : "Remove from Favorites?"}
          </h3>
          <p className="core-text-sm core-text-textMuted-light dark:core-text-textMuted-dark core-mb-8">
            Are you sure you want to {confirmFav.isAdding ? "add" : "remove"} <span className="core-font-bold core-text-textPrimary-light dark:core-text-textPrimary-dark">"{confirmFav.app.name}"</span> {confirmFav.isAdding ? "to" : "from"} your favorite applications?
          </p>
          <div className="core-flex core-items-center core-gap-3 core-w-full">
            <button
              onClick={() => setConfirmFav(null)}
              className="core-flex-1 core-py-3 core-rounded-xl core-bg-slate-500/10 core-text-slate-600 dark:core-text-slate-400 core-font-bold core-text-sm hover:core-bg-slate-500/20 core-transition-all"
            >
              No, Cancel
            </button>
            <button
              onClick={() => toggleFav(confirmFav.app)}
              className={`core-flex-1 core-py-3 core-rounded-xl core-font-bold core-text-sm core-text-white core-transition-all core-shadow-lg ${confirmFav.isAdding ? "core-bg-yellow-500 core-shadow-yellow-500/20 hover:core-bg-yellow-600" : "core-bg-rose-500 core-shadow-rose-500/20 hover:core-bg-rose-600"}`}
            >
              Yes, Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
