import { useEffect, useState } from "react";
import { LOADING_SCREEN_DELAY_MS } from "../constants";

export function useLoadingState() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, LOADING_SCREEN_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  return { isLoading };
}
