import { act, useEffect } from "react";
import {
  Form,
  useActionData,
  useFetcher,
  useNavigation,
  type ActionFunctionArgs,
} from "react-router";
import { createGroup } from "~/services/groups";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import type { ActionData } from "~/types";
import { useActionToast } from "~/hooks/useActionToast";
import { useSidebar } from "./ui/sidebar";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGroupDialog({ open, onOpenChange }: Props) {
  const navigation = useNavigation();
  const sidebar = useSidebar();

  const isSubmitting =
    navigation.state === "submitting" && navigation.formAction === "/groups";

  useEffect(() => {
    if (navigation.state === "idle") {
      onOpenChange(false);
      sidebar.setOpenMobile(false);
    }
  }, [navigation.state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Grupo</DialogTitle>
        </DialogHeader>
        <Form method="post" action="/groups" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Nome</Label>
            <Input
              id="group-name"
              placeholder="Nome do grupo de estudo"
              name="name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-desc">Descrição (opcional)</Label>
            <Textarea
              id="group-desc"
              placeholder="Esse grupo é sobre o que?"
              name="description"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
