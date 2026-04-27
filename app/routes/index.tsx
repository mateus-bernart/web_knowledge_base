import { Hammer } from "lucide-react";
import { Outlet } from "react-router";
import NavBar from "~/components/navbar";

export default function Home() {
  return (
    <div className="flex gap-2 text-muted-foreground">
      <h1>Página inicial (em construção)</h1>
      <Hammer />
    </div>
  );
}
