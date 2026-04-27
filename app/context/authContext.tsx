import { createContext, useContext, useEffect, useState } from "react";
import { getUser } from "~/services/auth";
import type { User } from "~/types";

type AuthContextType = {
  user: User;
};

const url = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({} as User);

  useEffect(() => {
    const hasToken = document.cookie.includes("token=");
    if (!hasToken) return;

    const loadData = async () => {
      const { user, error } = await getUser();
      if (error) return;
      setUser(user);
    };

    loadData();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
