import { useEffect, useState } from "react";
import { apiFetch } from "./apiClient";

export function useMarket() {
  const [coins, setCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMarket() {
      if (cancelled) return;
      try {
        const res = await apiFetch("/market/");
        if (!res.ok) throw new Error("Failed to fetch market");
        const data = await res.json();
        if (!cancelled) setCoins(data);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchMarket();
    const id = setInterval(fetchMarket, 30000);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return { coins, isLoading, error };
}
