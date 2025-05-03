import { useState, useCallback } from "react";
import { genreService } from "../services";
import { Genre } from "../types";

interface CreateGenreRequest {
  name: string;
  description?: string;
  slug?: string;
}

interface UpdateGenreRequest {
  name?: string;
  description?: string;
  slug?: string;
}

export const useGenre = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genre, setGenre] = useState<Genre | null>(null);

  // Get all genres
  const getGenres = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await genreService.getGenres();

      if (response.EC === 0 && response.DT) {
        setGenres(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch genres");
        return [];
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch genres";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create genre
  const createGenre = useCallback(async (genreData: CreateGenreRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await genreService.createGenre(genreData);

      if (response.EC === 0 && response.DT) {
        setGenres((prev) => [...prev, response.DT!]);
        return response.DT;
      } else {
        setError(response.EM || "Failed to create genre");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create genre";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get genre by ID
  const getGenreById = useCallback(async (genreId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await genreService.getGenreById(genreId);

      if (response.EC === 0 && response.DT) {
        setGenre(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch genre");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch genre";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update genre
  const updateGenre = useCallback(
    async (genreId: number, genreData: UpdateGenreRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await genreService.updateGenre(genreId, genreData);

        if (response.EC === 0 && response.DT) {
          setGenre(response.DT);
          setGenres((prev) =>
            prev.map((g) => (g.id === genreId ? response.DT! : g)),
          );
          return response.DT;
        } else {
          setError(response.EM || "Failed to update genre");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update genre";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Delete genre
  const deleteGenre = useCallback(
    async (genreId: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await genreService.deleteGenre(genreId);

        if (response.EC === 0) {
          setGenres((prev) => prev.filter((g) => g.id !== genreId));
          if (genre && genre.id === genreId) {
            setGenre(null);
          }
          return true;
        } else {
          setError(response.EM || "Failed to delete genre");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete genre";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [genre],
  );

  return {
    loading,
    error,
    genres,
    genre,
    getGenres,
    createGenre,
    getGenreById,
    updateGenre,
    deleteGenre,
  };
};

export default useGenre;
