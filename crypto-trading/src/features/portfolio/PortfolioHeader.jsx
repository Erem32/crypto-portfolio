import { useState } from "react";
import SearchCryptocurrencyInput from "../../ui/SearchCryptocurrencyInput";
import DataCell from "../../ui/DataCell";
import { formatUSD } from "../../lib/format";

function PortfolioHeader({ totalValue, change24hPct, cash }) {
  const [search, setSearch] = useState("");
  const totalValueHoldingsUSD = formatUSD(totalValue);

  const totalValueCashAndHoldings = cash + totalValue;
  const formattedCash = formatUSD(cash);

  const roundedChange = Number.isFinite(change24hPct)
    ? change24hPct.toFixed(2)
    : "0.00";

  const changeWithSign =
    change24hPct > 0 ? `+${roundedChange}%` : `${roundedChange}%`;

  const changeTone = change24hPct >= 0 ? "positive" : "negative";
  return (
    <header className="flex justify-between mb-8">
      <ul className="flex sm:gap-16 text-sm lg:text-2xl">
        <DataCell
          label="Total value"
          value={formatUSD(totalValueCashAndHoldings)}
        />
        <DataCell
          label="Total holdings value"
          value={`${totalValueHoldingsUSD}`}
        />
        <DataCell label="24h change" value={changeWithSign} tone={changeTone} />

        <DataCell label="Cash balance" value={formattedCash} />
      </ul>
      <form role="search" className="flex gap-4 items-center">
        <label htmlFor="search">Search for a cryptocurrency</label>
        <SearchCryptocurrencyInput value={search} onChangeValue={setSearch} />
      </form>
    </header>
  );
}

export default PortfolioHeader;
