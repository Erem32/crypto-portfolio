// Dashboard.jsx
import { useEffect } from "react";
import { usePortfolioWithPrices } from "../../api/usePortfolioWithPrices";
import { useAuth } from "../../context/AuthContext";
import DasboardHeader from "../features/dashboard/DasboardHeader";
import PerformanceAndAllocation from "../features/dashboard/PerformanceAndAllocation";
import { postNetWorthSnapshot } from "../../api/apiPerformance";

function Dashboard() {
  const {
    holdings,
    totalValue,
    change24hPct,
    loading: portfolioLoading,
  } = usePortfolioWithPrices();
  const { user, loading: userLoading } = useAuth();

  const cash = user?.cash_usd ?? 0;
  const totalCashAndHoldingsValue = totalValue + cash;

  useEffect(() => {
    if (portfolioLoading || userLoading) return;
    if (!user) return;
    if (!Number.isFinite(totalCashAndHoldingsValue)) return;

    postNetWorthSnapshot(totalCashAndHoldingsValue).catch((err) => {
      console.error("Failed to post net worth snapshot", err);
    });
  }, [
    portfolioLoading,
    userLoading,
    user?.id,
    totalCashAndHoldingsValue,
    user,
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-4">
      <DasboardHeader
        totalValue={totalCashAndHoldingsValue}
        change24hPct={change24hPct}
        cash={cash}
      />
      <PerformanceAndAllocation holdings={holdings} cash_usd={cash} />
    </main>
  );
}

export default Dashboard;
