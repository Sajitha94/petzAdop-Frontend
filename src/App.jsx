import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import PetsCard from "./components/Card";

function App() {
  return (
    <>
      <Header></Header>
      <SearchBar></SearchBar>
      <PetsCard></PetsCard>
    </>
  );
}

export default App;
