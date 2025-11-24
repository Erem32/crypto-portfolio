export const formatUSD = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

export const formatChange24h = (change24hPct) => {
  const roundedChange = Number.isFinite(change24hPct)
    ? change24hPct.toFixed(2)
    : "0.00";

  const changeWithSign =
    change24hPct > 0 ? `+${roundedChange}%` : `${roundedChange}%`;

  const changeTone = change24hPct >= 0 ? "positive" : "negative";

  return { roundedChange, changeWithSign, changeTone };
};
