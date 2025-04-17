import { useState, useCallback } from "react";
import { artistService } from "../services";
import { Artist, ArtistFollow } from "../types";

interface CreateArtistRequest {
  name: string;
  bio?: string;
  image?: File;
  genres?: number[];
  slug: string;
}

interface UpdateArtistRequest {
  name?: string;
  bio?: string;
  image?: File;
  genres?: number[];
  slug?: string;
}

export const useArtist = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artist, setArtist] = useState<Artist | null>(null);

  // Get all artists
  const getArtists = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await artistService.getArtists();

      if (response.EC === 0 && response.DT) {
        setArtists(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch artists");
        return [];
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch artists";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create artist
  const createArtist = useCallback(async (artistData: CreateArtistRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await artistService.createArtist(artistData);

      if (response.EC === 0 && response.DT) {
        setArtists((prev) => [...prev, response.DT!]);
        return response.DT;
      } else {
        setError(response.EM || "Failed to create artist");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create artist";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get artist by ID
  const getArtistById = useCallback(async (artistId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await artistService.getArtistById(artistId);

      if (response.EC === 0 && response.DT) {
        setArtist(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch artist");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch artist";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update artist
  const updateArtist = useCallback(
    async (artistId: number, artistData: UpdateArtistRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await artistService.updateArtist(artistId, artistData);

        if (response.EC === 0 && response.DT) {
          setArtist(response.DT);
          setArtists((prev) =>
            prev.map((a) => (a.id === artistId ? response.DT! : a)),
          );
          return response.DT;
        } else {
          setError(response.EM || "Failed to update artist");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update artist";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Delete artist
  const deleteArtist = useCallback(
    async (artistId: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await artistService.deleteArtist(artistId);

        if (response.EC === 0) {
          setArtists((prev) => prev.filter((a) => a.id !== artistId));
          if (artist && artist.id === artistId) {
            setArtist(null);
          }
          return true;
        } else {
          setError(response.EM || "Failed to delete artist");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete artist";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [artist],
  );

  // Follow an artist
  const followArtist = useCallback(async (artistId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await artistService.followArtist(artistId);

      if (response.EC === 0 && response.DT) {
        return response.DT;
      } else {
        setError(response.EM || "Failed to follow artist");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to follow artist";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Unfollow an artist
  const unfollowArtist = useCallback(async (artistId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await artistService.unfollowArtist(artistId);

      if (response.EC === 0) {
        return true;
      } else {
        setError(response.EM || "Failed to unfollow artist");
        return false;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to unfollow artist";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    artists,
    artist,
    getArtists,
    createArtist,
    getArtistById,
    updateArtist,
    deleteArtist,
    followArtist,
    unfollowArtist,
  };
};

export default useArtist;
