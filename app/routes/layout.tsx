import { Outlet, redirect, useNavigation } from "react-router";
import type { Route } from "./+types/layout";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/AppSidebar";
import { Loader2 } from "lucide-react";
import { apiClient } from "~/services/api";

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") ?? "";
  const token = cookie.match(/token=([^;]+)/)?.[1];

  if (!token) return redirect("/login");

  const api = apiClient(request);

  const [groupsRes] = await Promise.all([api("/groups")]);

  const groups = await groupsRes.json();

  return { groups: Array.isArray(groups) ? groups : [] };
}

export default function Layout({ loaderData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar groups={loaderData.groups} />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b border-border px-2">
            <SidebarTrigger />
          </header>
          <main className="flex-1 p-4">
            <div className="relative h-full overflow-hidden">
              {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                  <Loader2 className="animate-spin text-primary" size={28} />
                </div>
              )}
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
