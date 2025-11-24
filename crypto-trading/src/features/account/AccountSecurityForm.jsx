// src/features/account/AccountSecurityForm.jsx
import { useState } from "react";
import { changePassword, changeEmail } from "../../../api/auth";

function AccountSecurityForm({ user, refreshUser }) {
  const [emailInput, setEmailInput] = useState(user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [securityMessage, setSecurityMessage] = useState("");
  const [securityType, setSecurityType] = useState("info"); // "info" | "success" | "error"
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSecuritySubmit(e) {
    e.preventDefault();
    setSecurityMessage("");
    setSecurityType("info");

    const wantsPasswordChange = newPassword.trim().length > 0;
    const wantsEmailChange = emailInput.trim() !== (user?.email ?? "").trim();

    if (!wantsPasswordChange && !wantsEmailChange) {
      setSecurityType("info");
      setSecurityMessage("There are no changes to save.");
      return;
    }

    // For password change we require current password
    if (wantsPasswordChange && !currentPassword) {
      setSecurityType("error");
      setSecurityMessage("Please enter your current password.");
      return;
    }

    if (wantsPasswordChange && newPassword.length < 8) {
      setSecurityType("error");
      setSecurityMessage("New password must be at least 8 characters long.");
      return;
    }

    if (wantsPasswordChange && newPassword === currentPassword) {
      setSecurityType("error");
      setSecurityMessage(
        "New password must be different from the current one."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (wantsPasswordChange) {
        const resp = await changePassword({
          currentPassword,
          newPassword,
        });

        if (!resp.ok) {
          let detail = "We couldn't update your password.";
          try {
            const data = await resp.json();
            if (data?.detail) detail = data.detail;
          } catch {
            // ignore JSON parse errors
          }
          throw new Error(detail);
        }
      }

      if (wantsEmailChange) {
        const resp = await changeEmail({ email: emailInput });

        if (!resp.ok) {
          let detail = "We couldn't update your email.";
          try {
            const data = await resp.json();
            if (data?.detail) detail = data.detail;
          } catch {
            // ignore JSON parse errors
          }
          throw new Error(detail);
        }

        if (typeof refreshUser === "function") {
          await refreshUser();
        }
      }

      setSecurityType("success");
      if (wantsPasswordChange && wantsEmailChange) {
        setSecurityMessage("Your email and password have been updated.");
      } else if (wantsPasswordChange) {
        setSecurityMessage("Your password has been updated.");
      } else {
        setSecurityMessage("Your email has been updated.");
      }

      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setSecurityType("error");
      setSecurityMessage(
        err?.message || "We couldn't update your account settings."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const messageColor =
    securityType === "success"
      ? "text-emerald-600"
      : securityType === "error"
      ? "text-rose-600"
      : "text-zinc-500";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-zinc-900">Security</h2>
      <p className="mt-1 text-xs text-zinc-500">
        Update your email and password for this account.
      </p>

      <form onSubmit={handleSecuritySubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-700">
            New email
          </label>
          <input
            type="email"
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-zinc-700">
              Current password
            </label>
            <input
              type="password"
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700">
              New password
            </label>
            <input
              type="password"
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>

        {securityMessage && (
          <p className={`text-xs ${messageColor}`}>{securityMessage}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}

export default AccountSecurityForm;
