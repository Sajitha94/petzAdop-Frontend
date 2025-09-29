import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import allpetImg from "../assets/allpet.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SearchBar() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    // Navigate to /searchpage with query params
    const queryParams = new URLSearchParams();
    if (searchText) queryParams.append("search", searchText);
    if (location) queryParams.append("location", location);

    navigate(`/searchpage?${queryParams.toString()}`);
  };

  return (
    <div
      className="relative h-[70vh] flex flex-col justify-center items-center text-center px-5"
      style={{
        backgroundImage: `url(${allpetImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/70 z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-6">
        <h1 className="sm:text-5xl text-xl font-extrabold text-gray-900">
          Perfect Companion
        </h1>
        <p className="text-lg text-gray-700 ">
          Connect with loving pets from trusted shelters and find your new best
          friend today.
        </p>

        {/* Search Inputs */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 flex-1">
            <SearchIcon className="text-gray-400" />
            <input
              type="text"
              placeholder="Search pets"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 flex-1">
            <PlaceIcon className="text-gray-400" />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="outline-none w-full"
            />
          </div>

          <Button
            variant="contained"
            sx={{
              borderRadius: "12px",
              paddingX: "24px",
              background: "linear-gradient(to right, #00bcd4, #ff7043)",
              textTransform: "none",
              fontWeight: "bold",
            }}
            onClick={handleSearch}
          >
            Search Pets
          </Button>
        </div>

        {/* Stats */}
        <div className="flex justify-around items-center gap-3 w-full mt-6 text-center">
          <div>
            <h4 className="sm:text-2xl text-lg font-bold text-sky-600">
              12,000+
            </h4>
            <p className="text-gray-700 text-sm sm:text-lg">Pets Adopted</p>
          </div>
          <div>
            <h4 className="sm:text-2xl text-lg font-bold text-orange-500">
              500+
            </h4>
            <p className="text-gray-700 text-sm sm:text-lg">Partner Shelters</p>
          </div>
          <div>
            <h4 className="sm:text-2xl text-lg font-bold text-green-500">
              1,200
            </h4>
            <p className="text-gray-700 text-sm sm:text-lg">Available Now</p>
          </div>
          <div>
            <h4 className="sm:text-2xl text-lg font-bold text-sky-600">98%</h4>
            <p className="text-gray-700 text-sm sm:text-lg">Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
