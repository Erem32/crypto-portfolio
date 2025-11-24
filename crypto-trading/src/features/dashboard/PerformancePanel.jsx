// PerformancePanel.jsx
import { useState } from "react";
import PerformanceChart from "./PerformanceChart";
import PerformancePanelHeader from "./PerformancePanelHeader";
import { useNetWorthSeries } from "../../../api/useNetWorthSeries";

function PerformancePanel({ className }) {
  const [period, setPeriod] = useState("7d");
  const DAYS = { "7d": 7, "30d": 30, "90d": 90 };

  const { points, loading, error } = useNetWorthSeries(DAYS[period]);

  const chartPoints = Array.isArray(points)
    ? points
        .map((p) => {
          const t = new Date(p.date).getTime();
          const y = Number(p.net_worth_usd);
          if (!Number.isFinite(t) || !Number.isFinite(y)) return null;
          return { t, y };
        })
        .filter(Boolean)
        .sort((a, b) => a.t - b.t)
    : [];

  function onChangePeriod(p) {
    setPeriod(p);
  }

  return (
    <div
      className={`${className} rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm`}
    >
      <PerformancePanelHeader period={period} handleChange={onChangePeriod} />

      {loading ? (
        <div className="h-40 flex items-center justify-center text-sm text-zinc-500">
          Loading performance…
        </div>
      ) : error ? (
        <div className="h-40 flex items-center justify-center text-sm text-red-500">
          Failed to load performance
        </div>
      ) : (
        <PerformanceChart points={chartPoints} heightClass="h-56" />
      )}
    </div>
  );
}

export default PerformancePanel;
