import { formatUSD } from "../../lib/format";

function AccountBasicInfo({ user }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-zinc-900">Account</h1>
      <p className="mt-1 text-sm text-zinc-600">
        Basic information about your account.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-xs font-medium uppercase text-zinc-500">User ID</p>
          <p className="mt-1 text-sm text-zinc-900">{user.id}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-zinc-500">Email</p>
          <p className="mt-1 text-sm text-zinc-900">{user.email}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-zinc-500">
            Cash balance
          </p>
          <p className="mt-1 text-sm text-zinc-900">
            {formatUSD(user.cash_usd)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AccountBasicInfo;
