// SearchPage.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Checkbox,
  FormControlLabel,
  Button,
  Slider,
  Pagination,
  Drawer,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import PetCard from "../components/Card";
import { API_BASE_URL } from "../config";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchPage() {
  const navigate = useNavigate();
  const query = useQuery();
  const initialSearch = query.get("search") || "";
  const initialLocation = query.get("location") || "";
  const [breeds, setBreeds] = useState([]);
  const [sizes, setSizes] = useState(["small", "medium", "large"]);

  // State
  const [searchText, setSearchText] = useState(initialSearch);
  const [locationText, setLocationText] = useState(initialLocation);
  const [pets, setPets] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ breed: [], size: [], age: [0, 15] });
  const [openDrawer, setOpenDrawer] = useState(false);

  // Fetch pets from backend
  const fetchPets = async (customFilters = filters) => {
    try {
      const params = {
        search: searchText,
        location: locationText,
        page,
        limit: 6,
        breed: customFilters.breed.join(","),
        size: customFilters.size.join(","), // remove if not needed
        minAge: customFilters.age[0],
        maxAge: customFilters.age[1],
      };
      const { data } = await axios.get(`${API_BASE_URL}/api/postpet/search`, {
        params,
      });
      setPets(data.pets || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Fetch pets error:", err);
      setPets([]);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [page, searchText, locationText, filters]);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/postpet/breeds`);
        setBreeds(data.breeds);
      } catch (err) {
        console.error("Error fetching breeds:", err);
      }
    };

    fetchBreeds();
  }, []);

  // Filter toggle
  const toggleFilter = (type, value) => {
    setFilters((prev) => {
      const arr = prev[type];
      const updated = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];

      const newFilters = { ...prev, [type]: updated };
      setPage(1);
      fetchPets(newFilters); // fetch right after change
      return newFilters;
    });
  };

  // Sidebar for filters
  const sidebarContent = (
    <div className="w-72 bg-white shadow-md p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Filters</h2>

      {/* Breed */}
      <div>
        <h3 className="font-semibold mb-2">Breed</h3>
        {breeds.map((breed) => (
          <FormControlLabel
            key={breed}
            control={
              <Checkbox
                checked={filters.breed.includes(breed)}
                onChange={() => toggleFilter("breed", breed)}
              />
            }
            label={breed}
          />
        ))}
      </div>

      {/* Age */}
      <div>
        <h3 className="font-semibold mb-2">Age</h3>
        <Slider
          value={filters.age}
          onChange={(e, newValue) => {
            const newFilters = { ...filters, age: newValue };
            setFilters(newFilters);
            setPage(1);
            fetchPets(newFilters); // fetch on slider change
          }}
          valueLabelDisplay="auto"
          min={0}
          max={15}
        />
      </div>

      {/* Size */}
      <div>
        <h3 className="font-semibold mb-2">Size</h3>
        {sizes.map((size) => (
          <FormControlLabel
            key={size}
            control={
              <Checkbox
                checked={filters.size.includes(size)}
                onChange={() => toggleFilter("size", size)}
              />
            }
            label={size}
          />
        ))}
      </div>

      {/* Apply */}
      <Button
        variant="contained"
        fullWidth
        sx={{
          borderRadius: "12px",
          background: "linear-gradient(to right, #00bcd4, #ff7043)",
          textTransform: "none",
        }}
        onClick={() => {
          setPage(1);
          fetchPets(); // uses current filters
          setOpenDrawer(false);
        }}
      >
        Apply Filters
      </Button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden lg:block">{sidebarContent}</div>

      {/* Drawer for mobile */}
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        {sidebarContent}
      </Drawer>

      {/* Main content */}
      <div className="flex-1 p-6 lg:mt-0">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <IconButton
              className="lg:hidden"
              onClick={() => setOpenDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <h2 className="text-2xl font-bold">Search Results</h2>
          </div>

          {/* Search bar */}
          <div className="flex-1 w-full lg:mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search pets"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full border border-gray-300 rounded-full px-4 py-2 pr-14 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => {
                  setPage(1);
                  fetchPets();
                }}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-cyan-400 to-orange-400 hover:from-cyan-500 hover:to-orange-500 text-white px-4 py-1.5 rounded-full shadow-md flex items-center justify-center"
              >
                <SearchIcon />
              </button>
            </div>
          </div>

          {/* Post pet button */}
          <div className="flex w-full lg:w-auto justify-end">
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(to right, #00bcd4, #ff7043)",
                color: "white",
                textTransform: "none",
                fontSize: { xs: "14px", sm: "16px" },
                px: { xs: 1, sm: 2 },
                py: 1,
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
          </div>
        </div>

        {/* Pets grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(pets || []).map((pet) => (
            <PetCard key={pet._id} pet={pet} />
          ))}
        </div>

        {/* Pagination + Count */}
        <div className="flex items-center justify-between mt-6 px-2">
          <div className="flex-1 flex justify-center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              shape="rounded"
              size="large"
            />
          </div>
          <div className="flex-shrink-0 text-gray-600 text-sm">
            {pets.length} pets found
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
