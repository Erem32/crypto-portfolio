import HoldingsTableBody from "./HoldingsTableBody";
import HoldingsTableHeader from "./HoldingsTableHeader";

function HoldingsTable({ holdings, onSell }) {
  return (
    <table className="w-full text-sm">
      <HoldingsTableHeader />
      <HoldingsTableBody holdings={holdings} onSell={onSell} />
    </table>
  );
}

export default HoldingsTable;
