import { useState, useEffect, useCallback } from "react";
import { Album } from "@/types";
import {
  getUserSavedAlbums,
  saveAlbum,
  removeAlbum,
  checkSavedAlbum,
} from "@/services/user-albums-services";
import { useAuth } from "@/contexts/auth-context";

export function useUserAlbums() {
  const [savedAlbums, setSavedAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchSavedAlbums = useCallback(async () => {
    if (!user) {
      setSavedAlbums([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const albums = await getUserSavedAlbums();
      setSavedAlbums(albums);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch saved albums"),
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSavedAlbums();
  }, [fetchSavedAlbums]);

  const handleSaveAlbum = async (albumId: number) => {
    if (!user) return;

    try {
      await saveAlbum(albumId);
      fetchSavedAlbums();
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to save album"));
    }
  };

  const handleRemoveAlbum = async (albumId: number) => {
    if (!user) return;

    try {
      await removeAlbum(albumId);
      // Update local state immediately for better UX
      setSavedAlbums((prev) => prev.filter((album) => album.id !== albumId));
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to remove album"),
      );
    }
  };

  const isAlbumSaved = async (albumId: number): Promise<boolean> => {
    if (!user) return false;

    try {
      return await checkSavedAlbum(albumId);
    } catch (err) {
      console.error("Failed to check album saved status:", err);
      return false;
    }
  };

  return {
    savedAlbums,
    loading,
    error,
    saveAlbum: handleSaveAlbum,
    removeAlbum: handleRemoveAlbum,
    isAlbumSaved,
    refreshSavedAlbums: fetchSavedAlbums,
  };
}
