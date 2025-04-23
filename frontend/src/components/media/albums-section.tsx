import { Album } from "@/types";
import { MediaGrid } from "./media-grid";
import { AlbumItem } from "./album-item";
import { SectionSkeleton } from "./section-skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AlbumsSectionProps {
  title: string;
  albums: Album[];
  loading: boolean;
  skeletonCount?: number;
}

export function AlbumsSection({
  title,
  albums,
  loading,
  skeletonCount = 6,
}: AlbumsSectionProps) {
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
            : albums.map((album) => <AlbumItem key={album.id} album={album} />)}
        </MediaGrid>
      </CardContent>
    </Card>
  );
}
