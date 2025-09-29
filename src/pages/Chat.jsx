import { useState, useEffect } from "react";
import { Avatar, TextField, IconButton, Divider } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { API_BASE_URL } from "../config";
import { jwtDecode } from "jwt-decode";
const token = localStorage.getItem("token");
const decoded = jwtDecode(token);
const userId = decoded.id;
function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/chat/${userId}`);
        const data = await res.json();
        if (data.success) {
          setConversations(data.messages);
          if (data.messages.length) setSelectedChat(data.messages[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchConversations();
  }, [userId]);

  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        const receiverId = selectedChat.userId;
        const res = await fetch(
          ` ${API_BASE_URL}/api/chat/${userId}/${receiverId}`
        );
        const data = await res.json();
        if (data.success) setMessages(data.messages);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [selectedChat, userId]);
  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      console.log(selectedChat, "selectedChat");

      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: userId,
          receiver: selectedChat.userId,
          message: newMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages([...messages, data.chat]);
        setNewMessage("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-white border-r">
        <h2 className="p-4 font-bold text-lg border-b">Chats</h2>
        <div>
          {conversations.map((c) => (
            <div
              key={c.userId}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                selectedChat?.userId === c.userId ? "bg-gray-100" : ""
              }`}
              onClick={() => setSelectedChat(c)}
            >
              <Avatar src={c.avatar || "/shelter1.png"} />
              <div className="ml-3">
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-gray-500 truncate">
                  {c.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        {selectedChat && (
          <div className="flex items-center p-4 border-b bg-white">
            <Avatar src={selectedChat.avatar || "/shelter1.png"} />
            <h2 className="ml-3 font-semibold">{selectedChat.name}</h2>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg._id || msg.id}
              className={`flex ${
                msg.sender === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs ${
                  msg.sender === userId
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-black rounded-bl-none"
                }`}
              >
                <p>{msg.message}</p>
                <span className="text-xs text-gray-300 block mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* Input Box */}
        {selectedChat && (
          <div className="p-4 flex items-center bg-white">
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <IconButton color="primary" onClick={handleSend}>
              <SendIcon />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
