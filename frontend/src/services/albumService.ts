import { apiClient, ApiResponse } from "./apiClient";
import { Album, Song } from "../types";

interface CreateAlbumRequest {
  title: string;
  artist: number;
  genres?: number[];
  release_date: string; // YYYY-MM-DD
  cover_image?: string | File | null;
  description?: string;
  slug?: string;
}

interface UpdateAlbumRequest {
  title?: string;
  description?: string;
  cover_image?: string | File | null;
  genres?: number[];
  release_date?: string;
}

class AlbumService {
  /**
   * Get all albums
   */
  async getAlbums(): Promise<ApiResponse<Album[]>> {
    return apiClient.get<Album[]>("/albums/");
  }

  /**
   * Get all album songs
   */
  async getAlbumSongs(album_id: number): Promise<ApiResponse<Song[]>> {
    return apiClient.get<Song[]>(`/albums/${album_id}/songs/`);
  }

  /**
   * Create a new album
   */
  async createAlbum(
    albumData: CreateAlbumRequest,
  ): Promise<ApiResponse<Album>> {
    const formData = new FormData();

    Object.entries(albumData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "genres" && Array.isArray(value)) {
          value.forEach((genreId) => {
            formData.append("genre_ids", genreId.toString());
          });
        } else if (key === "artist") {
          formData.append("artist_id", value.toString());
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    return apiClient.postForm<Album>("/albums/", formData);
  }

  /**
   * Get album by ID
   */
  async getAlbumById(albumId: number): Promise<ApiResponse<Album>> {
    return apiClient.get<Album>(`/albums/${albumId}/`);
  }

  /**
   * Update album
   */
  async updateAlbum(
    albumId: number,
    albumData: UpdateAlbumRequest,
  ): Promise<ApiResponse<Album>> {
    const formData = new FormData();

    Object.entries(albumData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "genres" && Array.isArray(value)) {
          value.forEach((genreId) => {
            formData.append("genre_ids", genreId.toString());
          });
        } else if (key === "artist") {
          formData.append("artist_id", value.toString());
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    return apiClient.putForm<Album>(`/albums/${albumId}/`, formData);
  }

  /**
   * Delete album
   */
  async deleteAlbum(albumId: number): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/albums/${albumId}/`);
  }
}

export const albumService = new AlbumService();
export default albumService;
