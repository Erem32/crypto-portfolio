import { useState } from "react";
import { buyCoin } from "../../../api/apiOrders";

function BuyModal({ coin, open, cash, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open || !coin) return null;

  const numericQty = Number(quantity) || 0;
  const price = coin.priceUSD ?? 0;
  const estimatedTotal = numericQty * price;
  const safeCash = typeof cash === "number" ? cash : 0;
  const remainingAfter = safeCash - estimatedTotal;
  const willExceedCash = estimatedTotal > safeCash;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!numericQty || numericQty <= 0) {
      setError("Enter a quantity greater than 0");
      return;
    }

    if (willExceedCash) {
      setError("Not enough cash to complete this purchase");
      return;
    }

    try {
      setIsSubmitting(true);
      const tx = await buyCoin({
        symbol: coin.symbol,
        quantity: numericQty,
      });

      if (onConfirm) onConfirm(tx);
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong while buying");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="buy-title"
          className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 id="buy-title" className="text-lg font-semibold text-zinc-900">
              Buy {coin.symbol}
            </h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="size-9 rounded-lg text-zinc-500 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              ✕
            </button>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-zinc-700">
                Symbol
              </label>
              <input
                readOnly
                value={coin.symbol}
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700">
                Price (USD)
              </label>
              <input
                readOnly
                value={price}
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2 tabular-nums"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700">
                Quantity
              </label>
              <input
                type="number"
                min="0"
                step="0.0001"
                placeholder="0.00"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-700 tabular-nums space-y-1">
              <div>Available cash: ${safeCash.toFixed(2)}</div>
              <div>
                Estimated total:{" "}
                {numericQty > 0 ? `$${estimatedTotal.toFixed(2)}` : "--"}
              </div>
              {numericQty > 0 && (
                <div>Remaining after trade: ${remainingAfter.toFixed(2)}</div>
              )}
            </div>

            {willExceedCash && (
              <div className="text-sm text-red-600">
                Not enough cash to complete this purchase.
              </div>
            )}

            {error && !willExceedCash && (
              <div className="text-sm text-red-600">{error}</div>
            )}

            <div className="mt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-lg border border-zinc-300 bg-white px-4 text-zinc-700 hover:bg-zinc-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 rounded-lg bg-indigo-600 px-4 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                disabled={isSubmitting || !quantity || willExceedCash}
              >
                {isSubmitting ? "Buying..." : "Confirm Buy"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BuyModal;
