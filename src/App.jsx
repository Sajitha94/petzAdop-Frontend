import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import PetsCard from "./components/Card";
import Footer from "./components/Footer";
import PetDetailsPage from "./pages/PetDetailsPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PostPetForm from "./pages/PostPetForm";
function App() {
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
      </Routes>
      <Footer />
    </>
  );
}

export default App;
