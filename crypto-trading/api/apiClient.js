const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_URL is missing in your Vite env");
}

export function buildUrl(path) {
  return `${BASE_URL}${path}`;
}

export async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  const token = localStorage.getItem("access_token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const finalOptions = {
    ...options,
    headers,
  };

  return await fetch(url, finalOptions);
}
