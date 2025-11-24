import MarketRow from "./MarketRow";

function MarketTableBody({ coins, onBuy }) {
  return (
    <tbody className="divide-y divide-zinc-100 text-zinc-800">
      {coins.map((coin) => (
        <MarketRow key={coin.symbol} coin={coin} onBuy={onBuy} />
      ))}
    </tbody>
  );
}

export default MarketTableBody;
