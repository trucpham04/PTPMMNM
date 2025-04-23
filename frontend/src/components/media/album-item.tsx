import { Link } from "react-router-dom";
import { Album } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface AlbumItemProps {
  album: Album;
}

export function AlbumItem({ album }: AlbumItemProps) {
  return (
    <Link to={`/album/${album.id}`}>
      <Card className="hover:bg-accent gap-3 overflow-hidden border-0 p-2 transition-all">
        <CardContent className="p-0">
          <div className="aspect-square overflow-hidden rounded-md">
            <img
              src={album.cover_image}
              alt={album.title}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start p-0">
          <h3 className="w-full truncate font-semibold">{album.title}</h3>
          <p className="text-muted-foreground w-full truncate text-sm">
            {album.artist?.name}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
