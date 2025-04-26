import { useState, useCallback } from "react";
import { Song, Artist, Album } from "@/types";
import { searchService } from "@/services";
import { ApiResponse } from "@/services/apiClient";

export const useSearch = () => {
  const [songResults, setSongResults] = useState<Song[]>([]);
  const [smartSearchResults, setSmartSearchResults] = useState<Song[]>([]);
  const [artistResults, setArtistResults] = useState<Artist[]>([]);
  const [albumResults, setAlbumResults] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchSongs = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response: ApiResponse<Song[]> =
        await searchService.searchSongs(query);
      if (response.EC === 0 && response.DT) {
        setSongResults(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to search songs");
        setSongResults([]);
        return [];
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      setSongResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const searchArtists = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response: ApiResponse<Artist[]> =
        await searchService.searchArtists(query);
      if (response.EC === 0 && response.DT) {
        setArtistResults(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to search artists");
        setArtistResults([]);
        return [];
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      setArtistResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const searchAlbums = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response: ApiResponse<Album[]> =
        await searchService.searchAlbums(query);
      if (response.EC === 0 && response.DT) {
        setAlbumResults(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to search albums");
        setAlbumResults([]);
        return [];
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      setAlbumResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const smartSearch = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response: ApiResponse<Song[]> =
        await searchService.smartSearch(query);
      if (response.EC === 0 && response.DT) {
        setSmartSearchResults(response.DT);

        return response.DT;
      } else {
        setError(response.EM || "Failed to search");
        setSmartSearchResults([]);
        return [];
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      setSmartSearchResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    songResults,
    smartSearchResults,
    artistResults,
    albumResults,
    loading,
    error,
    searchSongs,
    searchArtists,
    searchAlbums,
    smartSearch,
  };
};

export default useSearch;
