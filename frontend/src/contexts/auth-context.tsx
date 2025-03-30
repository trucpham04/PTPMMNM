import { loginApi, logoutApi } from "@/services/auth-services";
import {
  AuthContextType,
  LoginProps,
  RegisterProps,
  User,
} from "@/types/types";
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  async function login(props: LoginProps): Promise<boolean> {
    try {
      // Destructure user from the response
      const { user } = await loginApi(props.username, props.password);

      if (user) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        // Optionally, handle the case when login fails (e.g., wrong credentials)
        console.error("Login failed: No user returned");
        return false;
        // Show error message to the user, e.g., set a state for error message
      }

      return true;
    } catch (error) {
      console.error("An error occurred during login:", error);
      // Optionally, update error state to display a user-friendly message
      return false;
    }
  }

  const register = async (props: RegisterProps) => {
    try {
      const data = await loginApi(props.username, props.password);
      setUser(data.user);
    } catch (error) {
      console.log(error);
    }
  };
  async function logout() {
    try {
      await logoutApi();
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  }
  return (
    <AuthContext.Provider value={{ user, login, register, logout, setUser }}>
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
