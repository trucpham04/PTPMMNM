import axios from "axios";
import { Album, Artist, Track } from "@/types";
import { handleAxiosError } from "@/utils/handle-axios-error";

const API_URL = "http://localhost:3001";

// Album services
export const getAlbums = async (searchQuery?: string): Promise<Album[]> => {
  try {
    const params = searchQuery ? { q: searchQuery } : {};
    const response = await axios.get(`${API_URL}/albums`, { params });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, "Failed to fetch albums");
  }
};

export const getAlbumById = async (id: number): Promise<Album> => {
  try {
    const response = await axios.get(`${API_URL}/albums/${id}`);
    return response.data; // The album already includes tracks from server
  } catch (error) {
    throw handleAxiosError(error, `Failed to fetch album with ID ${id}`);
  }
};

// Artist services
export const getArtists = async (searchQuery?: string): Promise<Artist[]> => {
  try {
    const params = searchQuery ? { q: searchQuery } : {};
    const response = await axios.get(`${API_URL}/artists`, { params });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, "Failed to fetch artists");
  }
};

export const getArtistById = async (id: number): Promise<Artist> => {
  try {
    const response = await axios.get(`${API_URL}/artists/${id}`);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, `Failed to fetch artist with ID ${id}`);
  }
};

// Track services
export const getTracks = async (params?: {
  q?: string;
  albumId?: number;
  artistId?: number;
}): Promise<Track[]> => {
  try {
    const response = await axios.get(`${API_URL}/tracks`, { params });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, "Failed to fetch tracks");
  }
};

export const getTrackById = async (id: number): Promise<Track> => {
  try {
    const response = await axios.get(`${API_URL}/tracks/${id}`);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, `Failed to fetch track with ID ${id}`);
  }
};

export const getTracksByAlbumId = async (albumId: number): Promise<Track[]> => {
  try {
    const response = await axios.get(`${API_URL}/tracks`, {
      params: { albumId },
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(
      error,
      `Failed to fetch tracks for album ${albumId}`,
    );
  }
};

export const getTracksByArtistId = async (
  artistId: number,
): Promise<Track[]> => {
  try {
    const response = await axios.get(`${API_URL}/tracks`, {
      params: { artistId },
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(
      error,
      `Failed to fetch tracks for artist ${artistId}`,
    );
  }
};
