import { apiFetch } from "./apiClient";

export async function registerUser({ email, password }) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function loginUser({ email, password }) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getCurrentUser() {
  return apiFetch("/auth/me", {
    method: "GET",
  });
}

export function changePassword({ currentPassword, newPassword }) {
  return apiFetch("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
}

export function changeEmail({ email }) {
  return apiFetch("/auth/change-email", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
