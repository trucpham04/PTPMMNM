import { useState, useEffect } from "react";
import { Artist } from "@/types";
import { getArtists, getArtistById } from "@/services/media-services";

export function useArtists(searchQuery?: string) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const data = await getArtists(searchQuery);
        setArtists(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch artists"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [searchQuery]);

  return { artists, loading, error };
}

export function useArtist(id: number) {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        setLoading(true);
        const data = await getArtistById(id);
        setArtist(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error(`Failed to fetch artist with ID ${id}`),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  return { artist, loading, error };
}
