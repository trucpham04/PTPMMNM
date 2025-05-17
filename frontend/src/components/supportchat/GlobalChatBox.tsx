import React, { useState, useEffect, useRef } from "react";
import { FaComment, FaTimes, FaPaperPlane } from "react-icons/fa";
import { useAuth } from "@/contexts/authContext";

interface Message {
  content: string;
  username: string;
  sender: string;
}

const GlobalChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();
  const roomName = "public_chat";

  // Load lịch sử tin nhắn khi mở chat
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/global-chat-history/",
        );
        if (!res.ok) throw new Error("Không thể tải lịch sử chat");
        const data = await res.json();
        setMessages(data); // Giả sử API trả về mảng JSON đúng định dạng
      } catch (err: any) {
        setErrorMessage(err.content || "Lỗi khi tải lịch sử");
      }
    };

    if (isOpen && user) {
      fetchChatHistory();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen || !user) return;

    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomName}/`);
    socketRef.current = socket;

    socket.onopen = () => console.log("WebSocket connected");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    socket.onerror = () => setErrorMessage("Lỗi kết nối WebSocket.");
    socket.onclose = () => console.log("WebSocket disconnected");

    return () => socket.close();
  }, [isOpen, user]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !socketRef.current || !user) return;

    socketRef.current.send(
      JSON.stringify({
        content: messageInput,
        username: user.username,
        sender: user.id.toString(),
      }),
    );
    setMessageInput("");
  };

  if (!user) return null;

  return (
    <div className="global-chat-box">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="text-primary-foreground chat-button fixed right-10 bottom-40 z-50 flex h-[50px] w-[50px] transform cursor-pointer items-center justify-center rounded-full bg-blue-600 transition-all duration-300 hover:scale-110 hover:rotate-12 hover:bg-blue-700"
        >
          <FaComment className="text-2xl text-white" />
        </button>
      )}

      {isOpen && (
        <div className="chat-window fixed right-10 bottom-20 z-999 w-80 rounded-xl border border-gray-300 bg-white shadow-xl">
          {/* Header */}
          <div className="chat-header flex items-center justify-between rounded-t-xl bg-blue-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2 text-base font-semibold">
              <FaComment />
              <span>Chat Cộng Đồng</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="cursor-pointer hover:text-gray-200"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages h-70 space-y-2 overflow-y-auto bg-gray-50 px-3 py-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === user.id.toString()
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-xl px-4 py-2 text-sm shadow ${
                    msg.sender === user.id.toString()
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <div className="text-xs font-medium opacity-80">
                    {msg.username}
                  </div>
                  <div>{msg.content}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input rounded-b-xl border-t bg-white px-3 py-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Nhắn gì đó..."
                className="flex-1 rounded-full border border-gray-300 px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="cursor-pointer rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700"
              >
                <FaPaperPlane />
              </button>
            </div>
            {errorMessage && (
              <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalChatBox;
