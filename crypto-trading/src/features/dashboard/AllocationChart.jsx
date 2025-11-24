// components/dashboard/AllocationChart.jsx
import { slicesFromHoldings } from "./slicesFromHoldings";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const ALLOCATION_COLORS = [
  "#4f46e5", // indigo-600
  "#059669", // emerald-600
  "#f59e0b", // amber-500
  "#0ea5e9", // sky-500
  "#7c3aed", // violet-600
  "#ef4444", // red-500
];

function AllocationChart({ holdings = [], cashUSD = 0, heightClass = "h-56" }) {
  const slices = slicesFromHoldings(holdings, cashUSD, 5);

  const data = Array.isArray(slices)
    ? slices.map((s) => ({ name: s.label, value: Number(s.pct) }))
    : [];

  const empty = data.length === 0;

  return (
    <div
      role="region"
      aria-label="Allocation chart"
      className={`w-full ${heightClass}`}
    >
      {empty ? (
        <div className="h-full w-full rounded-xl bg-zinc-50" />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={1}
              isAnimationActive={false}
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={ALLOCATION_COLORS[i % ALLOCATION_COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default AllocationChart;
