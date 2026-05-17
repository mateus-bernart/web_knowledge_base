import { redirect } from "react-router";
import { apiClient } from "~/services/api";

export async function action({ request }: { request: Request }) {
  const api = apiClient(request);
  await api("/logout", { method: "POST" });

  return redirect("/login", {
    headers: {
      "Set-Cookie": "token=; Path=/; HttpOnly; Max-Age=0",
    },
  });
}
