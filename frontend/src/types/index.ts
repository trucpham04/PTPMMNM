// Import all types from individual files
import type { User, Group, Permission, UserFollow } from "./user";

import type {
  Genre,
  Artist,
  ArtistFollow,
  Album,
  Song,
  SongRecommendation,
  ListeningHistory,
} from "./music";

import type {
  Playlist,
  PlaylistSong,
  Collection,
  CollectionSong,
} from "./playlist";

// Export all types using 'export type' syntax
export type {
  // User types
  User,
  Group,
  Permission,
  UserFollow,

  // Music types
  Genre,
  Artist,
  ArtistFollow,
  Album,
  Song,
  SongRecommendation,
  ListeningHistory,

  // Playlist types
  Playlist,
  PlaylistSong,
  Collection,
  CollectionSong,
};
