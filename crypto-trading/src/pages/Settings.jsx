// src/app/pages/Settings.jsx
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";

function Settings() {
  const { user } = useAuth();
  const {
    hideSmallPositions,
    showPortfolioSummary,
    updateSetting,
    resetSettings,
  } = useSettings();

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-zinc-900">Settings</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Personalise how this crypto simulator behaves on your device. Settings
          are stored locally in your browser and reload automatically.
        </p>

        <div className="mt-6 space-y-6">
          {user && (
            <div>
              <p className="text-xs font-medium uppercase text-zinc-500">
                Signed in as
              </p>
              <p className="mt-1 text-sm text-zinc-900">{user.email}</p>
            </div>
          )}

          {/* Interface preferences */}
          <div className="border-t border-zinc-200 pt-4 space-y-4">
            <h2 className="text-sm font-semibold text-zinc-900">
              Interface preferences
            </h2>

            <label className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  Hide very small positions
                </p>
                <p className="text-xs text-zinc-500">
                  In the Portfolio page, hide positions whose current value is
                  below $10. Helpful to keep the table clean when you have many
                  tiny “dust” holdings.
                </p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                checked={hideSmallPositions}
                onChange={() =>
                  updateSetting("hideSmallPositions", !hideSmallPositions)
                }
              />
            </label>

            <label className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  Show portfolio summary
                </p>
                <p className="text-xs text-zinc-500">
                  Display a short text summary above your holdings (largest
                  position and its share of the portfolio).
                </p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                checked={showPortfolioSummary}
                onChange={() =>
                  updateSetting("showPortfolioSummary", !showPortfolioSummary)
                }
              />
            </label>
          </div>

          {/* Summary + reset */}
          <div className="border-t border-zinc-200 pt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-zinc-500 space-y-1">
              <p>Resetting will only affect this browser.</p>
            </div>

            <button
              type="button"
              onClick={resetSettings}
              className="inline-flex items-center rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Reset to defaults
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Settings;
