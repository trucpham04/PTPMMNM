import { useEffect, useRef, useState } from "react";
import { AlbumsSection } from "@/components/media/albums-section";
import { ArtistsSection } from "@/components/media/artists-section";
import { useAlbum, useArtist, useSong } from "@/hooks";
import TopSongSection from "@/components/media/top-song-section";
import { Song } from "@/types";

function HomePage() {
  const { albums, loading: albumsLoading, getAlbums } = useAlbum();
  const { artists, loading: artistsLoading, getArtists } = useArtist();
  const { getTopSongs } = useSong();
  const [topSongs, setTopSongs] = useState<Song[]>([]);
  const hasRun = useRef(false);
  useEffect(() => {
    if (hasRun.current) return;

    const fetchData = async () => {
      await getAlbums();
      await getArtists();
      await getTopSongs().then((res) => setTopSongs(res));
    };

    fetchData();
    hasRun.current = true;
  }, []);

  return (
    <div className="w-full px-4">
      <AlbumsSection
        title={"Popular Albums"}
        albums={albums.slice(0, 5)}
        loading={albumsLoading}
      />

      <ArtistsSection
        title={"Top Artists"}
        artists={artists.slice(0, 5)}
        loading={artistsLoading}
      />

      <TopSongSection songs={topSongs} />
    </div>
  );
}

export default HomePage;
