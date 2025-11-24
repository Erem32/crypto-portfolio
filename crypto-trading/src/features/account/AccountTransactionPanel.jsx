import { useState } from "react";
import { getRecentTransactions } from "../../../api/apiTransactions";

function AccountTransactionsPanel() {
  const [showTx, setShowTx] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState("");
  const [transactions, setTransactions] = useState([]);

  async function handleToggleTransactions() {
    if (!showTx && transactions.length === 0) {
      setTxLoading(true);
      setTxError("");
      try {
        const data = await getRecentTransactions(5);
        setTransactions(data);
      } catch (err) {
        setTxError(err.message || "Failed to load transactions");
      } finally {
        setTxLoading(false);
      }
    }

    setShowTx((v) => !v);
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">
            Recent transactions
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Shows the last few BUY / SELL operations for this account.
          </p>
        </div>
        <button
          type="button"
          onClick={handleToggleTransactions}
          className="inline-flex items-center rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {showTx ? "Hide" : "Show"} list
        </button>
      </div>

      {showTx && (
        <div className="mt-4">
          {txLoading && (
            <p className="text-xs text-zinc-500">Loading transactions…</p>
          )}
          {txError && <p className="text-xs text-rose-600">{txError}</p>}
          {!txLoading && !txError && transactions.length === 0 && (
            <p className="text-xs text-zinc-500">
              No transactions yet. Buy or sell something in the Market tab.
            </p>
          )}

          {!txLoading && !txError && transactions.length > 0 && (
            <ul className="divide-y divide-zinc-200 text-xs">
              {transactions.map((tx) => (
                <li
                  key={tx.id}
                  className="py-2 flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-zinc-900">
                      {tx.symbol} · {tx.side}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {new Date(tx.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-900">
                      {tx.quantity} @ ${tx.price_usd.toFixed(2)}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Total: ${tx.total_value_usd.toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default AccountTransactionsPanel;
