import { apiClient, ApiResponse } from "./apiClient";
import { Album, Artist, ArtistFollow, Song } from "../types";

interface CreateArtistRequest {
  name: string;
  bio?: string;
  image?: File;
  genres?: number[];
  slug: string;
}

interface UpdateArtistRequest {
  name?: string;
  bio?: string;
  image?: File;
  genres?: number[];
  slug?: string;
}

class ArtistService {
  /**
   * Get all artists
   */
  async getArtists(): Promise<ApiResponse<Artist[]>> {
    return apiClient.get<Artist[]>("/artists/");
  }

  /**
   * Create a new artist
   */
  async createArtist(
    artistData: CreateArtistRequest,
  ): Promise<ApiResponse<Artist>> {
    const formData = new FormData();

    Object.entries(artistData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "genres" && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    return apiClient.postForm<Artist>("/artists/", formData);
  }

  /**
   * Get artist by ID
   */
  async getArtistById(artistId: number): Promise<ApiResponse<Artist>> {
    return apiClient.get<Artist>(`/artists/${artistId}/`);
  }

  /**
   * Update artist
   */
  async updateArtist(
    artistId: number,
    artistData: UpdateArtistRequest,
  ): Promise<ApiResponse<Artist>> {
    const formData = new FormData();

    Object.entries(artistData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "genres" && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    return apiClient.putForm<Artist>(`/artists/${artistId}/`, formData);
  }

  /**
   * Delete artist
   */
  async deleteArtist(artistId: number): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/artists/${artistId}/`);
  }

  /**
   * Follow an artist
   */
  async followArtist(artistId: number): Promise<ApiResponse<ArtistFollow>> {
    return apiClient.post<ArtistFollow>(`/artists/${artistId}/follow/`);
  }

  /**
   * Unfollow an artist
   */
  async unfollowArtist(artistId: number): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/artists/${artistId}/follow/`);
  }

  /**
   * Get artist songs
   */
  async getArtistSongs(artistId: number): Promise<ApiResponse<Song[]>> {
    return apiClient.get<Song[]>(`/artists/${artistId}/songs/`);
  }

  /**
   * Get artist albums
   */
  async getArtistAlbums(artistId: number): Promise<ApiResponse<Album[]>> {
    return apiClient.get<Album[]>(`/artists/${artistId}/albums/`);
  }
}

export const artistService = new ArtistService();
export default artistService;
