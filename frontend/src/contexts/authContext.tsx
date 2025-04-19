// AuthContext.tsx
import { createContext, useContext } from "react";
import { useAuth as useAuthHook } from "@/hooks/useAuth"; // Đường dẫn tùy bạn
import type { ReactNode } from "react";

const AuthContext = createContext<ReturnType<typeof useAuthHook> | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuthHook(); // dùng custom hook đã viết

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
