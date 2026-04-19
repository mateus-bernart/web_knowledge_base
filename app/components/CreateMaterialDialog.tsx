import { Upload, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { FLAG_COLORS, type FlagColor, type MaterialType } from "~/types";
import { Form } from "react-router";

type Props = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  groupId: number;
  materialTypes: MaterialType[];
};

export default function CreateMaterialDialog({
  open,
  onOpenChange,
  groupId,
  materialTypes,
}: Props) {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [flagColor, setFlagColor] = useState<FlagColor | undefined>();
  const [selectedTypeId, setSelectedTypeId] = useState<number>(
    materialTypes[0]?.id,
  );

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Material</DialogTitle>
        </DialogHeader>
        <Form
          method="post"
          className="space-y-4"
          onSubmit={() => onOpenChange(false)}
        >
          <input type="hidden" name="material_type_id" value={selectedTypeId} />
          <input type="hidden" name="flag_color" value={flagColor ?? ""} />
          <input type="hidden" name="tags" value={JSON.stringify(tags)} />

          <div className="space-y-2">
            <Label>Título</Label>
            <Input placeholder="Título do material" name="title" required />
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <div className="flex gap-2">
              {materialTypes.map((t) => (
                <Button
                  key={t.id}
                  type="button"
                  variant={selectedTypeId === t.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTypeId(t.id)}
                >
                  {t.description}
                </Button>
              ))}
            </div>
          </div>

          {selectedTypeId !== 1 && (
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center text-muted-foreground">
              <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Upload de arquivo</p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Conteúdo / Notas</Label>
            <Textarea
              placeholder="Escreva suas notas aqui..."
              name="content"
              className="min-h-30"
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <Input
              placeholder={`Digite uma tag e pressione "Enter"`}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setTags(tags.filter((t) => t !== tag))}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Flag</Label>
            <div className="flex gap-2">
              {(Object.entries(FLAG_COLORS) as [FlagColor, string][]).map(
                ([color, hex]) => (
                  <button
                    key={color}
                    type="button"
                    className={`h-6 w-6 rounded-full border-2 transition-transform ${flagColor === color ? "scale-125 border-foreground" : "border-transparent"}`}
                    style={{ backgroundColor: hex }}
                    onClick={() =>
                      setFlagColor(flagColor === color ? undefined : color)
                    }
                  />
                ),
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="checkbox"
              name="is_public"
              className="rounded h-5 w-5"
            />
            <Label htmlFor="is-public" className="text-sm font-normal">
              Público
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Criar</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
