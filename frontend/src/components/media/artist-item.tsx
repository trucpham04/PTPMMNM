import { Link } from "react-router-dom";
import { Artist } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ArtistItemProps {
  artist: Artist;
}

export function ArtistItem({ artist }: ArtistItemProps) {
  return (
    <Link to={`/artist/${artist.id}`}>
      <Card className="hover:bg-accent gap-3 overflow-hidden border-0 p-2 transition-all">
        <CardContent className="p-0">
          <div className="aspect-square overflow-hidden rounded-full">
            <img
              src={artist.cover_url}
              alt={artist.name}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start p-0">
          <h3 className="w-full truncate font-semibold">{artist.name}</h3>
          <p className="text-muted-foreground w-full truncate text-sm">
            {artist.followers.toLocaleString()} followers
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
