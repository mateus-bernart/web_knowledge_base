import { Form, NavLink, redirect } from "react-router";

export async function action() {
  return redirect("login", {
    headers: {
      "Set-Cookie": "token=; Path=/; HttpOnly; Max-Age=0", // 👈 clears the cookie
    },
  });
}

export default function NavBar() {
  const handleLogout = () => {};

  return (
    <div className="flex gap-5 p-5 bg-amber-500">
      <div>
        <NavLink to="/" className="text-amber-800">
          Home
        </NavLink>
        <NavLink to="/about" className="text-amber-800">
          About
        </NavLink>
        <NavLink to="/materials" className="text-amber-800">
          Materials
        </NavLink>
      </div>
      <Form method="post" action="/logout">
        <button type="submit">Logout</button>
      </Form>
    </div>
  );
}
