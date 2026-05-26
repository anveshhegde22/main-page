import { useEffect } from "react";

export function useScrollLock(lock: boolean = true) {
  useEffect(() => {
    if (!lock) return;

    const mainEl = document.getElementById("main-scroll-container");
    const originalMainOverflow = mainEl?.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;

    if (mainEl) {
      mainEl.style.overflow = "hidden";
    }
    document.body.style.overflow = "hidden";

    return () => {
      if (mainEl) {
        mainEl.style.overflow = originalMainOverflow || "";
      }
      document.body.style.overflow = originalBodyOverflow || "";
    };
  }, [lock]);
}
