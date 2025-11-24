export function slicesFromHoldings(holdings, cashUSD) {
  const list = Array.isArray(holdings) ? holdings : [];
  const cash = Number(cashUSD) || 0;

  if (list.length === 0 && cash === 0) return [];

  const slices = list.map((holding) => ({
    label: holding.symbol || holding.name,
    value: holding.price * holding.quantity,
  }));

  if (cash > 0) {
    slices.push({ label: "Cash", value: cash });
  }

  const total = slices.reduce((sum, x) => sum + x.value, 0);

  const sorted = slices.sort((a, b) => b.value - a.value);
  const head = sorted.slice(0, 5);
  const tail = sorted.slice(5);
  const othersValue = tail.reduce((sum, x) => sum + x.value, 0);

  if (othersValue > 0) head.push({ label: "Others", value: othersValue });

  const finalSlices = head.map((x) => ({
    label: x.label,
    valueUSD: x.value,
    pct: (x.value / total) * 100,
  }));
  return finalSlices;
}
