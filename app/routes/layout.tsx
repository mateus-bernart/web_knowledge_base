import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/layout";
import NavBar from "~/components/navbar";

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") ?? "";
  const token = cookie.match(/token=([^;]+)/)?.[1];

  if (!token) return redirect("/login");

  return null;
}

export default function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
