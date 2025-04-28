import { apiClient, ApiResponse } from "./apiClient";
import { Playlist, PlaylistSong, Song } from "../types";

interface CreatePlaylistRequest {
  name: string;
  description?: string;
  user: number;
  songs?: number[];
  cover_image?: File;
  is_public: boolean;
}

interface UpdatePlaylistRequest {
  name?: string;
  description?: string;
  songs?: number[];
  is_public?: boolean;
  cover_image?: File;
}

interface AddSongRequest {
  playlist: number;
  song_id: number;
}

interface UpdatePlaylistSongRequest {
  position: number;
}

class PlaylistService {
  /**
   * Get all playlists
   */
  async getPlaylists(): Promise<ApiResponse<Playlist[]>> {
    return apiClient.get<Playlist[]>("/playlists/");
  }

  /**
   * Create a new playlist
   */
  async createPlaylist(
    playlistData: CreatePlaylistRequest,
  ): Promise<ApiResponse<Playlist>> {
    const formData = new FormData();

    Object.entries(playlistData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "songs" && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    return apiClient.postForm<Playlist>("/playlists/", formData);
  }

  /**
   * Get playlist by ID
   */
  async getPlaylistById(playlistId: number): Promise<ApiResponse<Playlist>> {
    return apiClient.get<Playlist>(`/playlists/${playlistId}/`);
  }

  /**
   * Update playlist
   */
  async updatePlaylist(
    playlistId: number,
    playlistData: UpdatePlaylistRequest,
  ): Promise<ApiResponse<Playlist>> {
    // If we have a file, use multipart/form-data
    if (playlistData.cover_image) {
      const formData = new FormData();

      Object.entries(playlistData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === "songs" && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      return apiClient.putForm<Playlist>(`/playlists/${playlistId}/`, formData);
    }

    // Otherwise use JSON
    return apiClient.put<Playlist>(`/playlists/${playlistId}/`, playlistData);
  }

  /**
   * Delete playlist
   */
  async deletePlaylist(playlistId: number): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/playlists/${playlistId}/`);
  }

  /**
   * Get all playlist songs
   */
  async getPlaylistSongs(): Promise<ApiResponse<Song[]>> {
    return apiClient.get<Song[]>("/playlist-songs/");
  }

  /**
   * Add song to playlist
   */
  async addSongToPlaylist(data: AddSongRequest): Promise<ApiResponse<Song>> {
    return apiClient.post<Song>("/playlist-songs/", data);
  }

  /**
   * Get playlist song by ID
   */
  async getPlaylistSongById(
    playlistSongId: number,
  ): Promise<ApiResponse<PlaylistSong[]>> {
    return apiClient.get<PlaylistSong[]>(
      `/playlist-songs/playlist/${playlistSongId}/`,
    );
  }

  /**
   * Update playlist song
   */
  async updatePlaylistSong(
    playlistSongId: number,
    data: UpdatePlaylistSongRequest,
  ): Promise<ApiResponse<Song>> {
    return apiClient.put<Song>(`/playlist-songs/${playlistSongId}/`, data);
  }

  /**
   * Delete playlist song
   */
  async deletePlaylistSong(playlistSongId: number): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/playlist-songs/${playlistSongId}/`);
  }

  /**
   * Get playlist by user
   */
  async getPlaylistsByUser(
    userId: number,
  ): Promise<ApiResponse<Playlist[] | null>> {
    return apiClient.get<Playlist[]>(`/playlists/user/${userId}`);
  }
}

export const playlistService = new PlaylistService();
export default playlistService;
