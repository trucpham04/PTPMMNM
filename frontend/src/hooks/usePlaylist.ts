import { useState, useCallback } from "react";
import { playlistService } from "../services";
import { Playlist, PlaylistSong, Song } from "../types";
import { useFavoriteContext } from "@/contexts/favoriteContext";

interface CreatePlaylistRequest {
  name: string;
  description?: string;
  user: number;
  songs?: number[];
  cover_image?: File;
  is_public: boolean;
}

interface UpdatePlaylistRequest {
  name?: string;
  description?: string;
  songs?: number[];
  is_public?: boolean;
  cover_image?: File;
}

interface AddSongRequest {
  playlist: number;
  song: number;
  position: number;
}

interface UpdatePlaylistSongRequest {
  position: number;
}

export const usePlaylist = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [playlistSong, setPlaylistSong] = useState<Song | null>(null);

  const { setUserPlaylists } = useFavoriteContext();

  // Get all playlists
  const getPlaylists = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await playlistService.getPlaylists();

      if (response.EC === 0 && response.DT) {
        setPlaylists(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch playlists");
        return [];
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch playlists";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create playlist
  const createPlaylist = useCallback(
    async (playlistData: CreatePlaylistRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await playlistService.createPlaylist(playlistData);

        if (response.EC === 0 && response.DT) {
          setPlaylists((prev) => [...prev, response.DT!]);
          return response.DT;
        } else {
          setError(response.EM || "Failed to create playlist");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create playlist";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Get playlist by ID
  const getPlaylistById = useCallback(async (playlistId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await playlistService.getPlaylistById(playlistId);

      if (response.EC === 0 && response.DT) {
        setPlaylist(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch playlist");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch playlist";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update playlist
  const updatePlaylist = useCallback(
    async (playlistId: number, playlistData: UpdatePlaylistRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await playlistService.updatePlaylist(
          playlistId,
          playlistData,
        );

        if (response.EC === 0 && response.DT) {
          setPlaylist(response.DT);
          setPlaylists((prev) =>
            prev.map((p) => (p.id === playlistId ? response.DT! : p)),
          );
          return response.DT;
        } else {
          setError(response.EM || "Failed to update playlist");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update playlist";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Delete playlist
  const deletePlaylist = useCallback(
    async (playlistId: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await playlistService.deletePlaylist(playlistId);

        if (response.EC === 0) {
          setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
          if (playlist && playlist.id === playlistId) {
            setPlaylist(null);
          }
          return true;
        } else {
          setError(response.EM || "Failed to delete playlist");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete playlist";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [playlist],
  );

  // Get all playlist songs
  const getPlaylistSongs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await playlistService.getPlaylistSongs();

      if (response.EC === 0 && response.DT) {
        setPlaylistSongs(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch playlist songs");
        return [];
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch playlist songs";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Add song to playlist
  const addSongToPlaylist = useCallback(async (data: AddSongRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await playlistService.addSongToPlaylist(data);

      if (response.EC === 0 && response.DT) {
        setPlaylistSongs((prev) => [...prev, response.DT!]);
        return response.DT;
      } else {
        setError(response.EM || "Failed to add song to playlist");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add song to playlist";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get playlist song by ID
  const getPlaylistSongById = useCallback(async (playlistSongId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response =
        await playlistService.getPlaylistSongById(playlistSongId);

      if (response.EC === 0 && response.DT) {
        let tempSongs: Song[] = [];
        response.DT.forEach((rs) => {
          tempSongs.push(rs.song);
        });
        setPlaylistSongs(tempSongs);
        return response.DT;
      } else if (response.EC === 0 && response.DT === null) {
        return null;
      } else {
        setError(response.EM || "Failed to fetch playlist song");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch playlist song";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update playlist song
  const updatePlaylistSong = useCallback(
    async (playlistSongId: number, data: UpdatePlaylistSongRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await playlistService.updatePlaylistSong(
          playlistSongId,
          data,
        );

        if (response.EC === 0 && response.DT) {
          setPlaylistSongs((prev) =>
            prev.map((ps) => (ps.id === playlistSongId ? response.DT! : ps)),
          );
          if (playlistSong && playlistSong.id === playlistSongId) {
            setPlaylistSong(response.DT);
          }
          return response.DT;
        } else {
          setError(response.EM || "Failed to update playlist song");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update playlist song";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [playlistSong],
  );

  // Delete playlist song
  const deletePlaylistSong = useCallback(
    async (playlistSongId: number) => {
      setLoading(true);
      setError(null);

      try {
        const response =
          await playlistService.deletePlaylistSong(playlistSongId);

        if (response.EC === 0) {
          setPlaylistSongs((prev) =>
            prev.filter((ps) => ps.id !== playlistSongId),
          );
          if (playlistSong && playlistSong.id === playlistSongId) {
            setPlaylistSong(null);
          }
          return true;
        } else {
          setError(response.EM || "Failed to delete playlist song");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete playlist song";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [playlistSong],
  );

  // Get playlists by user
  const getPlaylistsByUser = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await playlistService.getPlaylistsByUser(userId);
      if (response.EC === 0 && response.DT) {
        setUserPlaylists(response.DT);

        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch playlists by user");
        return [];
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch playlists by user";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    playlists,
    playlist,
    playlistSongs,
    playlistSong,
    getPlaylists,
    createPlaylist,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
    getPlaylistSongs,
    addSongToPlaylist,
    getPlaylistSongById,
    updatePlaylistSong,
    deletePlaylistSong,
    getPlaylistsByUser,
  };
};

export default usePlaylist;
