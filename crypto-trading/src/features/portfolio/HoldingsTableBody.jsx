import HoldingsTableRow from "./HoldingsTableRow";

function HoldingsTableBody({ holdings, onSell }) {
  return (
    <tbody className="divide-y divide-zinc-100 text-zinc-800">
      {holdings.map((holding) => (
        <HoldingsTableRow
          holding={holding}
          onSell={onSell}
          key={holding.name}
        />
      ))}
    </tbody>
  );
}

export default HoldingsTableBody;
