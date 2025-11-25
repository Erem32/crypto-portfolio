import { useState } from "react";
import HoldingsTable from "../features/portfolio/HoldingsTable";
import PortfolioHeader from "../features/portfolio/PortfolioHeader";
import SellModal from "../features/portfolio/SellModal";

import { usePortfolioWithPrices } from "../../api/usePortfolioWithPrices";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";

import { sellCoin } from "../../api/apiOrders";

function Portfolio() {
  const { user, refreshUser } = useAuth();
  const { hideSmallPositions, showPortfolioSummary } = useSettings();

  const [isSellOpen, setIsSellOpen] = useState(false);
  const [CurrentHolding, setCurrentHolding] = useState(null);

  const {
    holdings,
    loading,
    error,
    totalValue: holdingsValue,
    change24hPct,
  } = usePortfolioWithPrices();

  const cash = user?.cash_usd ?? 0;
  const netWorth = cash + holdingsValue;

  function handleSell(holding) {
    setCurrentHolding(holding);
    setIsSellOpen(true);
  }

  function handleClose() {
    setCurrentHolding(null);
    setIsSellOpen(false);
  }

  async function handleConfirm({ qty, symbol }) {
    try {
      await sellCoin({ symbol, quantity: qty });
      await refreshUser();
      window.location.reload();
    } catch (err) {
      console.error("Failed to sell:", err);
      alert(err.message || "Failed to sell");
    }
  }

  if (loading) {
    return <p>loading...</p>;
  }
  if (error) {
    throw new Error(error.message);
  }

  const visibleHoldings = hideSmallPositions
    ? holdings.filter((h) => (h.currentValue ?? 0) >= 10)
    : holdings;

  if (visibleHoldings.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-zinc-700">
          {holdings.length === 0
            ? "No cryptocurrency yet, buy some on the Market page."
            : "All of your positions are below $10 and are currently hidden. You can show them again in Settings."}
        </p>
      </div>
    );
  }

  let summaryText = "";
  if (showPortfolioSummary && holdingsValue > 0) {
    const largest = visibleHoldings.reduce((acc, h) => {
      if (!acc) return h;
      const cur = h.currentValue ?? 0;
      const best = acc.currentValue ?? 0;
      return cur > best ? h : acc;
    }, null);

    if (largest) {
      const share = ((largest.currentValue ?? 0) / holdingsValue) * 100;
      const symbol = largest.symbol ?? largest.coin_symbol ?? "N/A";

      summaryText = `Largest position: ${symbol.toUpperCase()} (~${share.toFixed(
        1
      )}% of portfolio value).`;
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm space-y-2">
      <PortfolioHeader
        totalValue={holdingsValue}
        change24hPct={change24hPct}
        cash={cash}
        netWorth={netWorth}
      />

      {showPortfolioSummary && summaryText && (
        <p className="text-xs text-zinc-500">{summaryText}</p>
      )}

      <HoldingsTable holdings={visibleHoldings} onSell={handleSell} />
      <SellModal
        open={isSellOpen}
        holding={CurrentHolding}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

export default Portfolio;
