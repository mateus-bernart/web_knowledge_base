// context/ViewContext.tsx
import { createContext, useContext, useState } from "react";

export type ActiveView =
  | "group"
  | "forum"
  | "search"
  | "materials"
  | "personal";

type ViewContextType = {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  activeFolderId: number | null;
  setActiveFolderId: (folderId: number | null) => void;
};

const ViewContext = createContext<ViewContextType | null>(null);

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState<ActiveView>("materials");
  const [activeFolderId, setActiveFolderId] = useState<number | null>(null);

  return (
    <ViewContext.Provider
      value={{ activeView, setActiveView, activeFolderId, setActiveFolderId }}
    >
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const ctx = useContext(ViewContext);
  if (!ctx) throw new Error("useView must be used inside <ViewProvider>");
  return ctx;
}
