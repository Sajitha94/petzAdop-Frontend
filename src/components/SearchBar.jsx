import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import allpetImg from "../assets/allpet.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

function SearchBar() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [availablePetCount, setAvailablePetCount] = useState(0);
  const [adoptedPetCount, setAdoptedPetCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user-count/count`);
        const data = await res.json();
        if (data.success) {
          setUserCount(data.users || 0);
          setAvailablePetCount(data.pets.available || 0);
          setAdoptedPetCount(data.pets.adopted || 0);
        }
      } catch (err) {
        console.error("Error fetching user counts:", err);
      }
    };
    fetchCounts();
  }, []);

  const handleSearch = () => {
    // Navigate to /searchpage with query params
    const queryParams = new URLSearchParams();
    if (searchText) queryParams.append("search", searchText);
    if (location) queryParams.append("location", location);

    navigate(`/searchpage?${queryParams.toString()}`);
  };

  return (
    <div
      className="relative flex flex-col justify-center items-center text-center px-5 py-16 sm:py-24"
      style={{
        backgroundImage: `url(${allpetImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "70vh", // ✅ better than h-[70vh] for Firefox consistency
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/70 z-0"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl w-full flex flex-col gap-6">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
          Perfect Companion
        </h1>

        <p className="text-base sm:text-lg text-gray-700">
          Connect with loving pets from trusted shelters and find your new best
          friend today.
        </p>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Pet Search */}
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 flex-1">
            <SearchIcon className="text-gray-400" />
            <input
              type="text"
              placeholder="Search pets"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="outline-none w-full text-sm sm:text-base"
            />
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 flex-1">
            <PlaceIcon className="text-gray-400" />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="outline-none w-full text-sm sm:text-base"
            />
          </div>

          <Button
            variant="contained"
            sx={{
              borderRadius: "12px",
              px: "24px",
              py: "10px",
              background: "linear-gradient(to right, #00bcd4, #ff7043)",
              textTransform: "none",
              fontWeight: "bold",
              whiteSpace: "nowrap", // ✅ prevents button text wrapping
            }}
            onClick={handleSearch}
          >
            Search Pets
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 sm:flex sm:justify-around items-center gap-4 sm:mt-6 text-center">
          <div>
            <h4 className="text-lg sm:text-2xl font-bold text-sky-600">
              {adoptedPetCount}
            </h4>
            <p className="text-gray-700 text-xs sm:text-lg">Pets Adopted</p>
          </div>
          <div>
            <h4 className="text-lg sm:text-2xl font-bold text-orange-500">
              {userCount}
            </h4>
            <p className="text-gray-700 text-xs sm:text-lg">Partner Shelters</p>
          </div>
          <div>
            <h4 className="text-lg sm:text-2xl font-bold text-green-500">
              {availablePetCount}
            </h4>
            <p className="text-gray-700 text-xs sm:text-lg">Available Now</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
