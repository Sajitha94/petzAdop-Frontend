import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import PetsCard from "./components/Card";
import Footer from "./components/Footer";
import PetDetailsPage from "./pages/PetDetailsPage";
import { Routes, Route, useLocation } from "react-router-dom";
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
function App() {
  const location = useLocation();
  const hideHeaderFooter = ["/login", "/register"].includes(location.pathname);

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
