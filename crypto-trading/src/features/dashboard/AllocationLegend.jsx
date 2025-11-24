const ALLOCATION_COLORS = [
  "#4f46e5", // indigo-600
  "#059669", // emerald-600
  "#f59e0b", // amber-500
  "#0ea5e9", // sky-500
  "#7c3aed", // violet-600
  "#ef4444", // red-500
];

export default function AllocationLegend({ slices = [] }) {
  return (
    <ul className="space-y-2">
      {slices.map((s, i) => (
        <li key={s.label} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="inline-block size-2.5 rounded-full"
              style={{
                backgroundColor:
                  ALLOCATION_COLORS[i % ALLOCATION_COLORS.length],
              }}
              aria-hidden
            />
            <span className="text-sm text-zinc-700">{s.label}</span>
          </div>
          <span className="text-sm tabular-nums text-zinc-600">
            {s.pct.toFixed(1)}%
          </span>
        </li>
      ))}
    </ul>
  );
}
