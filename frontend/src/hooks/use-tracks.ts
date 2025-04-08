import { useState, useEffect } from "react";
import { Track } from "@/types";
import {
  getTracks,
  getTrackById,
  getTracksByAlbumId,
  getTracksByArtistId,
} from "@/services/media-services";

export function useTracks(params?: {
  q?: string;
  albumId?: number;
  artistId?: number;
}) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        const data = await getTracks(params);
        setTracks(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch tracks"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [params?.q, params?.albumId, params?.artistId]);

  return { tracks, loading, error };
}

export function useTrack(id: number) {
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        setLoading(true);
        const data = await getTrackById(id);
        setTrack(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error(`Failed to fetch track with ID ${id}`),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
  }, [id]);

  return { track, loading, error };
}

export function useArtistTracks(artistId: number) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchArtistTracks = async () => {
      try {
        setLoading(true);
        const data = await getTracksByArtistId(artistId);
        setTracks(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error(`Failed to fetch tracks for artist ${artistId}`),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArtistTracks();
  }, [artistId]);

  return { tracks, loading, error };
}
