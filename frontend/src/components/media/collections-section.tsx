import { Collection } from "@/types";
import { MediaGrid } from "./media-grid";
import { CollectionItem } from "./collection-item";
import { SectionSkeleton } from "./section-skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CollectionsSectionProps {
  title: string;
  collections: Collection[];
  loading: boolean;
  skeletonCount?: number;
}

export function CollectionsSection({
  title,
  collections,
  loading,
  skeletonCount = 6,
}: CollectionsSectionProps) {
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
            : collections.map((collection) => (
                <CollectionItem key={collection.id} collection={collection} />
              ))}
        </MediaGrid>
      </CardContent>
    </Card>
  );
}
