// routes/material.tsx
import { Link, useFetcher, useLoaderData } from "react-router";
import type { Route } from "./+types/material";
import {
  ArrowLeft,
  FileText,
  Globe,
  Lock,
  Pencil,
  Plus,
  X,
} from "lucide-react";
import { apiClient } from "~/services/api";
import { ApiError } from "~/errors";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useActionToast } from "~/hooks/useActionToast";
import {
  addMaterialTag,
  deleteMaterialTag,
  updateMaterial,
} from "~/services/materials";
import type { Material } from "~/types";

type Tag = { id: number; description: string };

// ─── Loader ────────────────────────────────────────────────────────────────

export async function loader({ params, request }: Route.LoaderArgs) {
  const api = apiClient(request);
  const res = await api(`/materials/${params.materialId}`);

  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

  const material: Material = await res.json();
  return { material };
}

// ─── Action ────────────────────────────────────────────────────────────────

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const method = formData.get("_method") as string;
  const id = Number(params.materialId);
  let response;

  try {
    if (method === "PATCH") {
      response = await updateMaterial(request, formData, id);
    }

    if (method === "ADD_TAG") {
      response = await addMaterialTag(request, formData, id);
    }

    if (method === "DELETE_TAG") {
      response = await deleteMaterialTag(request, formData, id);
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, hint: error.action };
    }

    return {
      success: false,
      message: "Erro inesperado.",
      hint: "Tente novamente.",
    };
  }
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function Material({ loaderData }: Route.ComponentProps) {
  const { material } = loaderData as { material: Material };

  const contentFetcher = useFetcher();
  const addTagFetcher = useFetcher();
  const removeTagFetcher = useFetcher();

  useActionToast(
    contentFetcher.data,
    addTagFetcher.data,
    removeTagFetcher.data,
  );

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(material.title);
  const [content, setContent] = useState(material.content);
  const [tags, setTags] = useState<Tag[]>(material.tags);
  const [tagInput, setTagInput] = useState("");

  function cancelEdit() {
    setTitle(material.title);
    setContent(material.content);
    setTags(material.tags);
    setEditing(false);
  }

  //captura o state e manda pro action com o fetcher. "_method" somente identificador.
  function saveContent() {
    contentFetcher.submit(
      { _method: "PATCH", title, content },
      { method: "post", action: `/materials/${material.id}` },
    );
    setEditing(false);
  }

  function addTag() {
    const description = tagInput.trim();
    if (!description) return;
    addTagFetcher.submit(
      { _method: "ADD_TAG", description },
      { method: "post", action: `/materials/${material.id}` },
    );
    setTags((prev) => [...prev, { id: Date.now(), description }]);
    setTagInput("");
  }

  function removeTag(id: number) {
    removeTagFetcher.submit(
      { _method: "DELETE_TAG", tagId: String(id) },
      { method: "post", action: `/materials/${material.id}` },
    );
    setTags((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <Link
          to="/materials"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Materials
        </Link>

        <div className="flex gap-2">
          {editing ? (
            <>
              <Button
                size="sm"
                onClick={saveContent}
                disabled={contentFetcher.state !== "idle"}
              >
                {contentFetcher.state !== "idle" ? "Salvando..." : "Salvar"}
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
        </div>
      </div>

      {/* Title + meta */}
      <div className="flex items-start gap-3 mb-5">
        <div className="mt-0.5 p-2.5 rounded-md bg-muted border border-border shrink-0">
          <FileText className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          {editing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground"
            />
          ) : (
            <h1 className="text-xl font-medium text-foreground">{title}</h1>
          )}
          <div className="flex items-center gap-2 mt-1.5 text-sm text-muted-foreground flex-wrap">
            <Badge variant="outline" className="text-xs">
              {material.material_type.description}
            </Badge>
            <span>·</span>
            {material.visibility.description === "public" ? (
              <Globe className="h-3.5 w-3.5" />
            ) : (
              <Lock className="h-3.5 w-3.5" />
            )}
            <span>{material.visibility.description}</span>
            <span>·</span>
            <span>
              {new Date(material.created_at).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>
      </div>

      <div className="h-px bg-border my-5" />

      {/* Content */}
      <div className="mb-5">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
          Conteúdo
        </p>
        {editing ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-40 resize-y text-sm leading-relaxed"
          />
        ) : (
          <div className="bg-muted rounded-md p-4 text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="mb-5">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
          Tags
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              className="text-xs font-normal gap-1 pr-1"
            >
              {tag.description}
              {editing && (
                <button
                  onClick={() => removeTag(tag.id)}
                  className="ml-0.5 hover:text-destructive transition-colors"
                  disabled={removeTagFetcher.state !== "idle"}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>

        {editing && (
          <div className="flex gap-2 mt-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTag()}
              placeholder="Nova tag..."
              className="max-w-45 h-8 text-sm rounded-full"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={addTag}
              className="h-8 rounded-full"
              disabled={addTagFetcher.state !== "idle"}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Adicionar
            </Button>
          </div>
        )}
      </div>

      <div className="h-px bg-border my-5" />

      {/* Meta */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted rounded-md p-3">
          <p className="text-xs text-muted-foreground mb-1">Criado em</p>
          <p className="text-sm font-medium">
            {new Date(material.created_at).toLocaleDateString("pt-BR")}
          </p>
        </div>
        <div className="bg-muted rounded-md p-3">
          <p className="text-xs text-muted-foreground mb-1">Atualizado em</p>
          <p className="text-sm font-medium">
            {material.updated_at
              ? new Date(material.updated_at).toLocaleDateString("pt-BR")
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
