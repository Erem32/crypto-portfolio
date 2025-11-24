import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/auth";

export default function Register() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    watch,
  } = useForm({ mode: "onChange" });

  const onSubmit = async ({ email, password }) => {
    setServerError("");

    try {
      const res = await registerUser({ email, password });

      if (res.status === 409) {
        // duplicate email (from unique constraint)
        setServerError("User already exists");
        return; // stop: don't navigate
      }
      if (res.status === 422) {
        // backend validation failed (Pydantic)
        setServerError("Invalid data. Check your email and password.");
        return;
      }

      if (!res.ok) {
        // ok === status in 200–299
        setServerError(`Unexpected error (HTTP ${res.status}).`);
        return;
      }
      navigate("/login");
    } catch (err) {
      setServerError(err.message);
    }
  };

  const password = watch("password");

  return (
    <div className="min-h-dvh grid place-items-center bg-zinc-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Create account</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Log in
          </Link>
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-zinc-800"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2
                         text-zinc-900 outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Enter a valid email",
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-rose-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-zinc-800"
              >
                Password
              </label>
              <span className="text-xs text-zinc-500">min 8 characters</span>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2
                         text-zinc-900 outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "At least 8 characters" },
                maxLength: { value: 72, message: "Too long" },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-rose-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label
              htmlFor="confirm"
              className="text-sm font-medium text-zinc-800"
            >
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2
                         text-zinc-900 outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("confirm", {
                required: "Please confirm your password",
                validate: (v) => v === password || "Passwords do not match",
              })}
            />
            {errors.confirm && (
              <p className="mt-1 text-sm text-rose-600">
                {errors.confirm.message}
              </p>
            )}
          </div>

          {/* Server error */}
          {serverError && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={!isDirty || !isValid || isSubmitting}
            className="mt-2 h-11 w-full rounded-lg bg-indigo-600 font-medium text-white
                       transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed
                       disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isSubmitting ? "Creating..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
