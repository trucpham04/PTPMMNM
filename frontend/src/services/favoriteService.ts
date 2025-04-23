import { Album, FavoriteSong, Song } from "@/types";
import apiClient, { ApiResponse } from "./apiClient";

type IsSongFavorited = {
  user_id: number;
  song_id: number;
  is_favorited: boolean;
};

type IsAlbumFavorited = {
  user_id: number;
  album_id: number;
  is_favorited: boolean;
};

class FavoriteService {
  async removeSongFromFavorites(
    user_id: number,
    song_id: number,
  ): Promise<ApiResponse<FavoriteSong>> {
    return apiClient.delete<FavoriteSong>(`/favorites/songs/user/${user_id}/`, {
      data: { song_id },
    });
  }

  async addSongToFavorites(
    user_id: number,
    song_id: number,
  ): Promise<ApiResponse<FavoriteSong>> {
    return apiClient.post<FavoriteSong>(`/favorites/songs/user/${user_id}/`, {
      song: song_id,
    });
  }

  async getFavoriteSongsByUserId(
    user_id: number,
  ): Promise<ApiResponse<Song[]>> {
    return apiClient.get<Song[]>(`/favorites/songs/user/${user_id}/`);
  }

  async getIsSongFavorited(user_id: number, song_id: number) {
    return apiClient.get<IsSongFavorited>(
      `/favorites/songs/user/${user_id}/song/${song_id}`,
    );
  }

  // ALBUM
  async getFavoriteAlbumsByUserId(
    user_id: number,
  ): Promise<ApiResponse<Album[]>> {
    return apiClient.get<Album[]>(`/favorites/album/user/${user_id}/`);
  }

  async addAlbumToFavorites(
    user_id: number,
    album_id: number,
  ): Promise<ApiResponse<Album>> {
    return apiClient.post<Album>(`/favorites/album/user/${user_id}/`, {
      album: album_id,
    });
  }

  async removeAlbumFromFavorites(
    user_id: number,
    album_id: number,
  ): Promise<ApiResponse<any>> {
    return apiClient.delete(`/favorites/album/user/${user_id}/`, {
      data: { album_id },
    });
  }

  async getIsAlbumFavorited(
    user_id: number,
    album_id: number,
  ): Promise<ApiResponse<IsAlbumFavorited>> {
    return apiClient.get<IsAlbumFavorited>(
      `/favorites/album/user/${user_id}/album/${album_id}`,
    );
  }
}

export const favoriteService = new FavoriteService();
export default favoriteService;
