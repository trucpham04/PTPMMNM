export type Track = {
  id: number;
  title: string;
  cover_url: string;
  artistName: string;
  artistID: number;
  albumName?: string | null;
  albumID?: number | null;
  dateAdded: string;
  duration: string;
  has_mv?: boolean;
  mv_thumbnail?: string;
};

export type Album = {
  id: number;
  name: string;
  cover_url: string;
  authorName: string;
  authorID: number;
  dateAdded: string;
  tracks?: Track[]; // Optional as it will be loaded from API
};

export type Artist = {
  id: number;
  name: string;
  cover_url: string;
  followers: number;
  genres?: string[];
};

// Player state type for Redux
export type PlayerState = {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  volume: number;
};

export type User = {
  id: number;
  username: string;
  avatar_path: string;
};

export type LoginProps = {
  username: string;
  password: string;
};

export type RegisterProps = {
  username: string;
  password: string;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  setUser: (user: User) => void;
  login: (props: LoginProps) => Promise<boolean>;
  register: (props: RegisterProps) => void;
  logout: () => void;
};
