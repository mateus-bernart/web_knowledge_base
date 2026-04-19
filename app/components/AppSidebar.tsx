import {
  BookOpen,
  FileText,
  FolderOpen,
  Users,
  MessageSquare,
  Search,
  Plus,
  ChevronRight,
  LogOut,
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
import { Button } from "../components/ui/button";
import { useState } from "react";
import { CreateGroupDialog } from "./CreateGroupDialog";
import { CreateFolderDialog } from "./CreateFolderDialog";
import { useView } from "~/context/viewContext";
import { useAuth } from "~/context/authContext";
import { NavLink } from "react-router";

export function AppSidebar() {
  const { state, setOpenMobile, isMobile, setOpen, toggleSidebar } =
    useSidebar();
  const collapsed = state === "collapsed";
  const { activeView, setActiveView, activeFolderId, setActiveFolderId } =
    useView();
  const { user, logout } = useAuth();

  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);

  function handleNav() {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      if (!collapsed) toggleSidebar();
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
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : ""
                    }
                  >
                    <Search className="h-4 w-4" />
                    {!collapsed && <span>Pesquisar</span>}
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
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Nova Pasta</span>
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
                    {/* {groups.map((group) => (
                      <SidebarMenuItem key={group.id}>
                        <SidebarMenuButton
                          onClick={() => setActiveGroup(group.id)}
                          className={
                            activeGroupId === group.id
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : ""
                          }
                        >
                          <Users className="h-4 w-4" />
                          {!collapsed && <span>{group.name}</span>}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))} */}

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
                  <SidebarMenuButton
                    onClick={() => setActiveView("forum")}
                    className={
                      activeView === "forum"
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : ""
                    }
                  >
                    <MessageSquare className="h-4 w-4" />
                    {!collapsed && <span>Fórum</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-3">
          {!collapsed && user && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground truncate">
                {user.username}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-8 w-8"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
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
