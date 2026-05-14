import {
  Outlet,
  useFetcher,
  useLoaderData,
  useNavigate,
  type ActionFunctionArgs,
} from "react-router";
import { apiClient } from "~/services/api";
import type { Route } from "./+types/group";
import { Delete, Pencil, Trash, Trash2, UserPlus } from "lucide-react";
import { addUserToGroup, deleteGroup, updateGroup } from "~/services/groups";
import { useActionToast } from "~/hooks/useActionToast";
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
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { ApiError } from "~/errors";
import { useEffect, useState } from "react";
import type { ActionData, Group, GroupMember } from "~/types";
import { Input } from "~/components/ui/input";
import { commitSession, getSession } from "~/sessions";
import { AddUserToGroupDialog } from "~/components/AddUserToGroupDialog";

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const toast = session.get("toast");

  const api = apiClient(request);

  const [groupRes] = await Promise.all([api(`/groups/${params.groupId}`)]);

  const group = await groupRes.json();

  return new Response(JSON.stringify({ group, toast }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const method = (formData.get("_method") as string) ?? request.method;
  const id = Number(params.groupId);
  let response;

  try {
    if (method === "DELETE") {
      response = await deleteGroup(request, id);
    } else if (method === "PATCH") {
      response = await updateGroup(request, formData, id);
    } else if (method === "ADD_USER") {
      response = await addUserToGroup(request, formData, id);
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      console.log(error);
      return { success: false, message: error.message, action: error.action };
    }

    return {
      success: false,
      message: "Erro inesperado",
      action: "Tente novamente ou contate o suporte.",
      status: 500,
    };
  }
}

export default function Group() {
  const { group, toast } = useLoaderData();

  const [editing, setEditing] = useState<boolean>();
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description);
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false);

  const fetcher = useFetcher<ActionData>();
  useActionToast(fetcher.data, toast);
  const navigate = useNavigate();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      if (fetcher.data.method === "DELETE") {
        navigate("/");
      }
    }
  }, [fetcher.state, fetcher.data]);

  useEffect(() => {
    setName(group.name);
    setDescription(group.description);
    setEditing(false);
  }, [group.id]);

  function updateGroupContent() {
    fetcher.submit(
      { _method: "PATCH", name, description },
      { method: "post", action: `/groups/${group.id}` },
    );
    setEditing(false);
  }

  function cancelEdit() {
    setName(group.name);
    setEditing(false);
  }

  return (
    <div className="flex flex-col gap-3" key={group.id}>
      <AddUserToGroupDialog
        open={addUserOpen}
        onOpenChange={setAddUserOpen}
        groupId={group.id}
        members={group.members ?? []}
      />
      <div className="flex justify-between items-center gap-2">
        {editing ? (
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-lg font-medium border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground"
          />
        ) : (
          <h1>{group.name}</h1>
        )}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setAddUserOpen(true)}>
            <UserPlus></UserPlus>
          </Button>
          {editing ? (
            <>
              <Button
                size="sm"
                onClick={updateGroupContent}
                disabled={fetcher.state !== "idle"}
              >
                {fetcher.state !== "idle" ? "Salvando..." : "Salvar"}
              </Button>
              <Button size="sm" variant="outline" onClick={cancelEdit}>
                Cancelar
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditing(true)}
            >
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Editar
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 relative z-10"
              >
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir grupo?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex items-center">
                <fetcher.Form
                  method="POST"
                  action={`/groups/${group.id}`}
                  className="flex w-full gap-2"
                >
                  <input type="hidden" name="_method" value="DELETE" />
                  <AlertDialogCancel className="flex-1 w-full">
                    Cancelar
                  </AlertDialogCancel>

                  <AlertDialogAction type="submit" className="flex-1 w-full">
                    Excluir
                  </AlertDialogAction>
                </fetcher.Form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div>
        {editing ? (
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-lg font-medium border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground"
          />
        ) : (
          <h3>{group.description}</h3>
        )}
      </div>
      {(group.members ?? []).length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Membros
          </p>
          <div className="rounded-md border divide-y text-sm">
            {(group.members as GroupMember[]).map((member) => (
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
      <Outlet />
    </div>
  );
}
