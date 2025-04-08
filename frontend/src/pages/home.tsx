import React, { useState } from "react";
import { useAlbums } from "@/hooks/use-albums";
import { useArtists } from "@/hooks/use-artists";
import { AlbumsSection } from "@/components/media/albums-section";
import { ArtistsSection } from "@/components/media/artists-section";
// import { SearchInput } from "@/components/media/search-input";

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { albums, loading: albumsLoading } = useAlbums(searchQuery);
  const { artists, loading: artistsLoading } = useArtists(searchQuery);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="container px-4">
      <div className="mx-auto max-w-md">
        {/* <SearchInput
          onSearch={handleSearch}
          placeholder="Search albums or artists..."
          className="mb-8"
        /> */}
      </div>

      <AlbumsSection
        title={searchQuery ? "Album Results" : "Popular Albums"}
        albums={albums}
        loading={albumsLoading}
      />

      <ArtistsSection
        title={searchQuery ? "Artist Results" : "Top Artists"}
        artists={artists}
        loading={artistsLoading}
      />
    </div>
  );
}

export default HomePage;
