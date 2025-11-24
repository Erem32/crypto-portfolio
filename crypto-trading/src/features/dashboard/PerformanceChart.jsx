import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function PerformanceChart({ points = [], heightClass = "h-56" }) {
  const data = Array.isArray(points)
    ? points
        .map((p, i) => ({
          i,
          t: typeof p.t === "number" ? p.t : new Date(p.t ?? p.date).getTime(),
          y: Number(p.y ?? p.net_worth_usd),
        }))
        .filter((d) => Number.isFinite(d.t) && Number.isFinite(d.y))
        .sort((a, b) => a.t - b.t)
    : [];

  if (data.length === 0) {
    return (
      <div className="h-40 w-full flex items-center justify-center rounded-xl bg-zinc-50 text-sm text-zinc-500">
        Buy something first
      </div>
    );
  }

  const fmtDate = (ms) =>
    new Date(ms).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  const fmtDateTime = (ms) => new Date(ms).toLocaleString();
  const fmtMoney = (v) => `$${Number(v).toFixed(2)}`;

  // --- one tick per calendar day ---
  const startOfDay = (ms) => {
    const d = new Date(ms);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const xTicks = Array.from(new Set(data.map((d) => startOfDay(d.t)))).sort(
    (a, b) => a - b
  );

  // --- add horizontal padding so line doesn't start at the border ---
  const firstT = data[0].t;
  const lastT = data[data.length - 1].t;
  const span = Math.max(lastT - firstT, 24 * 60 * 60 * 1000); // at least 1 day
  const pad = span * 0.05; // 5% padding on each side

  const xDomain = [firstT - pad, lastT + pad];

  return (
    <div
      id="perf-chart"
      role="region"
      aria-label="Performance chart"
      className={`${heightClass} w-full`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 16, bottom: 0, left: 56 }}
        >
          <CartesianGrid
            stroke="rgba(0,0,0,0.06)"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="t"
            type="number"
            domain={xDomain}
            ticks={xTicks}
            tickFormatter={fmtDate}
            minTickGap={28}
            tickMargin={8}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            orientation="left"
            domain={["dataMin", "dataMax"]}
            tickCount={5}
            tickFormatter={fmtMoney}
            tickMargin={8}
            width={72}
            axisLine={false}
            tickLine={false}
          />

          <Line
            type="monotone"
            dataKey="y"
            stroke="rgb(79,70,229)"
            strokeWidth={2}
            dot={data.length === 1}
            isAnimationActive={false}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <Tooltip
            isAnimationActive={false}
            cursor={{ stroke: "rgba(0,0,0,0.10)", strokeWidth: 1 }}
            labelFormatter={(v) => fmtDateTime(v)}
            formatter={(value) => [fmtMoney(value), "Net worth"]}
            contentStyle={{
              borderRadius: 8,
              borderColor: "rgba(0,0,0,0.08)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              fontSize: "12px",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PerformanceChart;
