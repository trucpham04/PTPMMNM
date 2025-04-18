import axios from "axios";
import { handleAxiosError } from "@/utils/handle-axios-error";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export type MusicVideoData = {
  id: number;
  title: string;
  artist: string;
  thumbnail: string;
  stream_url: string;
  download_url: string;
};

// Get MV data for a track
export const getTrackMV = async (trackId: number): Promise<MusicVideoData> => {
  try {
    const response = await axios.get(`${API_URL}/tracks/${trackId}/mv`);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, "Failed to fetch music video data");
  }
};

// Download MV file
export const downloadMV = async (trackId: number): Promise<void> => {
  try {
    // In a real app, we'd use fetch with responseType: 'blob'
    // and create a download link
    window.open(`${API_URL}/download/mv/${trackId}`, "_blank");
  } catch (error) {
    throw handleAxiosError(error, "Failed to download music video");
  }
};
