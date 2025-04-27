import { useState, useCallback } from "react";
import { Album, Song } from "@/types";
import { favoriteService } from "@/services";
import { ApiResponse } from "@/services/apiClient";
import { useFavoriteContext } from "@/contexts/favoriteContext";

export const useFavorite = () => {
  // const [favorites, setFavorites] = useState<Song[]>([]);
  // const [favoriteAlbums, setFavoriteAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [isAlbumFavorited, setIsAlbumFavorited] = useState<boolean>(false);

  const { setFavoriteAlbums, setFavoriteSongs } = useFavoriteContext();

  const getFavoriteSongsByUser = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<Song[]> =
        await favoriteService.getFavoriteSongsByUserId(userId);

      if (response.EC === 0 && response.DT) {
        setFavoriteSongs(response.DT);

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

  const getIsSongFavorited = useCallback(
    async (userId: number, songId: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await favoriteService.getIsSongFavorited(
          userId,
          songId,
        );
        if (response.EC === 0 && response.DT) {
          setIsFavorited(response.DT.is_favorited);

          return response.DT.is_favorited;
        } else {
          setError(response.EM || "Failed to fetch favorite status");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const addSongToFavorites = useCallback(
    async (userId: number, songId: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await favoriteService.addSongToFavorites(
          userId,
          songId,
        );
        if (response.EC === 0 && response.DT) {
          await getFavoriteSongsByUser(userId);
          setIsFavorited(true);
        } else {
          setError(response.EM || "Failed to add to favorites");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const removeSongFromFavorites = useCallback(
    async (userId: number, songId: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await favoriteService.removeSongFromFavorites(
          userId,
          songId,
        );
        if (response.EC === 0) {
          await getFavoriteSongsByUser(userId);
          setIsFavorited(false);
        } else {
          setError(response.EM || "Failed to remove from favorites");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getFavoriteAlbumsByUser = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<Album[]> =
        await favoriteService.getFavoriteAlbumsByUserId(userId);
      if (response.EC === 0 && response.DT) {
        setFavoriteAlbums(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch favorite albums");
        return [];
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getIsAlbumFavorited = useCallback(
    async (userId: number, albumId: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await favoriteService.getIsAlbumFavorited(
          userId,
          albumId,
        );
        if (response.EC === 0 && response.DT) {
          setIsAlbumFavorited(response.DT.is_favorited);
          return response.DT.is_favorited;
        } else {
          setError(response.EM || "Failed to fetch album favorite status");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const addAlbumToFavorites = useCallback(
    async (userId: number, albumId: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await favoriteService.addAlbumToFavorites(
          userId,
          albumId,
        );
        if (response.EC === 0 && response.DT) {
          await getFavoriteAlbumsByUser(userId);
          setIsAlbumFavorited(true);
        } else {
          setError(response.EM || "Failed to add album to favorites");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const removeAlbumFromFavorites = useCallback(
    async (userId: number, albumId: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await favoriteService.removeAlbumFromFavorites(
          userId,
          albumId,
        );
        if (response.EC === 0) {
          await getFavoriteAlbumsByUser(userId);
          setIsAlbumFavorited(false);
        } else {
          setError(response.EM || "Failed to remove album from favorites");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    isFavorited,
    isAlbumFavorited,
    loading,
    error,
    getFavoriteSongsByUser,
    getIsSongFavorited,
    addSongToFavorites,
    removeSongFromFavorites,
    getFavoriteAlbumsByUser,
    getIsAlbumFavorited,
    addAlbumToFavorites,
    removeAlbumFromFavorites,
  };
};

export default useFavorite;
