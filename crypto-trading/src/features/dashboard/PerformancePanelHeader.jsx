import SelectionButton from "./SelectionButton";

function PerformancePanelHeader({ className, handleChange, period }) {
  const PERIODS = ["7d", "30d", "90d"];
  return (
    <header className={`mb-3 flex items-center justify-between ${className}`}>
      <span className="text-sm font-medium text-zinc-800">Performance</span>
      <div role="tablist" className="inline-flex gap-1">
        {PERIODS.map((p) => {
          const selected = period === p;
          return (
            <SelectionButton
              key={p}
              role="tab"
              isSelected={selected}
              onClick={() => handleChange(p)}
            >
              {p}
            </SelectionButton>
          );
        })}
      </div>
    </header>
  );
}

export default PerformancePanelHeader;
