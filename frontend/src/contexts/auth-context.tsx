import { loginApi } from "@/services/auth-services";
import React, { createContext, useContext, useState } from "react";

interface User {
  id: number;
  username: string;
}

type LoginProps = {
  username: string;
  password: string;
};

type RegisterProps = {
  username: string;
  password: string;
  email: string;
  dateOfBirth: string;
  gender: string;
};

interface AuthContextType {
  user: User | null;
  login: (props: LoginProps) => void;
  register: (props: RegisterProps) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (props: LoginProps) => {
    try {
      const data = await loginApi(props.username, props.password);
      setUser(data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const register = async (props: RegisterProps) => {
    try {
      const data = await loginApi(props.username, props.password);
      setUser(data.user);
    } catch (error) {
      console.log(error);
    }
  };
  const logout = () => {
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return authContext;
};
