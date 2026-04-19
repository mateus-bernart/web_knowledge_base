import { apiClient } from "../api";

export async function loginUser(
  request: Request,
  email: FormDataEntryValue,
  password: FormDataEntryValue,
) {
  const api = apiClient(request);
  const res = await api("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    return { error: "Credenciais inválidas" };
  }

  const data = await res.json();
  return { token: data.token, username: data.username, email: data.email };
}

export async function getUser() {
  const res = await fetch("http://localhost:8000/api/user", {
    credentials: "include",
  });

  if (!res.ok) return { user: null, error: "Not authenticated" };

  const user = await res.json();
  console.log("user ", user);

  return { user, error: null };
}
