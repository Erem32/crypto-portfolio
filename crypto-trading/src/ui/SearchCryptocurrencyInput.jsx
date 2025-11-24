function SearchCryptocurrencyInput({ value, onChangeValue }) {
  return (
    <input
      id="market-search"
      type="search"
      value={value}
      onChange={(e) => onChangeValue(e.target.value)}
      placeholder="Search BTC, ETH..."
      className="h-9 w-64 rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-zinc-900 outline-none focus:ring-2 focus:ring-indigo-500"
      autoComplete="off"
    />
  );
}

export default SearchCryptocurrencyInput;
