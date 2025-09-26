import React from "react";
import SearchBar from "../components/SearchBar";
import PetCard from "../components/Card";
import catImg from "../assets/cat1.png";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function HomePage() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/postpet", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setPets(data.pets);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPets();
  }, []);
  return (
    <>
      <SearchBar />
      {/* ✅ Use PetCard here */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "5px",
        }}
      >
        {/* Header Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            width: "100%",
            maxWidth: "1200px",
            px: { xs: 2, sm: 5 },
            py: 2,
          }}
        >
          {/* Title & Subtitle */}
          <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
            <h1 className="sm:text-5xl text-lg font-bold text-cyan-500 py-5">
              {" "}
              Featured Pets{" "}
            </h1>{" "}
            <p className="text-lg text-gray-500 text-left">
              {" "}
              Meet some of our amazing pets wh o are looking for their forever
              homes.{" "}
            </p>
          </Box>

          {/* Post Button */}
          <Box sx={{ flexShrink: 0 }}>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(to right, #00bcd4, #ff7043)",
                color: "white",
                textTransform: "none",
                fontSize: { xs: "14px", sm: "16px" },
                px: { xs: 3, sm: 5 },
                py: 1.2,
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                "&:hover": {
                  background: "linear-gradient(to right, #0097a7, #f4511e)",
                },
              }}
              onClick={() => navigate("/postpet")}
            >
              + Post Pet
            </Button>
          </Box>
        </Box>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full p-5">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </Box>
    </>
  );
}

export default HomePage;
