import { useEffect, useState, useCallback } from "react";
import type { AppItem } from "../types";

interface FetchAppsParams {
  limit?: boolean;
  details?: boolean;
  dark_mode?: boolean;
  skipInitialFetch?: boolean;
}

export const useMyApps = (
  {
    limit: initialLimit = true,
    details: initialDetails = false,
    dark_mode: initialDarkMode = true,
    skipInitialFetch = false,
  }: FetchAppsParams = {}
) => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const [limit, setLimit] = useState(initialLimit);
  const [details, setDetails] = useState(initialDetails);
  const [dark_mode, setDarkModeParam] = useState(initialDarkMode);
  const [hasFetched, setHasFetched] = useState(!skipInitialFetch);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const fetchApps = useCallback((params: FetchAppsParams = {}) => {
    setHasFetched(true);
    if (params.limit !== undefined) setLimit(params.limit);
    if (params.details !== undefined) setDetails(params.details);
    if (params.dark_mode !== undefined) setDarkModeParam(params.dark_mode);
    setFetchTrigger((t) => t + 1);
  }, []);

  const updateDarkMode = useCallback(async (newDarkMode: boolean) => {
    setDarkMode(newDarkMode);
    setDarkModeParam(newDarkMode);

    try {
      const response = await fetch(
        "http://localhost:3001/mainpage/manage-dark-mode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dark_mode: newDarkMode,
          }),
        }
      );

      const data = await response.json();
      if (data?.statusCode === "10000") {
        return true;
      } else {
        console.error("Failed to update dark mode: ", data?.message);
        return false;
      }
    } catch (err) {
      console.error("Error updating dark mode: ", err);
      return false;
    }
  }, []);

  useEffect(() => {
    if (!hasFetched) return;

    let ignore = false;

    const performFetch = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:3001/mainpage/get-app-lists",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              limit,
              details,
              dark_mode,
            }),
          }
        );

        const responseData = await response.json();

        if (!ignore) {
          const payload = responseData?.data?.data;
          setApps(payload?.apps ?? []);
          if (payload?.dark_mode !== undefined) {
            setDarkMode(payload?.dark_mode);
          }
          if (payload?.admin !== undefined) {
            setIsAdmin(payload?.admin);
          }
        }
      } catch (err) {
        if (!ignore) {
          setError(err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    performFetch();

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, details, hasFetched, fetchTrigger]); // Intentionally omitting dark_mode so toggling theme doesn't re-fetch apps

  const setAppFavLocally = useCallback((app_id: number, isFavorite: boolean) => {
    setApps((prev) => prev.map((a) => (a.app_id === app_id ? { ...a, fav_app: isFavorite } : a)));
  }, []);

  const manageFavApp = useCallback(async (app_id: number, isFavorite: boolean) => {
    try {
      const response = await fetch("http://localhost:3001/mainpage/manage-fav-app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ app_id, isFavorite }),
      });
      const data = await response.json();
      if (data?.statusCode === "10000") {
        setAppFavLocally(app_id, isFavorite);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [setAppFavLocally]);

  return {
    apps,
    setApps,
    loading,
    error,
    darkMode,
    isAdmin,
    fetchApps,
    updateDarkMode,
    manageFavApp,
    setAppFavLocally,
  };
};

interface FetchFavAppsParams {
  limit?: boolean;
  skipInitialFetch?: boolean;
}

export const useFavApps = ({
  limit: initialLimit = true,
  skipInitialFetch = false,
}: FetchFavAppsParams = {}) => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [limit, setLimit] = useState(initialLimit);
  const [hasFetched, setHasFetched] = useState(!skipInitialFetch);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const fetchApps = useCallback((params: FetchFavAppsParams = {}) => {
    setHasFetched(true);
    if (params.limit !== undefined) setLimit(params.limit);
    setFetchTrigger((t) => t + 1);
  }, []);

  useEffect(() => {
    if (!hasFetched) return;
    let ignore = false;
    const performFetch = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3001/mainpage/get-fav-list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ limit }),
        });
        const responseData = await response.json();
        if (!ignore) {
          const payload = responseData?.data?.data;
          setApps((payload?.apps ?? []).map((a: AppItem) => ({ ...a, fav_app: true })));
        }
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    performFetch();
    return () => { ignore = true; };
  }, [limit, hasFetched, fetchTrigger]);

  const setAppFavLocally = useCallback((app_id: number, isFavorite: boolean) => {
    setApps((prev) => prev.map((a) => (a.app_id === app_id ? { ...a, fav_app: isFavorite } : a)));
  }, []);

  return {
    apps,
    loading,
    error,
    fetchApps,
    setAppFavLocally,
  };
};
