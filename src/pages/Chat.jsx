import { useState, useEffect } from "react";
import { Avatar, TextField, IconButton, Divider } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { API_BASE_URL } from "../config";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

function ChatPage() {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const userId = decoded.id;
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const { petId, petName, receiverId, receiverName } = location.state || {};

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/chat/${userId}`);
        const data = await res.json();
        if (data.success) {
          let convos = data.messages;
          if (receiverId) {
            const exists = convos.find((c) => c.userId === receiverId);
            if (!exists) {
              convos = [
                {
                  userId: receiverId,
                  name: receiverName || petName,
                  lastMessage: "",
                  avatar: "/shelter1.png",
                  petId,
                  petName,
                },
                ...convos,
              ];
            }
          }
          setConversations(convos);
          if (receiverId) {
            setSelectedChat({
              userId: receiverId,
              name: receiverName || petName,
              avatar: "/shelter1.png",
              petId,
              petName,
            });
          } else if (convos.length) {
            setSelectedChat(convos[0]);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchConversations();
  }, [userId, receiverId, receiverName, petId, petName]);

  useEffect(() => {
    if (!selectedChat) return;
    const fetchMessages = async () => {
      try {
        const receiverId = selectedChat.userId;
        const res = await fetch(
          `${API_BASE_URL}/api/chat/${userId}/${receiverId}`
        );
        const data = await res.json();
        if (data.success) setMessages(data.messages);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [selectedChat, userId]);

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/chat/unread/${userId}`);
        const data = await res.json();
        if (data.success) {
          const unreadMap = {};
          data.counts.forEach((c) => {
            unreadMap[c.userId] = c.unreadCount;
          });
          setUnreadCounts(unreadMap);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUnreadCounts();
  }, [userId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
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
      {/* Sidebar (always visible on desktop) */}
      <div
        className={`
    bg-white border-r
    fixed top-0 left-0 h-full z-20 transform transition-transform duration-300
    w-64
    ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
    lg:translate-x-0 lg:relative   /* Always visible on desktop */
    overflow-y-auto
  `}
      >
        <h2 className="p-4 font-bold text-lg border-b flex justify-between items-center">
          Chats
          {/* Close button only on mobile */}
          <IconButton
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={() => setMobileSidebarOpen(false)}
          >
            ✖
          </IconButton>
        </h2>
        <div className="flex-1 overflow-y-auto">
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
        {selectedChat ? (
          <>
            {/* Chat Header */}
            {selectedChat && (
              <div className="flex items-center p-4 border-b bg-white">
                {/* Show menu button only on mobile */}
                <IconButton
                  className="block lg:hidden"
                  onClick={() => setMobileSidebarOpen(true)}
                >
                  <MenuIcon />
                </IconButton>

                <Avatar src={selectedChat.avatar || "/shelter1.png"} />
                <h2 className="ml-3 font-semibold">{selectedChat.name}</h2>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg._id || msg.id}
                  className={`flex ${
                    msg.sender === userId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-lg ${
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

            {/* Input */}
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
