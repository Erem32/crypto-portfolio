import { useEffect, useState } from "react";
import { apiFetch } from "./apiClient";

export function usePortfolio() {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const res = await apiFetch("/portfolio");
        if (!res.ok) {
          throw new Error("Failed to fetch portfolio");
        }
        const data = await res.json();
        setHoldings(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, []);
  return { holdings, loading, error };
}
