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
function App() {
  const location = useLocation();
  const hideHeaderFooter = ["/login", "/register"].includes(location.pathname);
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SearchBar />
              <PetsCard />
            </>
          }
        />
        <Route path="/petdetails" element={<PetDetailsPage />} />
        <Route path="/postpet" element={<PostPetForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profilepage" element={<ProfilePage />} />
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default App;
