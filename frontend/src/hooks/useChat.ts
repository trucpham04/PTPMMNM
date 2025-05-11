import { useEffect, useState, useRef } from "react";

type Message = {
  sender: string;
  message: string;
};

export default function useChat(
  currentUsername: string,
  otherUsername: string,
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket(
      `ws://localhost:8000/ws/chat/${otherUsername}/`,
    );

    socketRef.current.onmessage = (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => {
      socketRef.current?.close();
    };
  }, [otherUsername]);

  const sendMessage = (message: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message }));
    }
  };

  return { messages, sendMessage };
}
