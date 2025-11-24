import { useEffect, useState } from "react";
import { getNetWorthSeries } from "./apiPerformance";

export function useNetWorthSeries(days) {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchSeries() {
      setLoading(true);
      setError(null);

      try {
        const data = await getNetWorthSeries(days);
        if (!cancelled) setPoints(data);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSeries();

    return () => {
      cancelled = true;
    };
  }, [days]);

  return { points, loading, error };
}
