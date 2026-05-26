import { useEffect, useMemo, useRef, useState } from "react";
import type { AppItem, NavItem, WorkflowItem } from "../../shared/types";

export function useSearchState(navItems: NavItem[], apps: AppItem[], workflows: WorkflowItem[]) {
  const [search, setSearch] = useState("");
  const [mobileSearch, setMobileSearch] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [apiApps, setApiApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const searchOpenRef = useRef(searchOpen);

  // Sync ref after render so event handlers always see the latest value
  useEffect(() => {
    searchOpenRef.current = searchOpen;
  });

  // Stable keydown listener — registered once
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setSearch("");
        searchInputRef.current?.blur();
      }

      if (event.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        event.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click-outside listener — uses ref to avoid re-registering on every toggle
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchOpenRef.current &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        (!paletteRef.current || !paletteRef.current.contains(event.target as Node))
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [prevSearch, setPrevSearch] = useState(search);
  if (search !== prevSearch) {
    setPrevSearch(search);
    const trimmed = search.trim();
    if (!trimmed) {
      setApiApps([]);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }

  useEffect(() => {
    const trimmed = search.trim();
    if (!trimmed) {
      return;
    }

    let active = true;

    const handler = setTimeout(async () => {
      try {
        const response = await fetch("http://localhost:3001/mainpage/search-app", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ search: trimmed }),
        });
        const data = await response.json();
        if (active && data?.statusCode === "10000") {
          const searchedApps: AppItem[] = data.data.apps;

          // Enrich with local app data if available
          const enriched = searchedApps.map((sApp) => {
            const local = apps.find((a) => a.app_id === sApp.app_id);
            if (local) {
              return { ...local, ...sApp };
            }
            const colors = ["#6366f1", "#34d399", "#ec4899", "#f59e0b", "#3b82f6", "#8b5cf6", "#22c55e", "#f43f5e", "#06b6d4", "#14b8a6"];
            const dotColor = sApp.app_id ? colors[sApp.app_id % colors.length] : colors[0];
            return {
              ...sApp,
              dot: dotColor,
              accessType: "private",
              category: "Operations",
              sponsor_department: "Engineering",
              fav_app: false,
            };
          });

          setApiApps(enriched);
        }
      } catch (err) {
        console.error("Error searching apps:", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }, 200);

    return () => {
      active = false;
      clearTimeout(handler);
    };
  }, [search, apps]);

  const searchResults = useMemo(() => {
    if (!search.trim()) {
      return null;
    }

    const query = search.toLowerCase();
    const matchedNav = navItems.filter(
      (item) => item.label.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)
    );
    const matchedWorkflows = workflows.filter(
      (workflow) =>
        workflow.app.toLowerCase().includes(query) || workflow.workflow.toLowerCase().includes(query)
    );

    return {
      nav: matchedNav,
      apps: apiApps,
      workflows: matchedWorkflows,
    };
  }, [search, apiApps, navItems, workflows]);

  return {
    search,
    setSearch,
    mobileSearch,
    setMobileSearch,
    searchOpen,
    setSearchOpen,
    searchInputRef,
    searchContainerRef,
    paletteRef,
    searchResults,
    loading,
  };
}
