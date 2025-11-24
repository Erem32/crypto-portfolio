import { formatUSD } from "../../lib/format";
import { useMemo, useState } from "react";

function SellModal({ holding, open, onClose, onConfirm }) {
  const [qtyStr, setQtyStr] = useState("");

  // Parse & clamp
  const qty = useMemo(() => {
    const n = Number(qtyStr);
    if (!Number.isFinite(n)) return NaN;
    if (n < 0) return 0;
    return n;
  }, [qtyStr]);
  if (!open || !holding) return null;

  const { symbol, price, quantity: available = 0 } = holding;
  const exceeds = Number.isFinite(qty) && qty > available;
  const zero = !Number.isFinite(qty) || qty === 0;
  const invalid = exceeds || zero;

  const totalUSD = Number.isFinite(qty) ? qty * (price ?? 0) : 0;

  function handleSubmit(e) {
    e.preventDefault();
    if (invalid) return;

    // Hand all relevant data to parent
    onConfirm?.({
      qty,
      symbol,
    });

    onClose?.();
    // Optionally reset input:
    setQtyStr("");
  }
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="absolute inset-0 grid place-items-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sell-title"
          className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h3 id="sell-title" className="text-lg font-semibold text-zinc-900">
              Sell {symbol}
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

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Symbol (read-only) */}
            <div>
              <label className="text-sm font-medium text-zinc-700">
                Symbol
              </label>
              <input
                readOnly
                value={symbol ?? ""}
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2"
              />
            </div>

            {/* Price (read-only) */}
            <div>
              <label className="text-sm font-medium text-zinc-700">
                Price (USD)
              </label>
              <input
                readOnly
                value={Number.isFinite(price) ? formatUSD(price) : ""}
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2 tabular-nums"
              />
            </div>

            {/* Quantity */}
            <div>
              <div className="flex items-baseline justify-between">
                <label
                  htmlFor="quantity"
                  className="text-sm font-medium text-zinc-700"
                >
                  Quantity
                </label>
                <span className="text-xs text-zinc-500">
                  Available: <span className="tabular-nums">{available}</span>
                </span>
              </div>

              <input
                id="quantity"
                name="quantity"
                inputMode="decimal"
                type="number"
                min="0"
                step="0.0001"
                placeholder="0.00"
                value={qtyStr}
                onChange={(e) => setQtyStr(e.target.value)}
                autoFocus
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {/* Inline validation */}
              {exceeds && (
                <p className="mt-1 text-xs text-rose-600">
                  Amount exceeds available balance.
                </p>
              )}
            </div>

            {/* Estimated total */}
            <div className="rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
              Estimated total:{" "}
              <span className="font-medium tabular-nums">
                {invalid ? "—" : formatUSD(totalUSD)}
              </span>
            </div>

            {/* Actions */}
            <div className="mt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-lg border border-zinc-300 bg-white px-4 text-zinc-700 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={invalid}
                className={`h-10 rounded-lg px-4 font-medium text-white focus:outline-none focus:ring-2 ${
                  invalid
                    ? "bg-rose-300 cursor-not-allowed"
                    : "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500"
                }`}
              >
                Confirm Sell
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SellModal;
