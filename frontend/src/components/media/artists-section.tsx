import { Artist } from "@/types";
import { MediaGrid } from "./media-grid";
import { ArtistItem } from "./artist-item";
import { SectionSkeleton } from "./section-skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ArtistsSectionProps {
  title: string;
  artists: Artist[];
  loading: boolean;
  skeletonCount?: number;
}

export function ArtistsSection({
  title,
  artists,
  loading,
  skeletonCount = 6,
}: ArtistsSectionProps) {
  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <MediaGrid>
          {loading
            ? Array(skeletonCount)
                .fill(0)
                .map((_, i) => <SectionSkeleton key={i} />)
            : artists.map((artist) => (
                <ArtistItem key={artist.id} artist={artist} />
              ))}
        </MediaGrid>
      </CardContent>
    </Card>
  );
}
