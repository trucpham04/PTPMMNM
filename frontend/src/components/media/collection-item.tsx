import { Link } from "react-router-dom";
import { Collection } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface CollectionItemProps {
  collection: Collection;
}

export function CollectionItem({ collection }: CollectionItemProps) {
  return (
    <Link to={`/collection/${collection.id}`}>
      <Card className="hover:bg-accent gap-3 overflow-hidden border-0 p-2 transition-all">
        <CardContent className="p-0">
          <div className="aspect-square overflow-hidden rounded-md">
            <img
              src={collection.cover_image}
              alt={collection.title}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start p-0">
          <h3 className="w-full truncate font-semibold">{collection.title}</h3>
          <p className="text-muted-foreground w-full truncate text-sm">
            {/* {collection.?.name} */}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
