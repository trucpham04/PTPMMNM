import { apiClient, ApiResponse } from "./apiClient";

// Response types
interface AuthResponse {
  token: string;
  user_id: number;
  username: string;
}

// Request types
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

class AuthService {
  /**
   * Register a new user
   */
  async register(
    userData: RegisterRequest,
  ): Promise<ApiResponse<AuthResponse>> {
    const formData = new FormData();

    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    return apiClient.postForm<AuthResponse>("/register/", formData);
  }

  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>("/login/", credentials);

    // If login successful, store the token
    if (response.EC === 0 && response.DT?.token) {
      apiClient.setAuthToken(response.DT.token);
    }

    return response;
  }

  /**
   * Logout user
   */
  logout(): void {
    apiClient.clearAuthToken();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return localStorage.getItem("auth_token") !== null;
  }
}

export const authService = new AuthService();
export default authService;
