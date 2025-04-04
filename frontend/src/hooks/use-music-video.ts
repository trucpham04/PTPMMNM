import { useState, useEffect } from "react";
import { getTrackMV, MusicVideoData, downloadMV } from "@/services/mv-service";

export function useMusicVideo(trackId: number | null) {
  const [mvData, setMvData] = useState<MusicVideoData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMusicVideo = async () => {
      if (!trackId) {
        setMvData(null);
        return;
      }

      try {
        setLoading(true);
        const data = await getTrackMV(trackId);
        setMvData(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch music video"),
        );
        setMvData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMusicVideo();
  }, [trackId]);

  const handleDownload = async (trackId: number) => {
    if (!trackId) return;

    try {
      await downloadMV(trackId);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to download music video"),
      );
    }
  };

  return {
    mvData,
    loading,
    error,
    downloadMV: handleDownload,
  };
}
