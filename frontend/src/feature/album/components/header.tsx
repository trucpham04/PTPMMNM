import { Album } from "../types/types";
import { useParams } from "react-router-dom";

export default function AlbumHeader({ album }: { album: Album }) {
  const { album_id } = useParams();
  return (
    <div className="flex max-h-80 min-h-44 w-full items-end gap-4 bg-green-500 px-[max(2%,16px)] pt-12 pb-[max(2%,16px)]">
      <img
        src={album.cover_url}
        alt={album.name}
        className="aspect-square w-1/5 max-w-64 min-w-32 rounded-md"
      />
      <div>
        <div>{album.type}</div>
        <div className="text-7xl font-extrabold">
          {album.name} ID:{album_id}
        </div>
        <div>{album.authorName}</div>
      </div>
    </div>
  );
}
