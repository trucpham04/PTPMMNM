import { apiClient, ApiResponse } from "./apiClient";
import { Collection, CollectionSong } from "../types";

interface CreateCollectionRequest {
  title: string;
  collection_type:
    | "featured"
    | "trending"
    | "new_releases"
    | "genre_based"
    | "mood_based"
    | "seasonal";
  description?: string;
  genres?: number[];
  songs?: number[];
  cover_image?: File;
  is_active: boolean;
}

interface UpdateCollectionRequest {
  title?: string;
  description?: string;
  genres?: number[];
  is_active?: boolean;
  cover_image?: File;
}

interface AddSongToCollectionRequest {
  collection: number;
  song: number;
  position: number;
}

interface UpdateCollectionSongRequest {
  position: number;
}

class CollectionService {
  /**
   * Get all collections
   */
  async getCollections(): Promise<ApiResponse<Collection[]>> {
    return apiClient.get<Collection[]>("/collections/");
  }

  /**
   * Create a new collection
   */
  async createCollection(
    collectionData: CreateCollectionRequest,
  ): Promise<ApiResponse<Collection>> {
    const formData = new FormData();

    Object.entries(collectionData).forEach(([key, value]) => {
      if (value !== undefined) {
        if ((key === "songs" || key === "genres") && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    return apiClient.postForm<Collection>("/collections/", formData);
  }

  /**
   * Get collection by ID
   */
  async getCollectionById(
    collectionId: number,
  ): Promise<ApiResponse<Collection>> {
    return apiClient.get<Collection>(`/collections/${collectionId}/`);
  }

  /**
   * Update collection
   */
  async updateCollection(
    collectionId: number,
    collectionData: UpdateCollectionRequest,
  ): Promise<ApiResponse<Collection>> {
    // If we have a file, use multipart/form-data
    if (collectionData.cover_image) {
      const formData = new FormData();

      Object.entries(collectionData).forEach(([key, value]) => {
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

      return apiClient.putForm<Collection>(
        `/collections/${collectionId}/`,
        formData,
      );
    }

    // Otherwise use JSON
    return apiClient.put<Collection>(
      `/collections/${collectionId}/`,
      collectionData,
    );
  }

  /**
   * Delete collection
   */
  async deleteCollection(collectionId: number): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/collections/${collectionId}/`);
  }

  /**
   * Get all collection songs
   */
  async getCollectionSongs(): Promise<ApiResponse<CollectionSong[]>> {
    return apiClient.get<CollectionSong[]>("/collection-songs/");
  }

  /**
   * Add song to collection
   */
  async addSongToCollection(
    data: AddSongToCollectionRequest,
  ): Promise<ApiResponse<CollectionSong>> {
    return apiClient.post<CollectionSong>("/collection-songs/", data);
  }

  /**
   * Get collection song by ID
   */
  async getCollectionSongById(
    collectionSongId: number,
  ): Promise<ApiResponse<CollectionSong>> {
    return apiClient.get<CollectionSong>(
      `/collection-songs/${collectionSongId}/`,
    );
  }

  /**
   * Update collection song
   */
  async updateCollectionSong(
    collectionSongId: number,
    data: UpdateCollectionSongRequest,
  ): Promise<ApiResponse<CollectionSong>> {
    return apiClient.put<CollectionSong>(
      `/collection-songs/${collectionSongId}/`,
      data,
    );
  }

  /**
   * Delete collection song
   */
  async deleteCollectionSong(
    collectionSongId: number,
  ): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/collection-songs/${collectionSongId}/`);
  }
}

export const collectionService = new CollectionService();
export default collectionService;
