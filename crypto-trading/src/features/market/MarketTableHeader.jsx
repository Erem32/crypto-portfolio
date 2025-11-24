function MarketTableHeader() {
  return (
    <thead>
      <tr>
        <th scope="col" className="px-4 py-2">
          Asset
        </th>
        <th scope="col" className="px-4 py-2">
          Price (USD)
        </th>
        <th scope="col" className="px-4 py-2">
          24h %
        </th>
        <th scope="col" className="px-4 py-2">
          Sparkline
        </th>
        <th scope="col" className="px-4 py-2">
          Actions
        </th>
      </tr>
    </thead>
  );
}

export default MarketTableHeader;
