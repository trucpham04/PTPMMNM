import { FavoriteSong, Song } from "@/types";
import apiClient, { ApiResponse } from "./apiClient";

class FavoriteService {
  async getFavoriteSongsByUserId(
    user_id: number,
  ): Promise<ApiResponse<Song[]>> {
    return apiClient.get<Song[]>(`/favorites/songs/user/${user_id}/`);
  }
}

export const favoriteService = new FavoriteService();
export default favoriteService;
