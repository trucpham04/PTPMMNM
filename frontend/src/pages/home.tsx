import { useEffect, useRef, useState } from "react";
import { AlbumsSection } from "@/components/media/albums-section";
import { ArtistsSection } from "@/components/media/artists-section";
import { useAlbum, useArtist } from "@/hooks";

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { albums, loading: albumsLoading, getAlbums } = useAlbum();
  const { artists, loading: artistsLoading, getArtists } = useArtist();
  const hasRun = useRef(false);
  useEffect(() => {
    if (hasRun.current) return;

    const fetchData = async () => {
      await getAlbums();
      await getArtists();
    };

    fetchData();

    hasRun.current = true;
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="w-full px-4">
      <AlbumsSection
        title={searchQuery ? "Album Results" : "Popular Albums"}
        albums={albums.slice(0, 5)}
        loading={albumsLoading}
      />

      <ArtistsSection
        title={searchQuery ? "Artist Results" : "Top Artists"}
        artists={artists.slice(0, 5)}
        loading={artistsLoading}
      />
    </div>
  );
}

export default HomePage;
