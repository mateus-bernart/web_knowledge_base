export async function loginUser(
  email: FormDataEntryValue,
  password: FormDataEntryValue,
) {
  const res = await fetch("http://localhost:8000/api/login", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
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
