import axios from "axios";
import { Album } from "@/types";
import { handleAxiosError } from "@/utils/handle-axios-error";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Get current user's saved albums
export const getUserSavedAlbums = async (): Promise<Album[]> => {
  try {
    const response = await axios.get(`${API_URL}/me/albums`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, "Failed to fetch saved albums");
  }
};

// Save an album
export const saveAlbum = async (albumId: number): Promise<void> => {
  try {
    await axios.put(
      `${API_URL}/me/albums/${albumId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
  } catch (error) {
    throw handleAxiosError(error, "Failed to save album");
  }
};

// Remove a saved album
export const removeAlbum = async (albumId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/me/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    throw handleAxiosError(error, "Failed to remove album");
  }
};

// Check if album is saved
export const checkSavedAlbum = async (albumId: number): Promise<boolean> => {
  try {
    const response = await axios.get(
      `${API_URL}/me/albums/contains/${albumId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    return response.data.isSaved;
  } catch (error) {
    throw handleAxiosError(error, "Failed to check if album is saved");
  }
};
