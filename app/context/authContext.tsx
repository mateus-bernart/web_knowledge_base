// context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getUser } from "~/services/auth";
import type { User } from "~/types";

type AuthContextType = {
  user: User;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({} as User);
  const navigate = useNavigate();

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

  const logout = async () => {
    const res = await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: {},
    });
    setUser({} as User);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
