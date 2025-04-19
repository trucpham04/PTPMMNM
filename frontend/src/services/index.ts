export * from "./apiClient";
export * from "./authService";
export * from "./userService";
export * from "./playlistService";
export * from "./collectionService";
export * from "./genreService";
export * from "./artistService";
export * from "./albumService";
export * from "./songService";

// Re-export default services
import apiClient from "./apiClient";
import authService from "./authService";
import userService from "./userService";
import playlistService from "./playlistService";
import collectionService from "./collectionService";
import genreService from "./genreService";
import artistService from "./artistService";
import albumService from "./albumService";
import songService from "./songService";

export {
  apiClient,
  authService,
  userService,
  playlistService,
  collectionService,
  genreService,
  artistService,
  albumService,
  songService,
};
