import { useState, useEffect } from "react";
import { Album } from "@/types";
import { getAlbums, getAlbumById } from "@/services/media-services";

export function useAlbums(searchQuery?: string) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const data = await getAlbums(searchQuery);
        setAlbums(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch albums"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [searchQuery]);

  return { albums, loading, error };
}

export function useAlbum(id: number) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        const data = await getAlbumById(id);
        setAlbum(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error(`Failed to fetch album with ID ${id}`),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  return { album, loading, error };
}
