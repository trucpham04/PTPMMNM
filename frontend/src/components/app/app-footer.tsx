import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  setCurrentSong,
  togglePlayPause,
  setPlaying,
  addToQueue,
  removeFromQueue,
  clearQueue,
  setVolume,
  nextSong,
  previousSong,
  updatePlayCount,
  addToHistory,
} from "@/store/slices/playerSlice";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "../ui/slider";
import Icon from "../ui/icon";
import { Link } from "react-router-dom";
import { usePlayer } from "@/contexts/playerContext";
import { Button } from "../ui/button";
import { useFavorite } from "@/hooks";
import { useAuth } from "@/contexts/authContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Song } from "@/types/music";

export default function AppFooter({ className }: { className?: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    currentSong,
    isPlaying,
    volume,
    play,
    togglePlay,
    playNextSong,
    playPreviousSong,
    changeVolume,
    audioRef,
    currentTime,
    duration,
    addSongToQueue,
    clearSongQueue,
    removeSongFromQueue,
    queue,
  } = usePlayer();
  const history = useSelector((state: RootState) => state.player.history);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const {
    isFavorited,
    getIsSongFavorited,
    addSongToFavorites,
    removeSongFromFavorites,
  } = useFavorite();
  const [songIndex, setSongIndex] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>(
    [],
  );
  let songListInChat = [currentSong, ...queue];
  let tempSongId = 0;
  let nextSongId = 0;
  let firstSong = 0;
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (currentSong && user) {
      getIsSongFavorited(user?.id, currentSong.id);
    }
  }, [currentSong]);

  const toggleFavorite = () => {
    if (!currentSong || !user) {
      return;
    }
    if (isFavorited) removeSongFromFavorites(user?.id, currentSong.id);
    else addSongToFavorites(user?.id, currentSong.id);
  };
  const [userInput, setUserInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/chat-history?user_id=${user?.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const data = await res.json();
        setMessages(data.chat_history);
      } catch (err) {
        console.error("Lỗi khi lấy lịch sử chat:", err);
      }
    };

    if (user?.id) {
      fetchMessages();
    }
  }, [user?.id]);

  const toggleChat = () => {
    setChatOpen((prev) => !prev);
    setErrorMessage("");
  };

  // const playSong = () => {
  //   console.log("SongIndex songListInChat:", songListInChat);
  //   dispatch(setPlaying(true));
  // };

  // useEffect(() => {
  //   songListInChat = [currentSong, ...queue];
  //   if (songListInChat.length > 0 && songListInChat[songIndex]) {
  //     playSong();
  //   }
  // }, [songIndex, queue]);
  // console.log("history.length", history.length);
  const handleSendMessage = async () => {
    if (!user) {
      setErrorMessage("Bạn cần đăng nhập để gửi tin nhắn!");
      setUserInput("");
      return;
    }
    if (!userInput.trim()) {
      setErrorMessage("Vui lòng nhập tin nhắn!");
      return;
    }

    setErrorMessage("");
    const message = userInput.trim();
    tempSongId = currentSong?.id || 0;

    if (message === "quay lại bài trước" && songListInChat.length > 1) {
      if (history.length <= 0) {
        tempSongId = songListInChat[songIndex]?.id || 0;
        firstSong = 1;
      }
    } else if (
      message === "chuyển bài hát tiếp theo" &&
      songListInChat.length > 1
    ) {
      if (songIndex < songListInChat.length - 1) {
        let is_SongQueue = songListInChat.findIndex(
          (song) => song && song.id == tempSongId,
        );
        nextSongId = songListInChat[is_SongQueue + 1]?.id || 0;
        tempSongId = nextSongId;
      } else {
        tempSongId = songListInChat[songListInChat.length - 1]?.id || 0;
        firstSong = 1;
      }
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          song_id: tempSongId,
          isPlaying: isPlaying,
          user_id: user.id,
          songListLength: songListInChat.length,
          firstSong: firstSong,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { text: message, sender: "user" }]);
      if (data.response) {
        setMessages((prev) => [
          ...prev,
          { text: data.response, sender: "bot" },
        ]);

        if (data.action === "pause") {
          dispatch(setPlaying(false));
        } else if (data.action === "resume") {
          dispatch(setPlaying(true));
        }
        if (data.song) {
          const newSongList = Array.isArray(data.song)
            ? data.song
            : [data.song];
          if (message == "chuyển bài hát tiếp theo") {
            if (songListInChat.length == 1) {
              dispatch(clearSongQueue());
              dispatch(setCurrentSong(newSongList[0]));
              dispatch({
                type: "player/addToHistory",
                payload: currentSong,
              });
              setSongIndex(0);
            } else {
              if (
                !songListInChat.some(
                  (song) => song && song.id === newSongList[0].id,
                )
              ) {
                dispatch(clearSongQueue());
                dispatch(setCurrentSong(newSongList[0]));
                dispatch({
                  type: "player/addToHistory",
                  payload: currentSong,
                });
                setSongIndex(0);
              } else {
                const index = songListInChat.findIndex(
                  (song) => song && song.id == newSongList[0].id,
                );

                if (index !== -1) {
                  if (songListInChat[index]) {
                    dispatch(setCurrentSong(songListInChat[index]));
                    dispatch({
                      type: "player/addToHistory",
                      payload: currentSong,
                    });
                    dispatch(removeSongFromQueue(songListInChat[index].id));
                    setSongIndex(0);
                  }
                }
              }
            }
          }
          if (message == "quay lại bài trước") {
            if (history.length > 0) {
              dispatch(previousSong());
              setSongIndex(0);
            } else {
              dispatch(clearSongQueue());
              dispatch(setCurrentSong(newSongList[0]));
              setSongIndex(0);
            }
          }
          if (
            message.startsWith("phát bài của ") ||
            message.startsWith("phát bài trong album ") ||
            message.startsWith("phát các bài hát yêu thích") ||
            message.startsWith("phát album ") ||
            message.startsWith("phát bài ")
          ) {
            dispatch(clearSongQueue());
            dispatch(setCurrentSong(newSongList[0]));
            newSongList.slice(1).forEach((song: Song) => {
              addSongToQueue(song);
            });
            setSongIndex(0);
          }
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
    setUserInput("");
    firstSong = 0;
  };
  return (
    <>
      {/* Chat Section */}
      <button
        onClick={toggleChat}
        className="bg-primary text-primary-foreground fixed right-4 bottom-25 flex size-12 cursor-pointer items-center justify-center rounded-full"
      >
        <Icon>chat</Icon>
      </button>

      {chatOpen && (
        <div className="fixed right-4 bottom-24 w-80 overflow-hidden rounded-lg bg-blue-700">
          {/* Chat header */}
          <div className="flex items-center justify-between bg-blue-500 p-2 font-medium text-white">
            <div className="flex items-center">
              <Icon className="mr-2 text-white">chat</Icon>
              <span className="font-semibold">Chat with us</span>
            </div>
            <button
              onClick={toggleChat}
              className="cursor-pointer text-white hover:text-gray-200"
            >
              <Icon>close</Icon>
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex h-70 flex-col space-y-2 overflow-y-auto bg-gray-50 p-3">
            {Array.isArray(messages) &&
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2 text-sm ${msg.sender === "user" ? "bg-blue-500 text-white" : "border border-gray-200 bg-white text-gray-800 shadow-sm"}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
          </div>

          {/* Chat input */}
          <div className="border-t border-gray-300 bg-white p-3">
            <div className="flex items-center gap-2 text-sm">
              <input
                type="text"
                value={userInput}
                onFocus={() => setErrorMessage("")}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 rounded-full border border-gray-300 bg-white p-2 px-4 text-gray-800 transition duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="flex items-center justify-center rounded-full bg-blue-500 p-2 text-white transition duration-200"
              >
                <Icon className="text-lg">send</Icon>
              </button>
            </div>
            {errorMessage && (
              <div className="mt-2 text-xs font-medium text-red-600">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {!currentSong ? (
        <div
          className={cn(
            "bg--100 relative flex h-16 items-center justify-between p-2",
            { "pb-14": isMobile },
            className,
          )}
        >
          {/* Track info */}
          <div className="z-10 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-md bg-white/10">
              <Icon className="text-muted-foreground/50">music_note</Icon>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground text-sm font-medium">
                No track playing
              </div>
              <div className="text-muted-foreground/70 text-xs">
                Select a song to start listening
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute top-2/5 left-1/2 flex w-full -translate-1/2 flex-col items-center justify-center">
            <div className="flex gap-4">
              <Icon
                size="xl"
                className="text-muted-foreground/50 cursor-not-allowed"
              >
                skip_previous
              </Icon>
              <Icon
                size="xl"
                className="text-muted-foreground/50 cursor-not-allowed"
              >
                play_arrow
              </Icon>
              <Icon
                size="xl"
                className="text-muted-foreground/50 cursor-not-allowed"
              >
                skip_next
              </Icon>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="text-muted-foreground/70">0:00</div>
              <Slider className="w-1/4 min-w-80" disabled />
              <div className="text-muted-foreground/70">0:00</div>
            </div>
          </div>

          {/* Volume */}
          <div className="z-10 flex gap-2">
            <Button
              variant={"ghost"}
              className="hover:bg-primary-foreground size-12 cursor-pointer rounded-full"
              asChild
            >
              <Link to="/queue">
                <Icon>queue_music</Icon>
              </Link>
            </Button>

            <div className="flex gap-2">
              <Icon
                size="lg"
                className="text-muted-foreground/50 cursor-not-allowed"
              >
                volume_up
              </Icon>
              <Slider
                size="small"
                max={100}
                defaultValue={[volume]}
                className="w-20"
                disabled
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "bg--100 relative flex h-16 items-center justify-between p-2",
            { "pb-14": isMobile },
            className,
          )}
        >
          {/* Track info */}
          <div className="z-10 flex items-center gap-3">
            <Link to={`/album/${currentSong.album?.id}`}>
              <img
                src={currentSong.album?.cover_image}
                alt={currentSong.title}
                className="size-12 rounded-md object-cover"
              />
            </Link>
            <div className="space-y-">
              <Link to={`/song/${currentSong.id}`} className="hover:underline">
                {currentSong.title}
              </Link>
              <Link
                to={`/artist/${currentSong.artist_id}`}
                className="block text-xs hover:underline"
              >
                {currentSong.artist?.name}
              </Link>
            </div>
            <Icon
              className={cn("cursor-pointer", { fill: isFavorited })}
              onClick={toggleFavorite}
            >
              favorite
            </Icon>
          </div>

          {/* Controls */}
          <div className="absolute top-2/5 left-1/2 flex w-full -translate-1/2 flex-col items-center justify-center">
            <div className="flex gap-4">
              <Icon
                size="xl"
                className="cursor-pointer"
                onClick={playPreviousSong}
              >
                skip_previous
              </Icon>
              <Icon size="xl" className="cursor-pointer" onClick={togglePlay}>
                {isPlaying ? "pause" : "play_arrow"}
              </Icon>
              <Icon size="xl" className="cursor-pointer" onClick={playNextSong}>
                skip_next
              </Icon>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div>{formatTime(currentTime)}</div>
              <Slider
                className="w-1/4 min-w-80"
                max={duration}
                value={[currentTime]}
                onValueChange={(values) => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = values[0];
                  }
                }}
              />
              <div>{formatTime(duration)}</div>
            </div>
          </div>

          {/* Volume */}
          <div className="z-10 flex gap-2">
            <Button
              variant={"ghost"}
              className="hover:bg-primary-foreground size-12 cursor-pointer rounded-full"
              asChild
            >
              <Link to="/queue">
                <Icon>queue_music</Icon>
              </Link>
            </Button>

            <div className="flex gap-2">
              <Icon
                size="lg"
                className="cursor-pointer"
                onClick={() => {
                  changeVolume(volume === 0 ? 70 : 0);
                }}
              >
                {volume === 0
                  ? "volume_off"
                  : volume < 50
                    ? "volume_down"
                    : "volume_up"}
              </Icon>

              <Slider
                size="small"
                max={100}
                value={[volume]}
                className="w-20"
                onValueChange={(values) => changeVolume(values[0])}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
