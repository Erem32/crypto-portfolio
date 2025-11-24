import { apiFetch } from "./apiClient";

export async function buyCoin({ symbol, quantity }) {
  const res = await apiFetch("/orders/buy", {
    method: "POST",
    body: JSON.stringify({ symbol, quantity }),
  });

  if (!res.ok) {
    let message = "Failed to buy coin";

    try {
      const data = await res.json();

      if (data?.detail) message = data.detail;
    } catch (err) {
      console.log(err);
    }

    throw new Error(message);
  }

  const data = await res.json();
  return data;
}

export async function sellCoin({ symbol, quantity }) {
  const res = await apiFetch("/orders/sell", {
    method: "POST",
    body: JSON.stringify({ symbol, quantity }),
  });

  if (!res.ok) {
    let message = "Failed to sell coin";

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
