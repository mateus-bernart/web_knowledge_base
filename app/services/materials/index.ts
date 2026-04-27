import { ApiError } from "~/errors";
import { apiClient } from "../api";

export async function getMaterialTypes(api: any) {
  const res = await api("/material-types");

  if (!res.ok) {
    throw new ApiError("Erro ao carregar tipos", res.status);
  }

  return res.json();
}

export async function getMaterials(api: any, groupId?: number) {
  const res = groupId
    ? await api(`/groups/${groupId}/materials`)
    : await api("/materials");

  if (!res.ok) {
    throw new ApiError("Erro ao carregar materiais", res.status);
  }

  return res.json();
}

export async function createMaterial(request: Request, formData: FormData) {
  const api = apiClient(request);

  const body = {
    title: formData.get("title"),
    content: formData.get("content"),
    material_type_id: Number(formData.get("material_type_id")),
    flag_color: formData.get("flagColor") || null,
    group_id: Number(formData.get("groupId")),
    visibility_id: formData.get("is_public") === "on" ? 1 : 2,
    tags: JSON.parse((formData.get("tags") as string) ?? "[]"),
  };

  const res = await api("/materials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new ApiError(data.message, res.status, data.action);
  }

  return {
    success: true,
    message: "Material criado com sucesso!",
    action: "Já disponível na lista.",
  };
}

export async function deleteMaterial(request: Request, id: number) {
  const api = apiClient(request);
  const res = await api(`/materials/${id}`, { method: "DELETE" });

  if (res.status === 500) {
    throw new ApiError("Ops! Erro no servidor", 500, "Contate o suporte.");
  }

  if (!res.ok) {
    const data = await res.json();
    throw new ApiError(data.message, res.status);
  }

  return {
    success: true,
    message: "Material excluído com sucesso!",
    action: "Removido da lista.",
  };
}

export async function updateMaterial(
  request: Request,
  formData: FormData,
  id: number,
) {
  const api = apiClient(request);

  const res = await api(`/materials/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: formData.get("title"),
      content: formData.get("content"),
    }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new ApiError(data.message ?? "Erro ao atualizar.", res.status);
  }
  return { success: true, message: "Material atualizado." };
}

export async function addMaterialTag(
  request: Request,
  formData: FormData,
  id: number,
) {
  const api = apiClient(request);
  const res = await api(`/materials/${id}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description: formData.get("description") }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new ApiError(data.message ?? "Erro ao adicionar tag.", res.status);
  }
  return { success: true, message: "Tag adicionada." };
}

export async function deleteMaterialTag(
  request: Request,
  formData: FormData,
  id: number,
) {
  const api = apiClient(request);
  const res = await api(`/materials/${id}/tags/${formData.get("tagId")}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new ApiError(data.message ?? "Erro ao remover tag.", res.status);
  }
  return { success: true, message: "Tag removida." };
}

export async function createGroupMaterial(
  request: Request,
  formData: FormData,
  groupId: number,
) {
  const api = apiClient(request);

  const body = {
    title: formData.get("title"),
    content: formData.get("content"),
    material_type_id: Number(formData.get("material_type_id")),
    flag_color: formData.get("flagColor") || null,
    group_id: groupId,
    visibility_id: formData.get("is_public") === "on" ? 1 : 2,
    tags: JSON.parse((formData.get("tags") as string) ?? "[]"),
  };
  console.log("body", body);

  const res = await api(`/groups/${groupId}/materials`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new ApiError(data.message, res.status, data.action);
  }

  return {
    success: true,
    message: "Material criado com sucesso!",
    action: "Já disponível na lista.",
  };
}

export async function deleteGroupMaterial(
  request: Request,
  materialId: number,
  groupId: number,
) {
  const api = apiClient(request);
  const res = await api(`/groups/${groupId}/materials/${materialId}`, {
    method: "DELETE",
  });

  console.log(groupId);
  console.log(materialId);

  if (res.status === 500) {
    throw new ApiError("Ops! Erro no servidor", 500, "Contate o suporte.");
  }

  if (!res.ok) {
    const data = await res.json();
    throw new ApiError(data.message, res.status);
  }

  return {
    success: true,
    message: "Material excluído com sucesso!",
    action: "Removido da lista.",
  };
}
