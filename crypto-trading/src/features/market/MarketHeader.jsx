import SearchCryptocurrencyInput from "../../ui/SearchCryptocurrencyInput";

function MarketHeader({ search, onSearchChange }) {
  return (
    <header className="mb-3 flex items-center justify-between">
      <h2 className="text-base font-semibold text-zinc-900">Market</h2>

      <div className="flex items-center gap-3">
        <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-sm text-zinc-700">
          USD
        </span>
        <label className="sr-only" htmlFor="market-search">
          Search
        </label>
        <SearchCryptocurrencyInput
          value={search}
          onChangeValue={onSearchChange}
        />
      </div>
    </header>
  );
}

export default MarketHeader;
