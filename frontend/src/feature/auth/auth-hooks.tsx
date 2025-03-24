import { useAuth } from "@/contexts/auth-context";

export function useLogin() {
  const { login } = useAuth();

  const performLogin = async (username: string, password: string) => {
    try {
      await login(username, password);
    } catch (error) {
      console.log(error);
    }
  };

  return { performLogin };
}

export function useRegister() {
  const { login } = useAuth();

  const performRegister = async (
    username: string,
    password: string,
    name: string,
    dateOfBirth: Date | undefined,
    gender: string,
  ) => {
    try {
      await login(username, password);
    } catch (error) {
      console.log(error);
    }
  };

  return { performRegister };
}
