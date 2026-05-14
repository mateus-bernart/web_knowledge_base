import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import type { GroupMember } from "~/types";

type UserResult = {
  id: number;
  username: string;
  name: string;
  email: string;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: number;
  members: GroupMember[];
}

export function AddUserToGroupDialog({
  open,
  onOpenChange,
  groupId,
  members,
}: Props) {
  const submitFetcher = useFetcher<{ success: boolean; message: string }>();
  const searchFetcher = useFetcher<{ users: UserResult[] }>();

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);
  const [role, setRole] = useState<"admin" | "student">("student");

  useEffect(() => {
    if (!open) {
      setSearch("");
      setSelectedUser(null);
      setRole("student");
    }
  }, [open]);

  useEffect(() => {
    if (search.length >= 2) {
      searchFetcher.load(`/user-search?q=${encodeURIComponent(search)}`);
    }
  }, [search]);

  useEffect(() => {
    if (submitFetcher.state === "idle" && submitFetcher.data?.success) {
      onOpenChange(false);
    }
  }, [submitFetcher.state, submitFetcher.data]);

  const users = search.length >= 2 ? (searchFetcher.data?.users ?? []) : [];
  const isSearching = searchFetcher.state === "loading";
  const isSubmitting = submitFetcher.state !== "idle";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Integrantes do grupo</DialogTitle>
        </DialogHeader>

        {members.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Membros atuais
            </p>
            <div className="rounded-md border divide-y max-h-40 overflow-y-auto text-sm">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between px-3 py-2"
                >
                  <div>
                    <span className="font-medium">{member.username}</span>
                    <span className="text-muted-foreground ml-2 text-xs">
                      {member.email}
                    </span>
                  </div>
                  <span className="text-xs rounded-full px-2 py-0.5 bg-muted text-muted-foreground capitalize">
                    {member.pivot.role === "admin" ? "Admin" : "Estudante"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <submitFetcher.Form
          method="post"
          action={`/groups/${groupId}`}
          className="space-y-4"
        >
          <input type="hidden" name="_method" value="ADD_USER" />
          <input type="hidden" name="user_id" value={selectedUser?.id ?? ""} />
          <input type="hidden" name="role" value={role} />

          <div className="space-y-2">
            <Label>Adicionar por username ou email</Label>
            {selectedUser ? (
              <div className="flex items-center justify-between rounded-md border px-3 py-2 bg-muted/50">
                <div className="text-sm">
                  <span className="font-medium">{selectedUser.username}</span>
                  <span className="text-muted-foreground ml-2 text-xs">
                    {selectedUser.email}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => {
                    setSelectedUser(null);
                    setSearch("");
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ex: joao ou joao@logos.org"
                autoComplete="off"
              />
            )}

            {!selectedUser && search.length >= 2 && (
              <div className="rounded-md border divide-y text-sm">
                {isSearching && (
                  <p className="px-3 py-2 text-muted-foreground">
                    Buscando...
                  </p>
                )}
                {!isSearching && users.length === 0 && (
                  <p className="px-3 py-2 text-muted-foreground">
                    Nenhum usuário encontrado.
                  </p>
                )}
                {!isSearching &&
                  users.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
                      onClick={() => setSelectedUser(user)}
                    >
                      <span className="font-medium">{user.username}</span>
                      <span className="text-muted-foreground ml-2 text-xs">
                        {user.email}
                      </span>
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role-select">Função no grupo</Label>
            <select
              id="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "student")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="student">Estudante</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!selectedUser || isSubmitting}>
              {isSubmitting ? "Adicionando..." : "Adicionar"}
            </Button>
          </DialogFooter>
        </submitFetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
