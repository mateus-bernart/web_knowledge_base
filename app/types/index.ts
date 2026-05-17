export type Toast =
  | {
      success: boolean;
      message?: string;
      action?: string;
    }
  | undefined;

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ActionData = {
  success: boolean;
  message: string;
  action: string;
  method: Method;
};

export type User = {
  id: number;
  username: string;
  email: string;
  token: string;
};

export const FLAG_COLORS: Record<FlagColor, string> = {
  red: "#EF4444",
  orange: "#F97316",
  yellow: "#EAB308",
  green: "#22C55E",
  blue: "#3B82F6",
  purple: "#A855F7",
};

export type FlagColor =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple";

export type Material = {
  id: number;
  user_id: number;
  title: string;
  content: string;
  visibility: Visibility;
  tags: Tag[];
  material_type: MaterialType;
  groups?: { id: number; name: string }[];
  user?: { name: string; email: string };
  created_at: string;
  updated_at: string;
};

export const VISIBILITY_LABELS: Record<string, string> = {
  public: "Público",
  private: "Privado",
};

export const MATERIAL_TYPE_LABELS: Record<string, string> = {
  note: "Anotação",
  file: "Arquivo",
  video: "Vídeo",
  // add new types here, no logic changes needed
};

export type MaterialType = {
  id: number;
  description: string;
};

type Tag = {
  id: number;
  description: string;
};

type Visibility = {
  id: number;
  description: "public" | "private";
};

export type ForumMaterial = {
  id: number;
  title: string;
  content: string;
  material_type: MaterialType;
  visibility: Visibility;
  created_at: string;
  updated_at: string;
  user: { name: string; email: string };
};

export type GroupMember = {
  id: number;
  username: string;
  name: string;
  email: string;
  pivot: { role: "admin" | "student" };
};

export type Group = {
  id: number;
  name: string;
  description: string;
  members?: GroupMember[];
  current_user_role?: "admin" | "student";
};
