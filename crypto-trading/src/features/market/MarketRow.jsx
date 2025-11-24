import { formatUSD } from "../../lib/format";
import Sparkline from "../../ui/Sparkline";

function MarketRow({ coin, onBuy }) {
  const pct = coin.change24hPct;
  const pctClass =
    pct > 0 ? "text-emerald-600" : pct < 0 ? "text-rose-600" : "text-zinc-600";

  return (
    <tr className="hover:bg-zinc-50 transition-colors">
      {/* Asset */}
      <td className="px-4 py-2">
        <div className="flex items-center    gap-3">
          {coin.logoUrl ? (
            <img
              src={coin.logoUrl}
              alt={coin.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div
              className="size-8 rounded-full bg-zinc-200"
              aria-hidden="true"
            />
          )}
          <div className="flex flex-col">
            <span className="font-medium">{coin.symbol}</span>
            <span className="text-xs text-zinc-500">{coin.name}</span>
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="px-4 py-2 text-center tabular-nums">
        {formatUSD(coin.priceUSD)}
      </td>

      {/* 24h % */}
      <td className={`px-4 py-2 text-center tabular-nums ${pctClass}`}>
        {pct > 0 ? "+" : ""}
        {pct.toFixed(2)}%
      </td>

      {/* Sparkline */}
      <td className="px-4 py-2  flex  justify-center">
        <Sparkline data={coin.sparkline} />
      </td>

      {/* Actions */}
      <td className="px-4 py-2 text-center">
        <button
          type="button"
          onClick={() => onBuy(coin)}
          className="h-8 rounded-md bg-indigo-600 px-3 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Buy
        </button>
      </td>
    </tr>
  );
}

export default MarketRow;
