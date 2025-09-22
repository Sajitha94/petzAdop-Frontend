import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import PetsCard from "./components/Card";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Header></Header>
      <SearchBar></SearchBar>
      <PetsCard></PetsCard>
      <Footer></Footer>
    </>
  );
}

export default App;
