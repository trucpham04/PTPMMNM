import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Standard response format from the API
export interface ApiResponse<T> {
  EC: number; // Error code, 0 means success
  EM: string; // Error message or success message
  DT: T | null; // Data returned
}

class ApiClient {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor() {
    // this.baseURL =
    //   process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
    this.baseURL = "http://127.0.0.1:8000/api";
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 seconds
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Add auth token to requests if available
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("auth_token");
        if (token && config.headers) {
          config.headers.Authorization = `Token ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Global response handling
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle specific error codes, authentication errors, etc.
        if (error.response?.status === 401) {
          // Handle unauthorized - clear token and redirect to login
          localStorage.removeItem("auth_token");
          // window.location.href = "/login";
        }
        return Promise.reject(error);
      },
    );
  }

  public setAuthToken(token: string): void {
    localStorage.setItem("auth_token", token);
  }

  public clearAuthToken(): void {
    localStorage.removeItem("auth_token");
  }

  public async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.get(
      url,
      config,
    );
    return response.data;
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.post(
      url,
      data,
      config,
    );
    return response.data;
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.put(
      url,
      data,
      config,
    );
    return response.data;
  }

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.delete(
      url,
      config,
    );
    return response.data;
  }

  // Special method for form data (file uploads, etc.)
  public async postForm<T>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.post(
      url,
      formData,
      {
        ...config,
        headers: {
          ...config?.headers,
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  }

  public async putForm<T>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.put(
      url,
      formData,
      {
        ...config,
        headers: {
          ...config?.headers,
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  }
}

// Create singleton instance
export const apiClient = new ApiClient();
export default apiClient;
