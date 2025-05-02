import { useState, useCallback } from "react";
import { songService } from "../services";
import { Song, SongRecommendation, ListeningHistory } from "../types";
import { saveAs } from "file-saver";
import axios from "axios";

interface CreateSongRequest {
  title: string;
  artist: number;
  featuring_artists?: number[];
  album?: number;
  genres?: number[];
  composers?: string;
  audio_file: File;
  video_file?: File;
  duration: string;
  lyrics?: string;
  release_date?: string;
  price?: string;
  is_downloadable: boolean;
  is_premium: boolean;
  slug: string;
}

interface UpdateSongRequest {
  title?: string;
  lyrics?: string;
  price?: string;
  is_downloadable?: boolean;
  is_premium?: boolean;
  audio_file?: File;
  video_file?: File;
  featuring_artists?: number[];
  genres?: number[];
}

interface ListeningHistoryRequest {
  user: number;
  song: number;
  listened_duration?: number;
  play_position?: number;
  completed: boolean;
}

export const useSong = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [song, setSong] = useState<Song | null>(null);
  const [recommendations, setRecommendations] = useState<SongRecommendation[]>(
    [],
  );
  const [listeningHistory, setListeningHistory] = useState<ListeningHistory[]>(
    [],
  );

  // Get all songs
  const getSongs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await songService.getSongs();

      if (response.EC === 0 && response.DT) {
        setSongs(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch songs");
        return [];
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch songs";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Download music video
  const downloadMusicVideo = useCallback(
    async (url: string, filename: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(url, {
          responseType: "blob",
        });

        saveAs(response.data, filename);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to download music video";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Create song
  const createSong = useCallback(async (songData: CreateSongRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await songService.createSong(songData);

      if (response.EC === 0 && response.DT) {
        setSongs((prev) => [...prev, response.DT!]);
        return response.DT;
      } else {
        setError(response.EM || "Failed to create song");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create song";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get song by ID
  const getSongById = useCallback(async (songId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await songService.getSongById(songId);

      if (response.EC === 0 && response.DT) {
        setSong(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch song");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch song";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update song
  const updateSong = useCallback(
    async (songId: number, songData: UpdateSongRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await songService.updateSong(songId, songData);

        if (response.EC === 0 && response.DT) {
          setSong(response.DT);
          setSongs((prev) =>
            prev.map((s) => (s.id === songId ? response.DT! : s)),
          );
          return response.DT;
        } else {
          setError(response.EM || "Failed to update song");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update song";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Delete song
  const deleteSong = useCallback(
    async (songId: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await songService.deleteSong(songId);

        if (response.EC === 0) {
          setSongs((prev) => prev.filter((s) => s.id !== songId));
          if (song && song.id === songId) {
            setSong(null);
          }
          return true;
        } else {
          setError(response.EM || "Failed to delete song");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete song";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [song],
  );

  // Increment play count
  const incrementPlayCount = useCallback(
    async (songId: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await songService.incrementPlayCount(songId);

        if (response.EC === 0 && response.DT) {
          // Update song play count in state if it exists
          if (song && song.id === songId) {
            setSong((prev) =>
              prev ? { ...prev, play_count: response.DT!.play_count } : null,
            );
          }

          // Update song in songs array
          setSongs((prev) =>
            prev.map((s) =>
              s.id === songId
                ? { ...s, play_count: response.DT!.play_count }
                : s,
            ),
          );

          return response.DT.play_count;
        } else {
          setError(response.EM || "Failed to increment play count");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to increment play count";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [song],
  );

  // Get top songs
  const getTopSongs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await songService.getTopSongs();
      if (response.EC === 0 && response.DT) {
        setSongs(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch top songs");
        return [];
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch top songs";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get song recommendations
  const getSongRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await songService.getSongRecommendations();

      if (response.EC === 0 && response.DT) {
        setRecommendations(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch recommendations");
        return [];
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch recommendations";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get listening history
  const getListeningHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await songService.getListeningHistory();

      if (response.EC === 0 && response.DT) {
        setListeningHistory(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch listening history");
        return [];
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch listening history";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create listening history entry
  const createListeningHistory = useCallback(
    async (data: ListeningHistoryRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await songService.createListeningHistory(data);

        if (response.EC === 0 && response.DT) {
          setListeningHistory((prev) => [...prev, response.DT!]);
          return response.DT;
        } else {
          setError(response.EM || "Failed to create listening history");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to create listening history";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    songs,
    song,
    downloadMusicVideo,
    recommendations,
    listeningHistory,
    getSongs,
    getTopSongs,
    createSong,
    getSongById,
    updateSong,
    deleteSong,
    incrementPlayCount,
    getSongRecommendations,
    getListeningHistory,
    createListeningHistory,
  };
};

export default useSong;
