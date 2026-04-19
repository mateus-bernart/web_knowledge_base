export type User = {
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
  title: string;
  content: string;
  visibility: Visibility;
  tags: Tag[];
  material_type: MaterialType;
  created_at: string;
  updated_at: string;
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
