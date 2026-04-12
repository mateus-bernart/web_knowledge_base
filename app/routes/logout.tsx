import { redirect } from "react-router";

export async function action() {
  return redirect("/login", {
    headers: {
      "Set-Cookie": "token=; Path=/; HttpOnly; Max-Age=0", // 👈 clears the cookie
    },
  });
}
