import type { LoaderFunctionArgs } from "react-router";
import { apiClient } from "~/services/api";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";

  if (q.length < 2) {
    return { users: [] };
  }

  const api = apiClient(request);
  const res = await api(`/users/search?q=${encodeURIComponent(q)}`);

  if (!res.ok) {
    return { users: [] };
  }

  const data = await res.json();
  return { users: Array.isArray(data) ? data : [] };
}
