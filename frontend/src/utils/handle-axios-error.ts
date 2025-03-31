// utils/axiosErrorHandler.ts
import axios from "axios";

export function handleAxiosError(error: unknown): void {
  if (axios.isAxiosError(error)) {
    console.error("Error message:", error.message);
    if (error.response) {
      // Request made and server responded
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      // Request made but no response received
      console.error("No response received:", error.request);
    } else {
      // Something else triggered the error
      console.error("Error:", error.message);
    }
  } else {
    console.error("Unexpected error:", error);
  }
}
