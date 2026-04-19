import {
  Link,
  useActionData,
  useFetcher,
  type ActionFunctionArgs,
} from "react-router";
import type { Route } from "./+types/materials";
import { apiClient } from "~/services/api";
import { File, Globe, Lock, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import CreateMaterialDialog from "~/components/CreateMaterialDialog";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { createMaterial, deleteMaterial } from "~/services/materials";
import type { Material, MaterialType } from "~/types";
import { ApiError } from "~/errors";
import { useActionToast } from "~/hooks/useActionToast";
import { Badge } from "~/components/ui/badge";

export async function loader({ request }: Route.LoaderArgs) {
  const api = apiClient(request);

  //extrair para funcao getData() ou algo assim
  const [materialsRes, typesRes] = await Promise.all([
    api("/materials"),
    api("/material-types"),
  ]);

  //return erro caso !res.ok

  const materials = await materialsRes.json();
  const types = await typesRes.json();

  return {
    materials: Array.isArray(materials) ? materials : [],
    materialTypes: Array.isArray(types) ? types : [],
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const method = (formData.get("_method") as string) ?? request.method;
  let response;

  try {
    if (method === "POST") {
      response = await createMaterial(request, formData);
    } else if (method === "DELETE") {
      const id = Number(formData.get("id"));
      response = await deleteMaterial(request, id);
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

export default function Materials({ loaderData }: Route.ComponentProps) {
  return (
    <MaterialsView
      materials={loaderData.materials}
      materialTypes={loaderData.materialTypes}
    />
  );
}

export function MaterialsView({
  materials,
  materialTypes,
}: {
  materials: Material[];
  materialTypes: MaterialType[];
}) {
  const [localSearch, setLocalSearch] = useState("");
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const actionData = useActionData<typeof action>();

  const fetcher = useFetcher();

  useActionToast(actionData, fetcher.data);

  const groupId = 1;

  console.log(materials);

  return (
    <div>
      <CreateMaterialDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        groupId={groupId}
        materialTypes={materialTypes}
      />
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-sm min-w-50">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Procurar materiais..."
            className="pl-9"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => setCreateOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Novo
        </Button>
      </div>

      {materials?.map((material: Material) => {
        return (
          <div className="relative group flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
            <Link
              to={`/materials/${material.id}`}
              className="absolute inset-0"
            />

            <div className="mt-0.5 p-2 rounded-md bg-muted">
              {/* aplicar diferenciacao de icone por tipo */}
              <File className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">
                  {material.title}
                </span>
                {material.visibility.description === "public" ? (
                  <Globe className="h-3 w-3 text-muted-foreground shrink-0" />
                ) : (
                  <Lock className="h-3 w-3 text-muted-foreground shrink-0" />
                )}
              </div>

              {material.content && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {material.content}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-xs text-muted-foreground">
                  {material.material_type.description}
                </span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(material.created_at).toLocaleDateString()}
                </span>
                {material.tags.length > 0 && (
                  <>
                    <span className="text-xs text-muted-foreground">·</span>
                    {material.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="text-[10px] px-1.5 py-0"
                      >
                        {tag.description}
                      </Badge>
                    ))}
                    {material.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{material.tags.length - 3}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
            <fetcher.Form
              method="POST"
              action="/materials"
              className="relative z-10 shrink-0"
            >
              <input type="hidden" name="id" value={material.id} />
              <input type="hidden" name="_method" value="DELETE" />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 transition-opacity shrink-0"
                type="submit"
              >
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </fetcher.Form>
          </div>
        );
      })}
    </div>
  );
}
