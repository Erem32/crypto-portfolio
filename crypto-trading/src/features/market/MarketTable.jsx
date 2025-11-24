import MarketTableHeader from "./MarketTableHeader";
import MarketTableBody from "./MarketTableBody";
import EmptyState from "./EmptyState";
import SkeletonRows from "./SkeletonRows";

function MarketTable({ coins, loading, onBuy }) {
  if (loading) return <SkeletonRows rows={8} />;

  if (!coins || coins.length === 0)
    return <EmptyState text="No results. Try a different search." />;

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <MarketTableHeader />
        <MarketTableBody coins={coins} onBuy={onBuy} />
      </table>
    </div>
  );
}

export default MarketTable;
