import { useState, useEffect } from "react";
import { Avatar, TextField, IconButton, Divider } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { API_BASE_URL } from "../config";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
function ChatPage() {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const userId = decoded.id;
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const location = useLocation();
  const { petId, petName, receiverId, receiverName } = location.state || {};
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/chat/${userId}`);
        const data = await res.json();

        if (data.success) {
          let convos = data.messages;

          // 👉 If coming from PetCard, inject receiver (pet owner) into conversation list
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

          // Auto-select the pet chat if navigated from PetCard
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
              // onClick={() => setSelectedChat(c)}
              onClick={async () => {
                setSelectedChat(c);
                setUnreadCounts((prev) => ({ ...prev, [c.userId]: 0 }));
                try {
                  await fetch(
                    `${API_BASE_URL}/api/chat/read/${c.userId}/${userId}`,
                    {
                      method: "GET",
                    }
                  );
                } catch (err) {
                  console.error("Failed to mark as read:", err);
                }
              }}
            >
              <Avatar src={c.avatar || "/shelter1.png"} />
              <div className="flex items-center justify-between w-full">
                <div className="ml-3">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {c.lastMessage}
                  </p>
                </div>
                {unreadCounts[c.userId] > 0 && (
                  <span className="bg-gray-500 text-white text-xs rounded-full px-2 py-0.5">
                    {unreadCounts[c.userId]}
                  </span>
                )}
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
