const objectOfOptions = {
  neutral: "text-zinc-800",
  positive: "text-emerald-600",
  negative: "text-rose-600",
};

function DataCell({ label, value, tone = "neutral", className = "" }) {
  return (
    <dl
      className={`rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 ${className}`}
    >
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd
        className={`${objectOfOptions[tone]} text-xl sm:text-2xl font-semibold tabular-nums`}
      >
        {value}
      </dd>
    </dl>
  );
}

export default DataCell;
