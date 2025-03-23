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
  type: string;
  cover_url: string;
  authorName: string;
  authorID: number;
  dateAdded: string;
  tracks: Track[];
};
