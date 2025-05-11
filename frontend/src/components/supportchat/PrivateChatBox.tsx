/* import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { FaComment, FaTimes, FaPaperPlane } from "react-icons/fa";
import { useAuth } from "@/contexts/authContext";

interface Message {
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
}

const PrivateChatBox = () => {
  const [messageInput, setMessageInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useAuth();
  const { receiverId } = useParams(); // ID của admin (hoặc người được chat)

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  const socketRef = useRef<WebSocket | null>(null);

  // Lấy tin nhắn cũ (lịch sử)
  const fetchMessages = useCallback(() => {
    if (user && isOpen && receiverId) {
      setLoading(true);
      fetch(`${API_URL}/api/messages?sender=${user.id}&receiver=${receiverId}`)
        .then((res) => res.json())
        .then((data) => setMessages(data))
        .catch((err) => {
          console.error("Lỗi khi tải tin nhắn:", err);
          setErrorMessage("Không thể tải tin nhắn.");
        })
        .finally(() => setLoading(false));
    }
  }, [user, receiverId, isOpen]);

  useEffect(() => {
    if (isOpen && user && !socketRef.current) {
      const socket = new WebSocket(`ws://${window.location.host}/ws/chat/`);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("WebSocket connected");
        setErrorMessage(""); // Clear any previous error
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);
        setMessages((prev) => [...prev, data]);
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
        setErrorMessage("Kết nối WebSocket đã bị đóng.");
      };

      socket.onerror = (e) => {
        console.error("WebSocket error:", e);
        setErrorMessage("Lỗi kết nối WebSocket.");
      };

      // Dọn dẹp khi component bị hủy hoặc đóng chat
      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    }
  }, [isOpen, user]);

  // Lấy lịch sử khi mở
  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen, fetchMessages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) {
      setErrorMessage("Vui lòng nhập nội dung.");
      return;
    }

    const message = {
      sender_id: user?.id,
      receiver_id: receiverId,
      message: messageInput,
    };

    if (socketRef.current) {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        console.log("Sending message:", message);
        socketRef.current.send(JSON.stringify(message));
        setMessageInput(""); // Reset input
        setErrorMessage(""); // Clear error message
      } else {
        setErrorMessage("Không thể gửi. Kết nối WebSocket chưa sẵn sàng.");
        console.error(
          "WebSocket not open. ReadyState:",
          socketRef.current.readyState,
        );
      }
    } else {
      setErrorMessage("Không thể gửi. WebSocket chưa được kết nối.");
      console.error("WebSocket not initialized.");
    }
  };

  if (!user) return null;

  return (
    <div className="private-chat-box">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chat-button fixed right-20 bottom-60 z-50"
        >
          <FaComment className="text-3xl text-white" />
        </button>
      )}

      {isOpen && (
        <div className="chat-window fixed right-4 bottom-60 z-50 w-80 overflow-hidden rounded-lg bg-blue-700">
          <div className="chat-header flex items-center justify-between bg-blue-500 p-2 font-medium text-white">
            <div className="flex items-center">
              <FaComment className="mr-2 text-white" />
              <span className="font-semibold">Chat với Admin</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="cursor-pointer text-white hover:text-gray-200"
            >
              <FaTimes />
            </button>
          </div>

          <div className="chat-messages flex h-64 flex-col space-y-2 overflow-y-auto bg-gray-50 p-3">
            {loading ? (
              <div className="text-center text-gray-500">Đang tải...</div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    Number(msg.sender) === user.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2 text-sm ${
                      Number(msg.sender) === user.id
                        ? "bg-blue-500 text-white"
                        : "border border-gray-200 bg-white text-gray-800 shadow-sm"
                    }`}
                  >
                    <div>{msg.content}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="chat-input border-t border-gray-300 bg-white p-3">
            <div className="flex items-center gap-2 text-sm">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 rounded-full border border-gray-300 bg-white p-2 px-4 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="flex items-center justify-center rounded-full bg-blue-500 p-2 text-white"
              >
                <FaPaperPlane />
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
    </div>
  );
};

export default PrivateChatBox;
 */
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/authContext";

const PrivateChatBox = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  // Mở WebSocket khi mở chat
  useEffect(() => {
    if (isOpen && user && !socketRef.current) {
      const socket = new WebSocket(
        `ws://127.0.0.1:8000/ws/chat/user_admin_chat/`,
      );

      socketRef.current = socket;

      socket.onopen = () => {
        console.log("WebSocket connected");
      };

      socket.onmessage = (event) => {
        console.log("Received message:", event.data);
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
      };

      socket.onerror = (e) => {
        console.error("WebSocket error:", e);
      };

      // Dọn dẹp khi component bị hủy
      return () => socket.close();
    }
  }, [isOpen, user]);

  if (!user) return null;

  return (
    <div className="private-chat-box">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chat-button fixed right-20 bottom-60 z-50"
        >
          Chat
        </button>
      )}

      {isOpen && (
        <div className="chat-window fixed right-4 bottom-60 z-50 w-80 overflow-hidden rounded-lg bg-blue-700">
          <div className="chat-header flex items-center justify-between bg-blue-500 p-2 font-medium text-white">
            <div className="flex items-center">
              <span className="font-semibold">Chat với Admin</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="cursor-pointer text-white hover:text-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivateChatBox;
