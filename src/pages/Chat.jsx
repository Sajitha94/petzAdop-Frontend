import { useState } from "react";
import { Avatar, TextField, IconButton, Divider } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const conversations = [
  { id: 1, name: "Shelter A", avatar: "/shelter1.png", lastMessage: "Yes, Bella is available!" },
  { id: 2, name: "Adopter John", avatar: "/adopter.png", lastMessage: "When can I visit?" },
];

const messagesMock = [
  { id: 1, sender: "me", text: "Hi, I’m interested in Bella 🐾", time: "10:30 AM" },
  { id: 2, sender: "other", text: "Yes, she’s available. Would you like to visit?", time: "10:32 AM" },
];

function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [messages, setMessages] = useState(messagesMock);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: Date.now(),
      sender: "me",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-white border-r">
        <h2 className="p-4 font-bold text-lg border-b">Chats</h2>
        <div>
          {conversations.map((c) => (
            <div
              key={c.id}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                selectedChat?.id === c.id ? "bg-gray-100" : ""
              }`}
              onClick={() => setSelectedChat(c)}
            >
              <Avatar src={c.avatar} />
              <div className="ml-3">
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-gray-500 truncate">{c.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center p-4 border-b bg-white">
          <Avatar src={selectedChat.avatar} />
          <h2 className="ml-3 font-semibold">{selectedChat.name}</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs ${
                  msg.sender === "me"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-black rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-xs text-gray-300 block mt-1">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* Input Box */}
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
      </div>
    </div>
  );
}

export default ChatPage;
