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
};

export type Album = {
  id: number;
  name: string;
  cover_url: string;
  authorName: string;
  authorID: number;
  dateAdded: string;
  tracks: Track[];
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
