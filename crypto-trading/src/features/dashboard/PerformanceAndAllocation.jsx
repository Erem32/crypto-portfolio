import AllocationPanel from "./AllocationPanel";
import PerformancePanel from "./PerformancePanel";

function PerformanceAndAllocation({ holdings, cash_usd }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
      <div className="lg:col-span-8">
        <PerformancePanel />
      </div>
      <div className="lg:col-span-4 items-stretch ">
        <AllocationPanel holdings={holdings} cashUSD={cash_usd} />
      </div>
    </div>
  );
}

export default PerformanceAndAllocation;
