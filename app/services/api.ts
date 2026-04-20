export function apiClient(request: Request) {
  const cookie = request.headers.get("Cookie") ?? "";
  const token = getToken(cookie);

  const url =
    process.env.VITE_API_URL ||
    process.env.API_URL ||
    "http://localhost:8000/api";

  return (path: string, init?: RequestInit) =>
    fetch(`${url}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });
}

function getToken(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/token=([^;]+)/);
  return match ? match[1] : null;
}
