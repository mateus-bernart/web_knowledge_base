import {
  BookOpen,
  FileText,
  Users,
  MessageSquare,
  Search,
  Plus,
  ChevronRight,
  LogOut,
  Hammer,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "../components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { CreateGroupDialog } from "./CreateGroupDialog";
import { CreateFolderDialog } from "./CreateFolderDialog";
import { useView } from "~/context/viewContext";
import { Form, NavLink } from "react-router";
import type { Group, User } from "~/types";

type SidebarProps = {
  groups: Group[];
  user: User;
};

export function AppSidebar({ groups, user }: SidebarProps) {
  const { state, setOpenMobile, isMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const { activeView, setActiveView, activeFolderId } = useView();

  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);

  const [activeGroup, setActiveGroupId] = useState<number>();

  function handleNav() {
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2 text-primary">
            <BookOpen className="h-5 w-5 shrink-0" />
            {!collapsed && (
              <span className="font-bold text-lg">
                Base de conhecimento logosófico
              </span>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/* Search */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => {
                      setActiveView("search");
                    }}
                    className={
                      activeView === "search"
                        ? "bg-sidebar-accent text-sidebar-accent-foreground flex items-center justify-between"
                        : "flex items-center justify-between"
                    }
                    disabled
                  >
                    <div className="flex items-start gap-2">
                      <Search className="h-4 w-4" />
                      {!collapsed && <span>Pesquisar </span>}
                    </div>
                    <div className="flex">
                      <Hammer />
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Personal */}
          <SidebarGroup>
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="w-full">
                <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:bg-sidebar-accent/50 rounded-md px-2">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Pessoal
                  </span>
                  {!collapsed && (
                    <ChevronRight className="h-3 w-3 transition-transform group-data-[state=open]:rotate-90" />
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <NavLink to={"/materials"} onClick={handleNav}>
                        <SidebarMenuButton
                          className={
                            activeView === "personal" && !activeFolderId
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : ""
                          }
                          tooltip={"Todos os materiais"}
                        >
                          <FileText className="h-4 w-4" />
                          {!collapsed && <span>Todos os materiais</span>}
                        </SidebarMenuButton>
                      </NavLink>
                    </SidebarMenuItem>

                    {/* {folders
                      .filter((f) => !f.parentId)
                      .map((folder) => (
                        <SidebarMenuItem key={folder.id}>
                          <SidebarMenuButton
                            onClick={() => {
                              setActiveView("personal");
                              setActiveFolder(folder.id);
                            }}
                            className={
                              activeFolderId === folder.id
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : ""
                            }
                          >
                            <FolderOpen className="h-4 w-4" />
                            {!collapsed && <span>{folder.name}</span>}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))} */}

                    {!collapsed && (
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => setFolderDialogOpen(true)}
                          className="flex justify-between text-muted-foreground hover:text-foreground"
                          disabled
                        >
                          <div className="flex items-start gap-2">
                            <Plus className="h-4 w-4" />
                            <span>Nova Pasta </span>
                          </div>
                          <div className="flex">
                            <Hammer className="h-4 w-4" />
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>

          {/* Groups */}
          <SidebarGroup>
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="w-full">
                <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:bg-sidebar-accent/50 rounded-md px-2">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Grupos
                  </span>
                  {!collapsed && (
                    <ChevronRight className="h-3 w-3 transition-transform group-data-[state=open]:rotate-90" />
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {groups.map((group) => (
                      <NavLink
                        to={`/groups/${group.id}/materials`}
                        onClick={handleNav}
                        key={group.id}
                      >
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            onClick={() => setActiveGroupId(group.id)}
                            className={
                              activeGroup === group.id
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : ""
                            }
                          >
                            <Users className="h-4 w-4" />
                            {!collapsed && <span>{group.name}</span>}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </NavLink>
                    ))}

                    {!collapsed && (
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => setGroupDialogOpen(true)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Novo Grupo</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>

          {/* Forum */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <NavLink to="/forum" onClick={handleNav}>
                    <SidebarMenuButton tooltip="Fórum">
                      <MessageSquare className="h-4 w-4" />
                      {!collapsed && <span>Fórum</span>}
                    </SidebarMenuButton>
                  </NavLink>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-3">
          <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between gap-2"}`}>
            <div className={`flex items-center ${collapsed ? "" : "gap-2 min-w-0"}`}>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase">
                {user?.username?.[0] ?? "?"}
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-none truncate">{user?.username}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              )}
            </div>

            {!collapsed && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent size="sm">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sair da conta?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Você será desconectado e redirecionado para a página de login.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <Form method="post" action="/logout">
                      <AlertDialogAction type="submit" variant="destructive" className="w-full">
                        Sair
                      </AlertDialogAction>
                    </Form>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>

      <CreateGroupDialog
        open={groupDialogOpen}
        onOpenChange={setGroupDialogOpen}
      />
      <CreateFolderDialog
        open={folderDialogOpen}
        onOpenChange={setFolderDialogOpen}
      />
    </>
  );
}
