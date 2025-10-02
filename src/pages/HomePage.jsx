import React from "react";
import SearchBar from "../components/SearchBar";
import PetCard from "../components/Card";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../config";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
function HomePage() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [visibleStart, setVisibleStart] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 10; //
  const [fosterPets, setFosterPets] = useState([]);
  const [fosterVisibleStart, setFosterVisibleStart] = useState(0);
  const [user, setUser] = useState(null);
  const fosterLimit = 4;
  const fetchPets = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/postpet?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log(data, "dat12");

      if (res.ok) {
        setPets(data.pets);
        setTotal(data.total);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFosterPets = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/auth/foster-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setFosterPets(data.data); // backend sends data under "data"
      }
    } catch (err) {
      console.error(err);
    }
  };
  const mappedFosterPets = fosterPets.map((user) => ({
    _id: user._id,
    name: user.name,
    photo: user.profilePictures || [], // use profilePictures as photos
    breed: "", // fallback
    size: "", // fallback
    gender: "", // fallback
    age: "", // fallback
    location: user.location || "Unknown",
    description: (
      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <EmailIcon fontSize="small" color="action" />
          <Typography variant="body2">{user.email}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <PhoneIcon fontSize="small" color="action" />
          <Typography variant="body2">{user.phonenumber}</Typography>
        </Box>
      </Box>
    ),
    rating: 0,
    post_user: user, // keep user info for avatar
  }));

  const handleFosterNext = () => {
    if (fosterVisibleStart + fosterLimit < fosterPets.length) {
      setFosterVisibleStart(fosterVisibleStart + 1);
    }
  };

  const handleFosterPrev = () => {
    if (fosterVisibleStart > 0) {
      setFosterVisibleStart(fosterVisibleStart - 1);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
    fetchPets();
    fetchFosterPets();
  }, []);
  const visibleFosterPets = fosterPets.slice(
    fosterVisibleStart,
    fosterVisibleStart + fosterLimit
  );

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
              onClick={() => {
                const token = localStorage.getItem("token");
                if (!token) {
                  navigate("/login");
                } else {
                  navigate("/postpet");
                }
              }}
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
                <PetCard
                  pet={pet}
                  type="pet"
                  userFavorites={user?.favorites || []}
                />
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

        {/* foster organization */}

        <div className="relative w-full">
          <h4 className="sm:text-4xl text-lg font-bold text-[#ff7043] p-5">
            {" "}
            Foster Organization{" "}
          </h4>{" "}
          <div className="flex flex-row gap-4 overflow-x-auto p-5 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid lg:grid-cols-4">
            {mappedFosterPets
              .slice(fosterVisibleStart, fosterVisibleStart + fosterLimit)
              .map((org) => (
                <div
                  key={org._id}
                  className="flex-shrink-0 sm:w-auto lg:w-auto"
                >
                  <PetCard pet={org} type="foster" />
                </div>
              ))}
          </div>
          {/* Prev Button */}
          {fosterVisibleStart > 0 && (
            <button
              onClick={handleFosterPrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 px-5 py-3 bg-[#00bcd4] hover:bg-gray-400 rounded-full z-20"
            >
              ❮
            </button>
          )}
          {/* Next Button */}
          {fosterVisibleStart + fosterLimit < fosterPets.length && (
            <button
              onClick={handleFosterNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-5 py-3 bg-[#00bcd4] hover:bg-gray-400 rounded-full z-20"
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
