import { formatChange24h, formatUSD } from "../../lib/format";
import DataCell from "../../ui/DataCell";

function DasboardHeader({ className, change24hPct, totalValue, cash }) {
  const { changeWithSign, changeTone } = formatChange24h(change24hPct);
  return (
    <header
      className={`grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center ${className}`}
    >
      <DataCell
        label="Total Value"
        value={formatUSD(totalValue)}
        className="shadow-sm hover:shadow-md transition-shadow border-indigo-100/60 bg-gradient-to-b from-white to-indigo-50/20 ring-1 ring-inset ring-indigo-100/40"
      />
      <DataCell
        label="24h Change"
        value={changeWithSign}
        tone={changeTone}
        className="shadow-sm hover:shadow-md transition-shadow border-indigo-100/60 bg-gradient-to-b from-white to-indigo-50/20 ring-1 ring-inset ring-indigo-100/40"
      />
      <DataCell
        label="Total Cash"
        value={formatUSD(cash)}
        className="shadow-sm hover:shadow-md transition-shadow border-indigo-100/60 bg-gradient-to-b from-white to-indigo-50/20 ring-1 ring-inset ring-indigo-100/40"
      />
    </header>
  );
}

export default DasboardHeader;
