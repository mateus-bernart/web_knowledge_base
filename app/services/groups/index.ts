import { ApiError } from "~/errors";
import { apiClient } from "../api";

export async function createGroup(request: Request, formData: FormData) {
  const api = apiClient(request);

  const body = {
    name: formData.get("name"),
    description: formData.get("description"),
  };

  const res = await api("/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(data.message, res.status, data.action);
  }

  return {
    success: true,
    message: "Grupo criado com sucesso!",
    action: "Já disponível na lista.",
    data: data.group,
  };
}

export async function deleteGroup(request: Request, id: number) {
  const api = apiClient(request);
  const res = await api(`/groups/${id}`, { method: "DELETE" });

  if (res.status === 500) {
    throw new ApiError("Ops! Erro no servidor", 500, "Contate o suporte.");
  }

  if (!res.ok) {
    const data = await res.json();
    throw new ApiError(data.message, res.status);
  }

  return {
    success: true,
    message: "Grupo excluído com sucesso!",
    action: "Removido da lista.",
    method: "DELETE",
  };
}

export async function addUserToGroup(
  request: Request,
  formData: FormData,
  groupId: number,
) {
  const api = apiClient(request);
  const res = await api(`/groups/${groupId}/addUser`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: Number(formData.get("user_id")),
      role: formData.get("role"),
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new ApiError(data.message ?? "Erro ao adicionar usuário.", res.status);
  }

  return { success: true, message: "Usuário adicionado ao grupo!" };
}

export async function removeGroupUser(
  request: Request,
  groupId: number,
  userId: number,
) {
  const api = apiClient(request);
  const res = await api(`/groups/${groupId}/users/${userId}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json();
    throw new ApiError(data.message ?? "Erro ao remover membro.", res.status);
  }
  return { success: true, message: "Membro removido do grupo." };
}

export async function updateGroupUserRole(
  request: Request,
  groupId: number,
  userId: number,
  role: "admin" | "student",
) {
  const api = apiClient(request);
  const res = await api(`/groups/${groupId}/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new ApiError(data.message ?? "Erro ao atualizar papel.", res.status);
  }
  return { success: true, message: "Papel do membro atualizado." };
}

export async function updateGroup(
  request: Request,
  formData: FormData,
  id: number,
) {
  const api = apiClient(request);

  const res = await api(`/groups/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: formData.get("name"),
      description: formData.get("description"),
    }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new ApiError(data.message ?? "Erro ao atualizar.", res.status);
  }
  return { success: true, message: "Grupo atualizado." };
}

// export async function addGroupTag(
//   request: Request,
//   formData: FormData,
//   id: number,
// ) {
//   const api = apiClient(request);
//   const res = await api(`/groups/${id}/tags`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ description: formData.get("description") }),
//   });
//   if (!res.ok) {
//     const data = await res.json();
//     throw new ApiError(data.message ?? "Erro ao adicionar tag.", res.status);
//   }
//   return { success: true, message: "Tag adicionada." };
// }

// export async function deleteGroupTag(
//   request: Request,
//   formData: FormData,
//   id: number,
// ) {
//   const api = apiClient(request);
//   const res = await api(`/groups/${id}/tags/${formData.get("tagId")}`, {
//     method: "DELETE",
//   });
//   if (!res.ok) {
//     const data = await res.json();
//     throw new ApiError(data.message ?? "Erro ao remover tag.", res.status);
//   }
//   return { success: true, message: "Tag removida." };
// }
