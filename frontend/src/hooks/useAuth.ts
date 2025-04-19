import { useState, useCallback } from "react";
import { authService } from "../services";

// Types
interface AuthResponse {
  token: string;
  user_id: number;
  username: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  profile_picture?: File;
  bio?: string;
  date_of_birth?: string;
  country?: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: number; username: string } | null>(
    null,
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    authService.isAuthenticated(),
  );

  // Register user
  const register = useCallback(
    async (userData: RegisterRequest): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await authService.register(userData);

        if (response.EC === 0 && response.DT) {
          setUser({
            id: response.DT.user_id,
            username: response.DT.username,
          });
          setIsAuthenticated(true);
          return true;
        } else {
          setError(response.EM || "Registration failed");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Registration failed";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Login user
  const login = useCallback(
    async (credentials: LoginRequest): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await authService.login(credentials);

        if (response.EC === 0 && response.DT) {
          setUser({
            id: response.DT.user_id,
            username: response.DT.username,
          });
          setIsAuthenticated(true);
          return true;
        } else {
          setError(response.EM || "Login failed");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Login failed";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Logout user
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    loading,
    error,
    user,
    setUser,
    isAuthenticated,
    register,
    login,
    logout,
  };
};

export default useAuth;
