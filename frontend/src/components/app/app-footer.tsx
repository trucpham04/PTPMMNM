import { cn } from "@/lib/utils";
import { Slider } from "../ui/slider";
import Icon from "../ui/icon";
import { useState, useRef, useEffect, useCallback } from "react";

export default function AppFooter({ className }: { className?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [songIndex, setSongIndex] = useState(0);
  const [songList, setSongList] = useState<any[]>([]);
  const [currentSongId, setCurrentSongId] = useState<number | null>(null);
  const [songTitle, setSongTitle] = useState("Đang tải...");
  const [songArtist, setSongArtist] = useState("Artist name");
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>(
    [],
  );
  const [userInput, setUserInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/chat-history", {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${yourToken}` nếu có auth
          },
        });
        const data = await res.json();
        setMessages(data.chat_history);
      } catch (err) {
        console.error("Lỗi khi lấy lịch sử chat:", err);
      }
    };
    fetchMessages();
  }, []);
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      videoRef.current?.pause();
    } else {
      audioRef.current?.play();
      videoRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };
  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
    if (videoRef.current) videoRef.current.currentTime = newTime;
  };
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume / 100;
    if (videoRef.current) videoRef.current.volume = newVolume / 100;
  };
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  const toggleChat = () => setChatOpen((prev) => !prev);
  const playSong = useCallback(() => {
    const currentSong = songList[songIndex];
    if (!currentSong) return;
    setCurrentSongId(currentSong.id);
    setSongTitle(currentSong.title || "Đang tải...");
    setSongArtist(currentSong.artist || "Artist name");
    if (audioRef.current) {
      audioRef.current.src = currentSong.audio_file || "";
      audioRef.current.load();
    }
    if (videoRef.current) {
      videoRef.current.src = currentSong.video_file || "";
      videoRef.current.load();
    }
    audioRef.current?.play();
    videoRef.current?.play();
    setIsPlaying(true);
  }, [songList, songIndex]);

  useEffect(() => {
    if (songList.length > 0 && songList[songIndex]) {
      playSong();
    }
  }, [songList, songIndex, playSong]);
  const handleSendMessage = async () => {
    if (!userInput.trim()) {
      setErrorMessage("Vui lòng nhập tin nhắn!");
      return;
    }
    setErrorMessage("");
    const message = userInput.trim();
    let tempSongId = currentSongId || 0;
    if (message === "quay lại bài trước" && songList.length > 0) {
      const newIndex = songIndex > 0 ? songIndex - 1 : songList.length - 1;
      if (songIndex < 0) {
        setSongIndex(0);
        tempSongId = songList[0].id - 1;
      } else {
        setSongIndex(newIndex);
        tempSongId = songList[newIndex]?.id || tempSongId;
      }
    } else if (message === "chuyển bài hát tiếp theo" && songList.length > 0) {
      const newIndex = (songIndex + 1) % songList.length;
      if (songIndex + 1 > songList.length - 1) {
        setSongIndex(0);
        tempSongId = songList[songList.length - 1].id + 1;
      } else {
        setSongIndex(newIndex);
        tempSongId = songList[newIndex]?.id || tempSongId;
      }
    }
    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          song_id: tempSongId,
          isPlaying: isPlaying,
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
          audioRef.current?.pause();
          videoRef.current?.pause();
          setIsPlaying(false);
        } else if (data.action === "resume") {
          audioRef.current?.play();
          videoRef.current?.play();
          setIsPlaying(true);
        }
        if (data.song) {
          const newSongList = Array.isArray(data.song)
            ? data.song
            : [data.song];
          if (
            message == "quay lại bài trước" ||
            message == "chuyển bài hát tiếp theo"
          ) {
            if (!songList.some((song) => song.id === newSongList[0].id)) {
              setSongList(newSongList);
            }
          } else {
            setSongList(newSongList);
          }
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
    setUserInput("");
  };
  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onEnded={() => {
          setIsPlaying(false);
          // Auto play next song when current song ends
          if (songList.length > 0) {
            const newIndex = (songIndex + 1) % songList.length;
            setSongIndex(newIndex);
          }
        }}
      />
      <video
        ref={videoRef}
        width="200"
        height="200"
        style={{ display: "none", marginLeft: "45%" }}
      />
      {/* Music Player Section */}
      <div
        className={cn(
          "bg--100 relative flex h-16 items-center justify-between p-2",
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <div className="size-14 rounded-md bg-white"></div>
          <div className="space-y-1">
            <div>{songTitle}</div>
            <div className="text-xs">{songArtist}</div>
          </div>
          <Icon>add_circle</Icon>
        </div>

        <div className="absolute top-2/5 left-1/2 flex w-full -translate-x-1/2 flex-col items-center justify-center">
          <div className="flex gap-4">
            <Icon
              size="xl"
              onClick={() => {
                let newIndex = songIndex - 1;
                if (newIndex < 0) newIndex = songList.length - 1;
                setSongIndex(newIndex);
              }}
              className="cursor-pointer"
            >
              skip_previous
            </Icon>
            <Icon size="xl" onClick={togglePlay} className="cursor-pointer">
              {isPlaying ? "pause" : "play_arrow"}
            </Icon>
            <Icon
              size="xl"
              onClick={() => {
                let newIndex = songIndex + 1;
                if (newIndex >= songList.length) newIndex = 0;
                setSongIndex(newIndex);
              }}
              className="cursor-pointer"
            >
              skip_next
            </Icon>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div>{formatTime(currentTime)}</div>
            <Slider
              className="w-1/4 min-w-80"
              value={[currentTime]}
              max={duration}
              onValueChange={handleSeek}
            />
            <div>{formatTime(duration)}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Icon size="lg">volume_up</Icon>
          <Slider
            size="small"
            max={100}
            value={[volume]}
            onValueChange={handleVolumeChange}
            className="w-20"
          />
        </div>
      </div>
      {/* Chat Section */}
      <button
        onClick={toggleChat}
        className="fixed right-4 bottom-25 rounded-full bg-blue-600 p-2 text-white"
      >
        💬
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
              className="text-white hover:text-gray-200"
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
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2 text-sm ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "border border-gray-200 bg-white text-gray-800 shadow-sm"
                    }`}
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
    </>
  );
}
