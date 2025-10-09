import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import PetsCard from "./components/Card";
import Footer from "./components/Footer";
import PetDetailsPage from "./pages/PetDetailsPage";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import PostPetForm from "./pages/PostPetForm";
import LoginPage from "./auth/Login";
import RegisterPage from "./auth/Register";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/Chat";
import ForgotPasswordPage from "./auth/ForgotPage";
import { Box, Button, Typography } from "@mui/material";
import AdoppetsStatus from "./pages/AdoppetsStatus";
import ForsterPetsStatus from "./pages/ForsterPetsStatus";
import { API_BASE_URL } from "./config";
import axios from "axios";
function App() {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ Add navigate
  const [user, setUser] = useState(null);
  const hideHeaderFooter = ["/login", "/register"].includes(location.pathname);
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // You can store the user data if valid
        setUser(res.data.user);
      } catch (error) {
        console.error(
          "Token verification failed:",
          error.response?.data || error.message
        );

        // 🚨 Handle session expiration or unauthorized
        if (
          error.response?.data?.status === "error" &&
          error.response?.data?.message?.includes("Unauthorized")
        ) {
          localStorage.removeItem("token");
          setUser(null);

          alert("❌ Session expired. Please login again.");
          navigate("/login");
        }
      }
    };

    verifyToken();
  }, [navigate]);
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <Header />
      <Box sx={{ pt: { xs: 8, sm: 10 } }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/petdetails/:id" element={<PetDetailsPage />} />

          <Route path="/postpet" element={<PostPetForm />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgotpage" element={<ForgotPasswordPage />} />

          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/searchpage" element={<SearchPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/adopted-pets-status" element={<AdoppetsStatus />} />
          <Route path="/foster-pets-status" element={<ForsterPetsStatus />} />
        </Routes>
      </Box>
      {!hideHeaderFooter && <Footer />}
    </Box>
  );
}

export default App;
