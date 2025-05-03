// Import User type if needed
export interface User {
  id: number;
  username: string;
  email: string;
  profile_picture?: string;
  bio?: string;
  date_of_birth?: string;
  country?: string;
  // Other User fields...
}

// Genre Model
export interface Genre {
  id: number;
  name: string;
  description?: string;
  slug?: string;

  // Virtual fields from related models
  artists?: Artist[];
  albums?: Album[];
  songs?: Song[];
}

// Artist Model
export interface Artist {
  id: number;
  name: string;
  bio?: string;
  image?: string; // URL from Cloudinary
  slug: string;

  // Related fields
  genres: Genre[];

  // Virtual fields from related models
  albums?: Album[];
  songs?: Song[];
  featured_in?: Song[];
  composed_songs?: Song[];
  followers?: ArtistFollow[];
}

// ArtistFollow Model
export interface ArtistFollow {
  id: number;
  user_id: number;
  artist_id: number;
  followed_at: string; // ISO date string

  // Optional expanded relations
  user?: User;
  artist?: Artist;
}

// Album Model
export interface Album {
  id: number;
  title: string;
  artist_id: number;
  release_date: string; // ISO date string (YYYY-MM-DD)
  cover_image?: string; // URL from Cloudinary
  description?: string;
  slug: string;

  // Related fields
  genres: Genre[];

  // Optional expanded relation
  artist?: Artist;
  songs?: Song[];
  songs_count?: number; // Number of songs in the album
}

// Song Model
export interface Song {
  id: number;
  title: string;
  artist_id: number;
  album_id?: number;
  audio_file: string; // URL to the file
  video_file?: string; // URL to the video file
  duration: string; // ISO duration format (PT2M30S for 2min 30sec)
  lyrics?: string;
  release_date?: string; // ISO date string (YYYY-MM-DD)
  price?: string; // Decimal as string, or number if preferred
  is_downloadable: boolean;
  is_premium: boolean;
  play_count: number;
  slug: string;
  isSingleQueue?: boolean; // Optional field to indicate if the song is in a queue

  // Related fields
  genres: Genre[];
  featuring_artists: Artist[];
  composers: Artist[];

  // Optional expanded relations
  artist?: Artist;
  album?: Album;
  recommended_to?: SongRecommendation[];
  listened_by?: ListeningHistory[];
}

// Song Recommendation Model
export interface SongRecommendation {
  id: number;
  user_id: number;
  song_id: number;
  recommendation_type:
    | "listening_history"
    | "similar_users"
    | "genre_preference"
    | "trending"
    | "new_release";
  score: number;
  reason?: string;
  created_at: string; // ISO date string
  is_seen: boolean;

  // Optional expanded relations
  user?: User;
  song?: Song;
}

// Listening History Model
export interface ListeningHistory {
  id: number;
  user_id: number;
  song_id: number;
  listened_at: string; // ISO date string
  listened_duration?: string; // ISO duration format (PT2M30S for 2min 30sec)
  play_position?: string; // ISO duration format
  completed: boolean;

  // Optional expanded relations
  user?: User;
  song?: Song;
}

export interface FavoriteSong {
  id: number;
  user: number; // hoặc: User nếu bạn muốn nested object
  song: number; // hoặc: Song nếu bạn muốn nested object
  favorited_at: string; // ISO 8601 datetime string
}
