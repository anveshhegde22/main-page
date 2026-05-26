import { useCallback, useEffect, useRef, useState } from "react";
import { throttle } from "../../shared/utils";
import type { ActiveSection } from "../../shared/types";

export function useChromeState() {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [workspaceExpanded, setWorkspaceExpanded] = useState(false);
  const [adminExpanded, setAdminExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>("dashboard");
  const [showBackToTop, setShowBackToTop] = useState(false);

  const mainScrollRef = useRef<HTMLDivElement>(null);
  const userPillRef = useRef<HTMLDivElement>(null);
  const userDropdownOpenRef = useRef(userDropdownOpen);

  // Sync ref after render so the mousedown handler always sees the latest value
  useEffect(() => {
    userDropdownOpenRef.current = userDropdownOpen;
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownOpenRef.current && !userPillRef.current?.contains(event.target as Node)) {
        setUserDropdownOpen(false);
        setWorkspaceExpanded(false);
        setAdminExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const throttledScrollRef = useRef(
    throttle((top: number) => {
      setShowBackToTop(top > 300);
    }, 100),
  );

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    throttledScrollRef.current(event.currentTarget.scrollTop);
  }, []);

  const scrollToTop = useCallback(() => {
    mainScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navigateTo = useCallback((section: ActiveSection) => {
    setActiveSection(section);
  }, []);

  return {
    userDropdownOpen,
    setUserDropdownOpen,
    workspaceExpanded,
    setWorkspaceExpanded,
    adminExpanded,
    setAdminExpanded,
    activeSection,
    setActiveSection,
    showBackToTop,
    mainScrollRef,
    userPillRef,
    handleScroll,
    scrollToTop,
    navigateTo,
  };
}
