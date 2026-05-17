import { type LoaderFunctionArgs } from "react-router";
import { apiClient } from "~/services/api";
import { MaterialView, action } from "./material";
import type { Material, Group } from "~/types";

export { action };

export async function loader({ params, request }: LoaderFunctionArgs) {
  const api = apiClient(request);
  const { groupId, materialId } = params;

  const [materialRes, groupRes, userRes] = await Promise.all([
    api(`/materials/${materialId}`),
    api(`/groups/${groupId}`),
    api("/user"),
  ]);

  if (!materialRes.ok) throw new Error(`HTTP error: ${materialRes.status}`);

  const material: Material = await materialRes.json();
  const group: Group = groupRes.ok ? await groupRes.json() : { id: 0, name: "", description: "" };
  const currentUser = userRes.ok ? await userRes.json() : null;

  const isGroupAdmin = group.current_user_role === "admin";
  const isMaterialOwner = currentUser?.id != null && material.user_id === currentUser.id;
  const canEdit = isGroupAdmin || isMaterialOwner;

  return {
    material,
    canEdit,
    groupId: Number(groupId),
    groupName: group.name,
  };
}

export default function GroupMaterial({
  loaderData,
}: {
  loaderData: {
    material: Material;
    canEdit: boolean;
    groupId: number;
    groupName: string;
  };
}) {
  const { material, canEdit, groupId, groupName } = loaderData;

  return (
    <MaterialView
      material={material}
      canEdit={canEdit}
      backPath={`/groups/${groupId}/materials`}
      backLabel={groupName || "Grupo"}
      showGroups={false}
    />
  );
}
