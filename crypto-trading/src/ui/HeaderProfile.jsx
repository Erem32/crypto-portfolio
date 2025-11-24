import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formatUSD } from "../lib/format";

function HeaderProfile() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef(null);

  const cash = user?.cash_usd ?? 0;

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event) {
      if (!wrapperRef.current) return;

      if (!wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (loading) {
    return (
      <div className="flex items-center gap-4 animate-pulse">
        <div className="h-4 w-24 rounded-full bg-zinc-200" />
        <div className="h-8 w-16 rounded-full bg-zinc-200" />
        <div className="h-10 w-10 rounded-full bg-zinc-200" />
      </div>
    );
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => navigate("/login")}
        className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
      >
        Sign in
      </button>
    );
  }

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/login");
  }

  function handleAccount() {
    setOpen(false);
    navigate("/account");
  }

  return (
    <div ref={wrapperRef} className="relative flex items-center gap-3">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 px-3 py-1.5 hover:bg-zinc-200"
      >
        <div className="flex flex-col items-start">
          <p className="max-w-[160px] truncate text-sm font-semibold text-zinc-800">
            {user.email}
          </p>
          <p className="text-xs text-zinc-500">{formatUSD(cash)}</p>
        </div>

        <img
          src="/Avatar.png"
          alt="Account"
          className="h-10 w-10 shrink-0 rounded-full object-cover"
          draggable={false}
        />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 top-12 z-20 w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
          <div className="border-b border-zinc-100 px-4 py-3">
            <p className="text-xs text-zinc-500">Signed in as</p>
            <p className="truncate text-sm font-medium text-zinc-800">
              {user.email}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAccount}
            className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
          >
            Account settings
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default HeaderProfile;
