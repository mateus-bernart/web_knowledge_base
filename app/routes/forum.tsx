import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { apiClient } from "~/services/api";
import { getPublicMaterials } from "~/services/materials";
import { ApiError } from "~/errors";
import { File } from "lucide-react";
import { MATERIAL_TYPE_LABELS, type ForumMaterial } from "~/types";

export async function loader({ request }: LoaderFunctionArgs) {
  const api = apiClient(request);
  try {
    const materials = await getPublicMaterials(api);
    return { materials: Array.isArray(materials) ? materials : [] };
  } catch (error) {
    if (error instanceof ApiError) {
      return { materials: [], error: error.message };
    }
    return { materials: [], error: "Erro inesperado" };
  }
}

export default function Forum() {
  const { materials } = useLoaderData() as { materials: ForumMaterial[] };
  return <ForumView materials={materials} />;
}

function ForumView({ materials }: { materials: ForumMaterial[] }) {
  if (materials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm">Nenhum material público disponível.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden w-full">
      <h1 className="text-lg font-semibold mb-4">Fórum</h1>
      {materials.map((material) => {
        const material_type_label =
          MATERIAL_TYPE_LABELS[material.material_type.description];

        return (
          <div
            key={material.id}
            className="flex items-start gap-3 p-3 rounded-lg border border-transparent hover:bg-muted/50 hover:border-border transition-colors w-full overflow-hidden"
          >
            <div className="mt-0.5 p-2 rounded-md bg-muted shrink-0">
              <File className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex-1 min-w-0">
              <span className="font-medium text-sm truncate block">
                {material.title}
              </span>

              {material.content && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 break-all">
                  {material.content}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-1.5 mt-2 min-w-0">
                <span className="text-xs text-muted-foreground shrink-0">
                  {material_type_label}
                </span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(material.created_at).toLocaleDateString("pt-BR")}
                </span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {material.user.name} &bull; {material.user.email}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
