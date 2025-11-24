import { useEffect, useState } from "react";
import { usePortfolioWithPrices } from "../../../api/usePortfolioWithPrices";
import { getRecentTransactions } from "../../../api/apiTransactions";
import DataCell from "../../ui/DataCell";
import { formatUSD } from "../../lib/format";
function AccountPerformanceStats({ user }) {
  const { totalValue: portfolioValue = 0 } = usePortfolioWithPrices();
  const cash = user?.cash_usd ?? 0;
  const netWorth = cash + portfolioValue;

  const STARTING_CAPITAL = 10000;
  const profit = netWorth - STARTING_CAPITAL;
  const profitTone =
    profit > 0 ? "positive" : profit < 0 ? "negative" : "neutral";

  const [tradeStats, setTradeStats] = useState({
    totalVolume: 0,
    tradeCount: 0,
  });

  useEffect(() => {
    async function loadTradeStats() {
      try {
        const tx = await getRecentTransactions(100);
        const totalVolume = tx.reduce(
          (sum, t) => sum + (t.total_value_usd ?? 0),
          0
        );
        setTradeStats({
          totalVolume,
          tradeCount: tx.length,
        });
      } catch (err) {
        console.error("Failed to load trade stats", err);
      }
    }

    if (user) {
      loadTradeStats();
    }
  }, [user]);

  return (
    <section>
      <h2 className="text-sm font-semibold text-zinc-900 mb-2">
        Account performance
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <DataCell
          label="Starting capital"
          value={`${formatUSD(STARTING_CAPITAL)}`}
        />

        <DataCell label="Current net worth" value={`${formatUSD(netWorth)}`} />

        <DataCell
          label="Total profit"
          tone={profitTone}
          value={`${profit >= 0 ? "+" : "-"}${formatUSD(Math.abs(profit))}`}
        />

        <DataCell
          label="Total trade volume"
          value={`${formatUSD(tradeStats.totalVolume)}`}
        />

        <DataCell
          label="Total trades"
          value={tradeStats.tradeCount.toString()}
        />
      </div>
    </section>
  );
}

export default AccountPerformanceStats;
