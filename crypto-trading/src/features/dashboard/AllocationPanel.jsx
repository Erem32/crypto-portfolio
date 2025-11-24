import AllocationChart from "./AllocationChart";
import AllocationLegend from "./AllocationLegend";
import { slicesFromHoldings } from "./slicesFromHoldings";

function AllocationPanel({ className = "", holdings = [], cashUSD = 0 }) {
  const hasData = Array.isArray(holdings) && holdings.length > 0;
  if (!hasData && cashUSD <= 0) {
    return (
      <section
        className={`rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm ${className}`}
      >
        <header className="mb-3 text-sm font-medium text-zinc-800">
          Allocation
        </header>
        <div className="h-56 w-full flex items-center justify-center rounded-xl bg-zinc-50 text-sm text-zinc-500">
          No holdings yet
        </div>
      </section>
    );
  }

  const slices = slicesFromHoldings(holdings, cashUSD);

  return (
    <section
      className={`rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm ${className} h-full`}
    >
      <header className="mb-3 text-sm font-medium text-zinc-800">
        Allocation
      </header>

      <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4">
        <div className="md:col-span-3">
          <AllocationChart
            holdings={holdings}
            cashUSD={cashUSD}
            heightClass="h-56"
          />
        </div>
        <div className="md:col-span-2 max-h-56 overflow-auto pr-1">
          <AllocationLegend slices={slices} />
        </div>
      </div>
    </section>
  );
}

export default AllocationPanel;
