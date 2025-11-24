import { usePortfolio } from "./apiPortfolio";
import { useMarket } from "./useMarket";

export function usePortfolioWithPrices() {
  const {
    holdings,
    loading: holdingsLoading,
    error: holdingsError,
  } = usePortfolio();

  const { coins, isLoading: marketLoading, error: marketError } = useMarket();

  const loading = holdingsLoading || marketLoading;
  const error = holdingsError || marketError;

  if (loading) {
    return {
      loading: true,
      error: null,
      holdings: [],
      totalValue: 0,
      change24hPct: 0,
    };
  }

  if (error) {
    return {
      loading: false,
      error,
      holdings: [],
      totalValue: 0,
      change24hPct: 0,
    };
  }

  const coinBySymbol = new Map(
    coins.map((coin) => [coin.symbol.toUpperCase(), coin])
  );

  const enrichedHoldings = holdings.map((h) => {
    const coin = coinBySymbol.get(h.symbol.toUpperCase());

    const price = coin?.priceUSD ?? 0;
    const change24hPct = coin?.change24hPct ?? 0;

    const currentValue = h.quantity * price;

    const previousPrice =
      change24hPct !== -100 ? price / (1 + change24hPct / 100) : 0;
    const previousValue = h.quantity * previousPrice;

    return {
      ...h,
      price,
      currentValue,
      change24hPct,
      previousValue,
      sparkline: coin?.sparkline ?? null,
      logo: coin?.logoUrl ?? null,
    };
  });

  const totalValue = enrichedHoldings.reduce(
    (sum, h) => sum + h.currentValue,
    0
  );

  const totalPreviousValue = enrichedHoldings.reduce(
    (sum, h) => sum + h.previousValue,
    0
  );

  let change24hPct = 0;
  if (totalPreviousValue > 0) {
    const changeValue = totalValue - totalPreviousValue;
    change24hPct = (changeValue / totalPreviousValue) * 100;
  }

  return {
    loading: false,
    error: null,
    holdings: enrichedHoldings,
    totalValue,
    change24hPct,
  };
}
