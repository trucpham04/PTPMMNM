import { usePlayer } from "@/contexts/playerContext";
import { formatTime } from "@/utils/format-time";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function QueuePage() {
  const { queue, currentSong, play, removeSongFromQueue } = usePlayer();

  useEffect(() => {
    console.log("Queue:", queue);
  }, [queue]);

  return (
    <div className="max-w-2xl space-y-6 p-4">
      {/* Current song section */}
      {currentSong && (
        <>
          <p className="mb-4 text-2xl font-bold">Now Playing</p>
          <div className="bg-background rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-4">
              {currentSong.album?.cover_image && (
                <img
                  src={currentSong.album.cover_image}
                  alt={`${currentSong.title} cover`}
                  className="h-16 w-16 rounded object-cover"
                />
              )}
              <div className="flex-1">
                <p className="text-lg font-medium hover:underline">
                  <Link to={`/song/${currentSong.id}`}>
                    {currentSong.title}
                  </Link>
                </p>
                <p className="text-sm text-gray-600">
                  <Link
                    to={`/artist/${currentSong.artist?.id}`}
                    className="hover:underline"
                  >
                    {currentSong.artist?.name ?? "Unknown Artist"}
                  </Link>
                </p>
              </div>
              <span className="text-sm text-gray-500">
                {formatTime(parseInt(currentSong.duration))}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Queue section */}
      <p className="mb-4 text-2xl font-bold">Up Next</p>
      <div className="bg-background rounded-xl p-4 shadow-md">
        {queue.length === 0 ? (
          <p className="text-gray-500">Queue is empty.</p>
        ) : (
          <ul className="space-y-3">
            {queue.map((song) => (
              <li
                key={song.id}
                className="hover:bg-primary-foreground flex cursor-pointer items-center gap-4 rounded p-2"
                onClick={() => {
                  play(song);
                  removeSongFromQueue(song.id);
                }}
              >
                {song.album?.cover_image && (
                  <img
                    src={song.album.cover_image}
                    alt={`${song.title} cover`}
                    className="h-12 w-12 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{song.title}</p>
                  <p className="text-sm text-gray-600">
                    {song.artist?.name ?? "Unknown Artist"}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {formatTime(parseInt(song.duration))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
