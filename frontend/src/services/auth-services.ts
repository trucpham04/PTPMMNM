import { User } from "@/types/types";
import { handleAxiosError } from "@/utils/handle-axios-error";
import axios from "axios";

export async function loginApi(
  username: string,
  password: string,
): Promise<{ user: User | null }> {
  try {
    const { data } = await axios.post("/api/login", { username, password });
    return { user: data.user };
  } catch (error) {
    handleAxiosError(error);
    return { user: null };
  }
}

export async function logoutApi(): Promise<void> {
  try {
    await axios.post("/api/logout");
  } catch (error) {
    handleAxiosError(error);
  }
}
