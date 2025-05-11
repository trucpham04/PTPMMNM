import { useEffect, useState } from "react";

const useGroupChat = (groupName: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Mở kết nối WebSocket
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/groupchat/${groupName}/`);

    // Lắng nghe tin nhắn từ WebSocket
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "other", text: data.message },
      ]);
    };

    setSocket(ws);

    // Đóng kết nối khi component unmount
    return () => {
      ws.close();
    };
  }, [groupName]);

  // Gửi tin nhắn tới WebSocket
  const sendMessage = (message: string) => {
    if (socket) {
      socket.send(JSON.stringify({ message }));
    }
  };

  return { messages, sendMessage };
};

export default useGroupChat;
