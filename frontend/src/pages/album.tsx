import AlbumAction from "@/feature/album/components/action";
import AlbumHeader from "@/feature/album/components/header";
import AlbumTracks from "@/feature/album/components/tracks";
import { useParams } from "react-router-dom";

export default function Album() {
  const { album_id } = useParams();
  return (
    <div className="min-h-full">
      <AlbumHeader />
      <div className="px-4">
        <AlbumAction />
        <AlbumTracks />
      </div>
      Album id: {album_id}
    </div>
  );
}
