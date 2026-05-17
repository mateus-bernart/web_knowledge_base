import { type LoaderFunctionArgs } from "react-router";
import { apiClient } from "~/services/api";
import { MaterialView, action } from "./material";
import type { Material } from "~/types";

export { action };

export async function loader({ params, request }: LoaderFunctionArgs) {
  const api = apiClient(request);
  const { materialId } = params;

  const [materialRes, userRes] = await Promise.all([
    api(`/materials/${materialId}`),
    api("/user"),
  ]);

  if (!materialRes.ok) throw new Error(`HTTP error: ${materialRes.status}`);

  const material: Material = await materialRes.json();
  const currentUser = userRes.ok ? await userRes.json() : null;

  const canEdit =
    currentUser?.id != null && material.user_id === currentUser.id;

  return { material, canEdit };
}

export default function ForumMaterial({
  loaderData,
}: {
  loaderData: { material: Material; canEdit: boolean };
}) {
  const { material, canEdit } = loaderData;

  return (
    <MaterialView
      material={material}
      canEdit={canEdit}
      backPath="/forum"
      backLabel="Fórum"
      showGroups={false}
      showCreator={true}
    />
  );
}
