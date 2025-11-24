// src/ui/Sparkline.jsx
function Sparkline({ data }) {
  // Fallback if we have no data
  if (!data || data.length < 2) {
    return (
      <div
        aria-label="sparkline (no data)"
        className="h-8 w-24 rounded bg-zinc-100 flex items-center justify-center text-[10px] text-zinc-400"
      >
        —
      </div>
    );
  }

  const w = 100;
  const h = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const last = data[data.length - 1];
  const first = data[0];

  // Color based on trend
  const color = last > first ? "#16a34a" : last < first ? "#dc2626" : "#a1a1aa"; // green / red / gray

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * (w - 4) + 2; // small padding
    const y = h - ((value - min) / range) * (h - 4) - 2;
    return [x, y];
  });

  const pathD = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");

  return (
    <div className="h-8 w-24">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        {/* faint baseline */}
        <line
          x1="0"
          y1={h - 2}
          x2={w}
          y2={h - 2}
          stroke="#e4e4e7"
          strokeWidth="1"
        />
        {/* main line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default Sparkline;
