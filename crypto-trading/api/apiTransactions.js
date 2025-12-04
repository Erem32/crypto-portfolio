import { apiFetch } from "./apiClient";

export async function getRecentTransactions(limit = 10) {
  const res = await apiFetch(`/orders/history?limit=${limit}`);

  if (!res.ok) {
    let message = "Failed to load transactions";

    try {
      const data = await res.json();
      if (data?.detail) message = data.detail;
    } catch {
      //
    }

    throw new Error(message);
  }

  const data = await res.json();
  return data;
}
