import { apiClient, ApiResponse } from "./apiClient";
import { Song, Album, Artist } from "@/types";

class SearchService {
  /**
   * Search songs by title
   */
  async searchSongs(query: string): Promise<ApiResponse<Song[]>> {
    return apiClient.get<Song[]>(
      `/songs/search?q=${encodeURIComponent(query)}`,
    );
  }

  /**
   * Search artists by name
   */
  async searchArtists(name: string): Promise<ApiResponse<Artist[]>> {
    return apiClient.get<Artist[]>(
      `/artists/search?q=${encodeURIComponent(name)}`,
    );
  }

  /**
   * Search albums by title
   */
  async searchAlbums(title: string): Promise<ApiResponse<Album[]>> {
    return apiClient.get<Album[]>(
      `/albums/search?q=${encodeURIComponent(title)}`,
    );
  }

  async smartSearch(query: string): Promise<ApiResponse<Song[]>> {
    return apiClient.get<Song[]>(
      `/songs/smart-search?q=${encodeURIComponent(query)}`,
    );
  }
}

export const searchService = new SearchService();
export default searchService;
