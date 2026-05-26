import { useCallback, useEffect, useState } from "react";
import type { FaqItem, EmployeeItem } from "../types";

export function useFaqData({ skipInitialFetch = false }: { skipInitialFetch?: boolean } = {}) {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(!skipInitialFetch);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const fetchFaqs = useCallback(() => {
    setHasFetched(true);
    setFetchTrigger((t) => t + 1);
  }, []);

  useEffect(() => {
    if (!hasFetched) return;
    let ignore = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3001/mainpage/get-faq");
        const json = await res.json();
        if (!ignore) setFaqs(json?.data?.faqs ?? []);
      } catch {
        // silently ignore fetch errors
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    run();
    return () => { ignore = true; };
  }, [hasFetched, fetchTrigger]);

  return { faqs, loading, fetchFaqs };
}

export function useEmployeeData({ skipInitialFetch = false }: { skipInitialFetch?: boolean } = {}) {
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(!skipInitialFetch);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const fetchEmployees = useCallback(() => {
    setHasFetched(true);
    setFetchTrigger((t) => t + 1);
  }, []);

  useEffect(() => {
    if (!hasFetched) return;
    let ignore = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3001/mainpage/get-employees");
        const json = await res.json();
        if (!ignore) setEmployees(json?.data?.employees ?? []);
      } catch {
        // silently ignore fetch errors
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    run();
    return () => { ignore = true; };
  }, [hasFetched, fetchTrigger]);

  return { employees, loading, fetchEmployees };
}
