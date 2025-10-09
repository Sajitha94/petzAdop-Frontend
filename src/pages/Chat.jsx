import { useState, useEffect } from "react";
import { Avatar, TextField, IconButton, Divider } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { API_BASE_URL } from "../config";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useAuth } from "../context/useContext";
import { useNavigate } from "react-router-dom";

function ChatPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { petId, petName, receiverId, receiverName } = location.state || {};

  const [userId, setUserId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // ✅ Decode token and get user ID
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    } catch (err) {
      console.error("Invalid or expired token:", err);
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    }
  }, [navigate, setUser]);

  // ✅ Fetch Conversations
  useEffect(() => {
    if (!userId) return;
    const fetchConversations = async () => {
      const data = await fetchWithAuth(
        `${API_BASE_URL}/api/chat/${userId}`,
        {},
        navigate,
        setUser
      );

      if (data?.success) {
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

        // ✅ Fetch profile images
        const profileMap = {};
        await Promise.all(
          convos.map(async (c) => {
            const profileData = await fetchWithAuth(
              `${API_BASE_URL}/api/auth/profile/${c.userId}`,
              {},
              navigate,
              setUser
            );
            if (profileData?.status === "success") {
              profileMap[c.userId] = profileData.data.profilePictures?.[0]
                ? `${API_BASE_URL}/uploads/${profileData.data.profilePictures[0]}`
                : "/shelter1.png";
            } else {
              profileMap[c.userId] = "/shelter1.png";
            }
          })
        );
        setUserProfiles(profileMap);

        // ✅ Auto-select receiver or first chat
        if (receiverId) {
          setSelectedChat({
            ...convos.find((c) => c.userId === receiverId),
            avatar: profileMap[receiverId] || "/shelter1.png",
          });
        } else if (convos.length) {
          setSelectedChat({
            ...convos[0],
            avatar: profileMap[convos[0].userId],
          });
        }
      }
    };

    fetchConversations();
  }, [userId, receiverId, receiverName, petId, petName, navigate, setUser]);

  // ✅ Fetch Messages
  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      const data = await fetchWithAuth(
        `${API_BASE_URL}/api/chat/${userId}/${selectedChat.userId}`,
        {},
        navigate,
        setUser
      );
      if (data?.success) {
        setMessages(data.messages);
        if (data.messages.length > 0) {
          const lastMsg = data.messages[data.messages.length - 1];
          setConversations((prev) =>
            prev.map((c) =>
              c.userId === selectedChat.userId
                ? { ...c, lastMessage: lastMsg.message }
                : c
            )
          );
        }
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedChat, userId, navigate, setUser]);

  // ✅ Fetch Unread Counts
  useEffect(() => {
    if (!userId) return;

    const fetchUnreadCounts = async () => {
      const data = await fetchWithAuth(
        `${API_BASE_URL}/api/chat/unread/${userId}`,
        {},
        navigate,
        setUser
      );
      if (data?.success) {
        const unreadMap = {};
        data.counts.forEach((c) => {
          unreadMap[c.userId] = c.unreadCount;
        });
        setUnreadCounts(unreadMap);
      }
    };

    fetchUnreadCounts();
    const interval = setInterval(fetchUnreadCounts, 3000);
    return () => clearInterval(interval);
  }, [userId, navigate, setUser]);

  // ✅ Send Message
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const data = await fetchWithAuth(
      `${API_BASE_URL}/api/chat`,
      {
        method: "POST",
        body: JSON.stringify({
          sender: userId,
          receiver: selectedChat.userId,
          message: newMessage,
        }),
      },
      navigate,
      setUser
    );

    if (data?.success) {
      setMessages((prev) => [...prev, data.chat]);
      setNewMessage("");
      setConversations((prev) =>
        prev.map((c) =>
          c.userId === selectedChat.userId
            ? { ...c, lastMessage: data.chat.message }
            : c
        )
      );
    }
  };

  return (
    <div className="flex h-130 bg-gray-100">
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
              <Avatar src={userProfiles[c.userId] || "/shelter1.png"} />
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
      <div className="flex-1 flex flex-col max-h-full">
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

                <Avatar
                  src={userProfiles[selectedChat.userId] || "/shelter1.png"}
                />
                <h2 className="ml-3 font-semibold">{selectedChat.name}</h2>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-95">
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
