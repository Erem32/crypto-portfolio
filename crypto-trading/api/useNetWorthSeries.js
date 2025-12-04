import { useEffect, useState } from "react";
import { getNetWorthSeries } from "./apiPerformance";
import { useAuth } from "../context/AuthContext";

export function useNetWorthSeries(days) {
  const { user, loading: authLoading } = useAuth();
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !user) return;

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
  }, [days, user?.id, authLoading, user]);

  return { points, loading, error };
}
