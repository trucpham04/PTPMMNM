import { useState, useCallback } from "react";
import { Song } from "@/types";
import { favoriteService } from "@/services";
import { ApiResponse } from "@/services/apiClient";

export const useFavoriteSongs = () => {
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getFavoriteSongsByUser = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<Song[]> =
        await favoriteService.getFavoriteSongsByUserId(userId);

      if (response.EC === 0 && response.DT) {
        setFavorites(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch favorite songs");
        return [];
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    favorites,
    loading,
    error,
    getFavoriteSongsByUser,
  };
};

export default useFavoriteSongs;
