import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MarketHeader from "../features/market/MarketHeader";
import MarketTable from "../features/market/MarketTable";
import BuyModal from "../features/market/BuyModal";
import { useMarket } from "../../api/useMarket";
import { useAuth } from "../../context/AuthContext";

function MarketPage() {
  const { coins, isLoading, error } = useMarket();
  const [search, setSearch] = useState("");
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const cash = user?.cash_usd ?? 0;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return coins;
    return coins.filter(
      (c) =>
        c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    );
  }, [search, coins]);

  const handleBuy = (coin) => {
    setSelectedCoin(coin);
    setIsBuyOpen(true);
  };

  async function handleClose() {
    setIsBuyOpen(false);
    setSelectedCoin(null);
    await refreshUser();
  }

  function handleConfirm() {
    navigate("/portfolio");
  }

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <MarketHeader search={search} onSearchChange={setSearch} />
      <MarketTable coins={filtered} loading={isLoading} onBuy={handleBuy} />
      <BuyModal
        open={isBuyOpen}
        coin={selectedCoin}
        onClose={handleClose}
        onConfirm={handleConfirm}
        cash={cash}
      />
    </section>
  );
}

export default MarketPage;
