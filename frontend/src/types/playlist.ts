import { Genre, Song } from "./music";
import { User } from "./user";

// Playlist Model
export interface Playlist {
  id: number;
  name: string;
  description?: string;
  user_id: number;
  cover_image?: string; // URL from Cloudinary
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  is_public: boolean;
  slug: string;

  // Optional expanded relations
  user?: User;
  songs?: PlaylistSong[];
}

// PlaylistSong Model (Junction table)
export interface PlaylistSong {
  id: number;
  playlist_id: number;
  song_id: number;
  position: number;
  added_at: string; // ISO date string

  // Optional expanded relations
  playlist?: Playlist;
  song?: Song;
}

// Collection Model
export interface Collection {
  id: number;
  title: string;
  description?: string;
  collection_type:
    | "featured"
    | "trending"
    | "new_releases"
    | "genre_based"
    | "mood_based"
    | "seasonal";
  cover_image?: string; // URL from Cloudinary
  is_active: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  slug: string;

  // Related fields
  genres: Genre[];

  // Optional expanded relations
  songs?: CollectionSong[];
}

// CollectionSong Model (Junction table)
export interface CollectionSong {
  id: number;
  collection_id: number;
  song_id: number;
  position: number;
  added_at: string; // ISO date string

  // Optional expanded relations
  collection?: Collection;
  song?: Song;
}
