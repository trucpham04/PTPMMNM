import { apiClient, ApiResponse } from "./apiClient";
import { Genre } from "../types";

interface CreateGenreRequest {
  name: string;
  description?: string;
  slug?: string;
}

interface UpdateGenreRequest {
  name?: string;
  description?: string;
  slug?: string;
}

class GenreService {
  /**
   * Get all genres
   */
  async getGenres(): Promise<ApiResponse<Genre[]>> {
    return apiClient.get<Genre[]>("/genres/");
  }

  /**
   * Create a new genre
   */
  async createGenre(
    genreData: CreateGenreRequest,
  ): Promise<ApiResponse<Genre>> {
    return apiClient.post<Genre>("/genres/", genreData);
  }

  /**
   * Get genre by ID
   */
  async getGenreById(genreId: number): Promise<ApiResponse<Genre>> {
    return apiClient.get<Genre>(`/genres/${genreId}/`);
  }

  /**
   * Update genre
   */
  async updateGenre(
    genreId: number,
    genreData: UpdateGenreRequest,
  ): Promise<ApiResponse<Genre>> {
    return apiClient.put<Genre>(`/genres/${genreId}/`, genreData);
  }

  /**
   * Delete genre
   */
  async deleteGenre(genreId: number): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/genres/${genreId}/`);
  }
}

export const genreService = new GenreService();
export default genreService;
