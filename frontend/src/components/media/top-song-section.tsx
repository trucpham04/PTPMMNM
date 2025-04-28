import { Song } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface TopSongSectionProps {
  songs: Song[];
}

export default function TopSongSection({ songs }: TopSongSectionProps) {
  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-3xl">Top 5 Songs</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 px-0">
        {songs.map((song, index) => (
          <div key={song.id} className="mb-3 flex items-center gap-4">
            <div className="text-xl font-semibold">{`Top ${index + 1}`}</div>
            {song?.album?.cover_image && (
              <div className="size-20 flex-shrink-0">
                <Link to={`/song/${song.id}`}>
                  <img
                    src={song.album.cover_image}
                    alt={`${song.title} album cover`}
                    width={80}
                    height={80}
                    className="h-full w-full rounded-md object-cover"
                  />
                </Link>
              </div>
            )}
            <div className="flex flex-col">
              <Link to={`/song/${song.id}`}>
                <div className="text-xl font-medium">{song.title}</div>
              </Link>
              <Link to={`/artist/${song?.artist?.id}`}>
                <div className="text-muted-foreground text-sm hover:underline">
                  {song?.artist?.name}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
