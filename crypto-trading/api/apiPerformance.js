import { apiFetch } from "./apiClient";
export async function postNetWorthSnapshot(netWorthUsd) {
  const res = await apiFetch("/portfolio/performance/snapshot", {
    method: "POST",
    body: JSON.stringify({ net_worth_usd: netWorthUsd }),
  });

  if (!res.ok) {
    console.error("Failed to store net worth snapshot");
  }
}

export async function getNetWorthSeries(days = 90) {
  const res = await apiFetch(`/portfolio/performance?days=${days}`);

  if (!res.ok) {
    throw new Error("Failed to load performance data");
  }

  return res.json();
}
