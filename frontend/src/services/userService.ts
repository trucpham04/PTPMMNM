import { apiClient, ApiResponse } from "./apiClient";
import { User, UserFollow } from "../types";

class UserService {
  /**
   * Get all users
   */
  async getUsers(): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>("/users/");
  }

  /**
   * Create a new user (admin only)
   */
  async createUser(
    userData: Partial<User>,
    profilePicture?: File,
  ): Promise<ApiResponse<User>> {
    const formData = new FormData();

    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }

    return apiClient.postForm<User>("/users/", formData);
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: number): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`/users/${userId}/`);
  }

  /**
   * Update user
   */
  async updateUser(
    userId: number,
    userData: Partial<User>,
    profilePicture?: File,
  ): Promise<ApiResponse<User>> {
    // If we have a file, use multipart/form-data
    if (profilePicture) {
      const formData = new FormData();

      Object.entries(userData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      formData.append("profile_picture", profilePicture);

      return apiClient.putForm<User>(`/users/${userId}/`, formData);
    }

    // Otherwise use JSON
    return apiClient.put<User>(`/users/${userId}/`, userData);
  }

  /**
   * Delete user
   */
  async deleteUser(userId: number): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/users/${userId}/`);
  }

  /**
   * Get user by custom endpoint
   */
  async getUserByIdCustom(userId: number): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`/api/users/${userId}/`);
  }

  /**
   * Follow a user
   */
  async followUser(userId: number): Promise<ApiResponse<null>> {
    return apiClient.post<null>(`/follow/${userId}/`);
  }

  /**
   * Unfollow a user
   */
  async unfollowUser(userId: number): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/follow/${userId}/`);
  }

  /**
   * Get followers of a user
   */
  async getUserFollowers(userId: number): Promise<ApiResponse<UserFollow[]>> {
    return apiClient.get<UserFollow[]>(`/users/${userId}/followers/`);
  }

  /**
   * Get users that a user is following
   */
  async getUserFollowing(userId: number): Promise<ApiResponse<UserFollow[]>> {
    return apiClient.get<UserFollow[]>(`/users/${userId}/following/`);
  }
}

export const userService = new UserService();
export default userService;
