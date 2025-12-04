import { formatChange24h, formatUSD } from "../../lib/format";
import Sparkline from "../../ui/Sparkline";
function HoldingsTableRow({ holding, onSell }) {
  const pct = holding.change24hPct;

  const pctClass =
    pct > 0 ? "text-emerald-600" : pct < 0 ? "text-rose-600" : "text-zinc-600";

  const { roundedChange } = formatChange24h(holding.change24hPct);
  const hasLogo = Boolean(holding.logo);

  return (
    <tr className="hover:bg-zinc-50 transition-colors">
      {/* Asset */}
      <td className="px-4 py-2">
        <div className="flex items-center gap-3">
          {hasLogo ? (
            <img
              src={holding.logo}
              alt={holding.symbol}
              className="size-8 rounded-full object-cover bg-zinc-100"
            />
          ) : (
            <div
              className="size-8 rounded-full bg-zinc-200"
              aria-hidden="true"
            />
          )}
          <div className="flex flex-col">
            <span className="font-medium">{holding.symbol}</span>
            <span className="text-xs text-zinc-500">{holding.name}</span>
          </div>
        </div>
      </td>

      {/* Quantity */}
      <td className="text-center px-4 py-2 tabular-nums">{holding.quantity}</td>

      {/* Average Price */}
      <td className="text-center px-4 py-2 tabular-nums">
        {formatUSD(holding.price)}
      </td>

      {/* Value */}
      <td className="text-center px-4 py-2 tabular-nums">
        {formatUSD(holding.price * holding.quantity)}
      </td>

      {/* 24h change */}
      <td className={`text-center px-4 py-2 tabular-nums ${pctClass}`}>
        {pct > 0 ? "+" : ""} {roundedChange} %
      </td>

      {/* Sparkline */}
      <td className="px-4 py-2 flex justify-center">
        <Sparkline data={holding.sparkline} />
      </td>

      <td className="text-center px-4 py-2">
        <button
          className="h-8 rounded-md bg-indigo-600 px-3 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={() => onSell(holding)}
        >
          sell
        </button>
      </td>
    </tr>
  );
}

export default HoldingsTableRow;
