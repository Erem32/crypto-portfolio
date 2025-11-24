import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const res = await getCurrentUser();
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    (async () => {
      await refreshUser();
      setLoading(false);
    })();
  }, []);

  function login(token, user) {
    localStorage.setItem("access_token", token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("access_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
