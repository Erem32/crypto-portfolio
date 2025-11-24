import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext(null);

const STORAGE_KEY = "crypto_sim_settings_v1";

const defaultSettings = {
  hideSmallPositions: false,

  showPortfolioSummary: true,
};

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);

  // Load from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const parsed = safeParse(raw);
    if (!parsed || typeof parsed !== "object") return;

    setSettings((prev) => ({
      ...prev,
      ...parsed,
    }));
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore quota errors
    }
  }, [settings]);

  function updateSetting(key, value) {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function resetSettings() {
    setSettings(defaultSettings);
  }

  const value = {
    ...settings,
    updateSetting,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return ctx;
}
