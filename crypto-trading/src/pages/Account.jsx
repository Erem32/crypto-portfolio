import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AccountPerformanceStats from "../features/account/AccountPerformanceStats";
import AccountBasicInfo from "../features/account/AccountBasicInfo";
import AccountSecurityForm from "../features/account/AccountSecurityForm";
import AccountTransactionPanel from "../features/account/AccountTransactionPanel";

function Account() {
  const navigate = useNavigate();
  const { user, loading, logout, refreshUser } = useAuth();

  if (loading) {
    return (
      <section className="mx-auto max-w-3xl space-y-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="h-5 w-32 rounded-full bg-zinc-200 animate-pulse mb-4" />
          <div className="space-y-2">
            <div className="h-4 w-48 rounded-full bg-zinc-200 animate-pulse" />
            <div className="h-4 w-40 rounded-full bg-zinc-200 animate-pulse" />
            <div className="h-4 w-36 rounded-full bg-zinc-200 animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl space-y-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-700">
            You are not logged in.{" "}
            <button
              className="text-indigo-600 hover:underline"
              onClick={() => navigate("/login")}
            >
              Go to login
            </button>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <AccountPerformanceStats user={user} />
      <AccountBasicInfo user={user} />
      <AccountSecurityForm user={user} refreshUser={refreshUser} />
      <AccountTransactionPanel />

      {/* Navigation / logout */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Back to dashboard
        </button>

        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="inline-flex items-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          Log out
        </button>
      </div>
    </section>
  );
}

export default Account;
