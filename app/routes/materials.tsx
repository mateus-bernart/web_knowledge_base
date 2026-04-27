import {
  Link,
  useActionData,
  useFetcher,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import type { Route } from "./+types/materials";
import { apiClient } from "~/services/api";
import { File, Globe, Lock, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import CreateMaterialDialog from "~/components/CreateMaterialDialog";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import {
  createGroupMaterial,
  createMaterial,
  deleteGroupMaterial,
  deleteMaterial,
  getMaterials,
  getMaterialTypes,
} from "~/services/materials";
import type { Material, MaterialType } from "~/types";
import { ApiError } from "~/errors";
import { useActionToast } from "~/hooks/useActionToast";
import { Badge } from "~/components/ui/badge";
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

export async function loader({ request, params }: LoaderFunctionArgs) {
  const api = apiClient(request);
  const groupId = Number(params.groupId);

  try {
    const [materials, types] = await Promise.all([
      getMaterials(api, groupId),
      getMaterialTypes(api),
    ]);

    return {
      materials: Array.isArray(materials) ? materials : [],
      materialTypes: Array.isArray(types) ? types : [],
      groupId,
    };
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

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const method = (formData.get("_method") as string) ?? request.method;
  const groupId = Number(params.groupId);
  const materialId = Number(formData.get("id"));

  let response;

  try {
    if (method === "POST") {
      if (groupId) {
        response = await createGroupMaterial(request, formData, groupId);
      } else {
        response = await createMaterial(request, formData);
      }
    } else if (method === "DELETE") {
      if (groupId) {
        response = await deleteGroupMaterial(request, materialId, groupId);
      } else {
        response = await deleteMaterial(request, materialId);
      }
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
  if (!loaderData.materials) {
    return (
      <div>
        <p>{loaderData.message}</p>
        <p>{loaderData.action}</p>
      </div>
    );
  }

  return (
    <MaterialsView
      materials={loaderData.materials}
      materialTypes={loaderData.materialTypes}
      groupId={loaderData?.groupId}
    />
  );
}

export function MaterialsView({
  materials,
  materialTypes,
  groupId,
}: {
  materials: Material[];
  materialTypes: MaterialType[];
  groupId?: number;
}) {
  const [localSearch, setLocalSearch] = useState("");
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const actionData = useActionData<typeof action>();

  const fetcher = useFetcher();

  useActionToast(actionData, fetcher.data);

  return (
    <div className="overflow-x-hidden w-full">
      <CreateMaterialDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        groupId={groupId}
        materialTypes={materialTypes}
      />
      {/* Search row */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Procurar materiais..."
            className="pl-9 w-full"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          size="sm"
          className="shrink-0"
        >
          <Plus className="h-4 w-4 mr-1" /> Novo
        </Button>
      </div>

      {/* List */}
      {materials?.map((material: Material) => (
        <div
          key={material.id}
          className="relative group flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border w-full overflow-hidden"
        >
          <Link to={`/materials/${material.id}`} className="absolute inset-0" />

          <div className="mt-0.5 p-2 rounded-md bg-muted shrink-0">
            <File className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-medium text-sm truncate block min-w-0 overflow-hidden">
                {material.title}
              </span>
              {material.visibility.description === "public" ? (
                <Globe className="h-3 w-3 text-muted-foreground shrink-0" />
              ) : (
                <Lock className="h-3 w-3 text-muted-foreground shrink-0" />
              )}
            </div>

            {material.content && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 break-all">
                {material.content}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-1.5 mt-2 min-w-0">
              <span className="text-xs text-muted-foreground shrink-0">
                {material.material_type.description}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground shrink-0">
                {new Date(material.created_at).toLocaleDateString()}
              </span>
              {material.tags.length > 0 && (
                <>
                  <span className="text-xs text-muted-foreground">·</span>
                  {material.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 shrink-0"
                    >
                      {tag.description}
                    </Badge>
                  ))}
                  {material.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground shrink-0">
                      +{material.tags.length - 3}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

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
                <AlertDialogTitle>Excluir material?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex items-center">
                <fetcher.Form
                  method="POST"
                  action={
                    groupId ? `/groups/${groupId}/materials` : `/materials`
                  }
                  className="flex w-full gap-2"
                >
                  <input type="hidden" name="id" value={material.id} />
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
      ))}
    </div>
  );
}
