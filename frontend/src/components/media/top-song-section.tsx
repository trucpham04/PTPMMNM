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
        <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent">
          Top 5 Songs
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        {songs.map((song, index) => (
          <div
            key={song.id}
            className="group relative flex items-center gap-4 rounded-lg p-3 transition-all duration-300 hover:bg-white/5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-lg font-bold text-white">
              {index + 1}
            </div>
            {song?.album?.cover_image && (
              <div className="size-20 flex-shrink-0 overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105">
                <Link to={`/song/${song.id}`}>
                  <img
                    src={song.album.cover_image}
                    alt={`${song.title} album cover`}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </Link>
              </div>
            )}
            <div className="flex flex-col">
              <Link to={`/song/${song.id}`}>
                <div className="text-xl font-semibold transition-colors duration-300 group-hover:text-purple-400">
                  {song.title}
                </div>
              </Link>
              <Link to={`/artist/${song?.artist?.id}`}>
                <div className="text-muted-foreground text-sm transition-colors duration-300 group-hover:text-pink-400">
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
