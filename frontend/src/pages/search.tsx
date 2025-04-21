import { DataTable } from "@/components/details/data-table";
import { AlbumsSection } from "@/components/media/albums-section";
import { ArtistsSection } from "@/components/media/artists-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearch } from "@/hooks";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function SearchPage() {
  const {
    songResults,
    smartSearchResults,
    searchSongs,
    albumResults,
    searchAlbums,
    artistResults,
    searchArtists,
    smartSearch,
    loading,
  } = useSearch();

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (query.trim()) {
      searchSongs(query);
      searchAlbums(query);
      searchArtists(query);
      smartSearch(query);
    }
  }, [query]);

  return (
    <>
      <div className="w-full px-4">
        {albumResults.length > 0 && (
          <AlbumsSection
            title={"Album Results"}
            albums={albumResults}
            loading={loading}
          />
        )}
        {artistResults.length > 0 && (
          <ArtistsSection
            title={"Artist Results"}
            artists={artistResults.slice(0, 5)}
            loading={loading}
          />
        )}

        {smartSearchResults.length > 0 && (
          <Card className="border-none bg-transparent shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl">Related Songs</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <DataTable data={smartSearchResults} />
            </CardContent>
          </Card>
        )}

        {songResults.length > 0 && (
          <Card className="border-none bg-transparent shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl">Songs Results</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <DataTable data={songResults} />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
