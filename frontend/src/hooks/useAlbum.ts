import { useState, useCallback } from "react";
import { albumService } from "../services";
import { Album } from "../types";

interface CreateAlbumRequest {
  title: string;
  artist: number;
  genres?: number[];
  release_date: string; // YYYY-MM-DD
  cover_image?: File;
  description?: string;
  slug: string;
}

interface UpdateAlbumRequest {
  title?: string;
  description?: string;
  cover_image?: File;
  genres?: number[];
  release_date?: string;
}

export const useAlbum = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [album, setAlbum] = useState<Album | null>(null);

  // Get all albums
  const getAlbums = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await albumService.getAlbums();

      if (response.EC === 0 && response.DT) {
        setAlbums(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch albums");
        return [];
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch albums";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create album
  const createAlbum = useCallback(async (albumData: CreateAlbumRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await albumService.createAlbum(albumData);

      if (response.EC === 0 && response.DT) {
        setAlbums((prev) => [...prev, response.DT!]);
        return response.DT;
      } else {
        setError(response.EM || "Failed to create album");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create album";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get album by ID
  const getAlbumById = useCallback(async (albumId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await albumService.getAlbumById(albumId);

      if (response.EC === 0 && response.DT) {
        setAlbum(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch album");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch album";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update album
  const updateAlbum = useCallback(
    async (albumId: number, albumData: UpdateAlbumRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await albumService.updateAlbum(albumId, albumData);

        if (response.EC === 0 && response.DT) {
          setAlbum(response.DT);
          setAlbums((prev) =>
            prev.map((a) => (a.id === albumId ? response.DT! : a)),
          );
          return response.DT;
        } else {
          setError(response.EM || "Failed to update album");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update album";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Delete album
  const deleteAlbum = useCallback(
    async (albumId: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await albumService.deleteAlbum(albumId);

        if (response.EC === 0) {
          setAlbums((prev) => prev.filter((a) => a.id !== albumId));
          if (album && album.id === albumId) {
            setAlbum(null);
          }
          return true;
        } else {
          setError(response.EM || "Failed to delete album");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete album";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [album],
  );

  return {
    loading,
    error,
    albums,
    album,
    getAlbums,
    createAlbum,
    getAlbumById,
    updateAlbum,
    deleteAlbum,
  };
};

export default useAlbum;
