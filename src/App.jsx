import { useState } from "react";
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
function App() {
  const location = useLocation();
  const hideHeaderFooter = ["/login", "/register"].includes(location.pathname);
  const dummyPets = [
    {
      id: 1,
      name: "Charlie",
      breed: "Golden Retriever",
      size: "Large",
      gender: "Male",
      age: 2,
      location: "San Francisco, CA",
      rating: 4.8,
      description: "Charlie is a friendly golden retriever...",
      image: "/cat1.png",
    },
    {
      id: 2,
      name: "Bella",
      breed: "Persian Cat",
      size: "Small",
      gender: "Female",
      age: 1,
      location: "Los Angeles, CA",
      rating: 4.5,
      description: "Bella is calm and affectionate...",
      image: "/cat1.png",
    },
    {
      id: 3,
      name: "Max",
      breed: "Beagle",
      size: "Medium",
      gender: "Male",
      age: 3,
      location: "New York, NY",
      rating: 4.2,
      description: "Max is energetic and playful...",
      image: "/cat1.png",
    },
  ];
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/petdetails/:id" element={<PetDetailsPage />} />

        <Route path="/postpet" element={<PostPetForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgotpage" element={<ForgotPasswordPage />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/searchpage" element={<SearchPage />} />
        <Route path="/chatpage" element={<ChatPage />} />
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default App;
