import { useCallback, useEffect, useState } from "react";
import type { WorkflowItem, TopAppsData, PieEntry } from "../types";

const DEFAULT_TOP_APPS: TopAppsData = { daily: [], monthly: [], yearly: [] };

export function useWorkflowData({ skipInitialFetch = false }: { skipInitialFetch?: boolean } = {}) {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(!skipInitialFetch);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const fetchWorkflows = useCallback(() => {
    setHasFetched(true);
    setFetchTrigger((t) => t + 1);
  }, []);

  useEffect(() => {
    if (!hasFetched) return;
    let ignore = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3001/mainpage/get-workflow-list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
        });
        const json = await res.json();
        if (!ignore) setWorkflows(json?.data?.workflows ?? []);
      } catch {
        // silently ignore fetch errors – keeps stale/empty state
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    run();
    return () => { ignore = true; };
  }, [hasFetched, fetchTrigger]);

  return { workflows, loading, fetchWorkflows };
}

export function useChartData({ skipInitialFetch = false }: { skipInitialFetch?: boolean } = {}) {
  const [topAppsData, setTopAppsData] = useState<TopAppsData>(DEFAULT_TOP_APPS);
  const [pieData, setPieData] = useState<PieEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(!skipInitialFetch);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const fetchChartData = useCallback(() => {
    setHasFetched(true);
    setFetchTrigger((t) => t + 1);
  }, []);

  useEffect(() => {
    if (!hasFetched) return;
    let ignore = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3001/mainpage/get-chart-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
        });
        const json = await res.json();
        if (!ignore) {
          setTopAppsData(json?.data?.topApps ?? DEFAULT_TOP_APPS);
          setPieData(json?.data?.pieData ?? []);
        }
      } catch {
        // silently ignore fetch errors
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    run();
    return () => { ignore = true; };
  }, [hasFetched, fetchTrigger]);

  return { topAppsData, pieData, loading, fetchChartData };
}
