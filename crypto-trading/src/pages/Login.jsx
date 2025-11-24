import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const { login } = useAuth();
  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await loginUser({ email, password });

    if (res.status === 401) {
      setServerError("Invalid email or password");
      return;
    }

    if (res.status === 422) {
      setServerError("The password is too short");
    }

    if (!res.ok) {
      setServerError(`Unexpected error (HTTP ${res.status})`);
      return;
    }

    const data = await res.json();
    login(data.access_token, data.user);

    navigate("/");
  }

  return (
    <div className="min-h-dvh grid place-items-center bg-zinc-100 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-center text-xl font-semibold text-zinc-900">
          Sign in
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="text-sm font-medium text-zinc-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-zinc-900 placeholder-zinc-400 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="you@example.com"
          />

          <label
            className="text-sm font-medium text-zinc-700"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-zinc-900 placeholder-zinc-400 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
          />

          {serverError && (
            <p className="text-sm text-rose-600">{serverError}</p>
          )}

          <button
            type="submit"
            className="mt-2 h-10 rounded-lg bg-indigo-600 px-4 font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
