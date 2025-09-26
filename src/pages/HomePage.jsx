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
  const [visibleStart, setVisibleStart] = useState(0); // index of first visible pet
  const [total, setTotal] = useState(0);
  const limit = 10; //

  const fetchPets = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/postpet?limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setPets(data.pets);
        setTotal(data.total);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleNext = () => {
    if (visibleStart + 4 < pets.length) {
      setVisibleStart(visibleStart + 1); // slide by 1
    }
  };

  const handlePrev = () => {
    if (visibleStart > 0) {
      setVisibleStart(visibleStart - 1); // slide by 1
    }
  };

  const visiblePets = pets.slice(visibleStart, visibleStart + 4); // show 4 at a time

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
        <div className="relative w-full">
          {/* Pet list */}
          <div
            className="
      flex flex-row gap-4 overflow-x-auto p-5
      sm:grid sm:grid-cols-2 sm:gap-6 sm:p-5
      lg:grid lg:grid-cols-4
    "
          >
            {visiblePets.map((pet) => (
              <div key={pet._id} className="flex-shrink-0  sm:w-auto lg:w-auto">
                <PetCard pet={pet} />
              </div>
            ))}
          </div>

          {/* Prev Button */}
          {visibleStart > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 px-5 py-3 bg-[#00bcd4] hover:bg-gray-400  rounded-full  z-20"
            >
              ❮
            </button>
          )}

          {/* Next Button */}
          {visibleStart + 4 < total && (
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-5 py-3 bg-[#00bcd4] hover:bg-gray-400  rounded-full z-20"
            >
              ❯
            </button>
          )}
        </div>
      </Box>
    </>
  );
}

export default HomePage;
