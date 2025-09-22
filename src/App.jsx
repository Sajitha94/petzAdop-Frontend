import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import PetsCard from "./components/Card";
import Footer from "./components/Footer";
import PetDetailsPage from "./components/pages/PetDetailsPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
      </Routes>
      <Footer />
    </>
  );
}

export default App;
