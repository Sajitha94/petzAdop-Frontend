// SearchPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Checkbox,
  FormControlLabel,
  Button,
  Slider,
  Pagination,
  Drawer,
  IconButton,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import catImg from "../assets/cat1.png";
import PetCard from "../components/Card";
import SearchIcon from "@mui/icons-material/Search";
import PlaceIcon from "@mui/icons-material/Place";
const pets = [
  {
    id: 1,
    name: "Charlie",
    breed: "Golden Retriever",
    size: "Large",
    gender: "Male",
    age: 2,
    location: "San Francisco, CA",
    image: catImg,
  },
  {
    id: 2,
    name: "Bella",
    breed: "Persian Cat",
    size: "Small",
    gender: "Female",
    age: 1,
    location: "Los Angeles, CA",
    image: catImg,
  },
  {
    id: 3,
    name: "Max",
    breed: "Beagle",
    size: "Medium",
    gender: "Male",
    age: 3,
    location: "New York, NY",
    image: catImg,
  },
  {
    id: 4,
    name: "Luna",
    breed: "Siamese Cat",
    size: "Small",
    gender: "Female",
    age: 2,
    location: "Chicago, IL",
    image: catImg,
  },
  {
    id: 5,
    name: "Rocky",
    breed: "Bulldog",
    size: "Large",
    gender: "Male",
    age: 4,
    location: "Houston, TX",
    image: catImg,
  },
  {
    id: 6,
    name: "Milo",
    breed: "Rabbit",
    size: "Small",
    gender: "Male",
    age: 1,
    location: "Miami, FL",
    image: catImg,
  },
];

const breeds = ["Dog", "Cat", "Rabbit", "Bird"];
const sizes = ["Small", "Medium", "Large"];

function SearchPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ breed: [], age: [0, 15], size: [] });
  const [page, setPage] = useState(1);
  const petsPerPage = 3;
  const [openDrawer, setOpenDrawer] = useState(false);

  const startIndex = (page - 1) * petsPerPage;
  const endIndex = startIndex + petsPerPage;
  const currentPets = pets.slice(startIndex, endIndex);

  const sidebarContent = (
    <div className="w-72 bg-white shadow-md p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Filters</h2>
      <div>
        <h3 className="font-semibold mb-2">Breed</h3>
        {breeds.map((breed) => (
          <FormControlLabel key={breed} control={<Checkbox />} label={breed} />
        ))}
      </div>
      <div>
        <h3 className="font-semibold mb-2">Age</h3>
        <Slider
          value={filters.age}
          onChange={(e, newValue) => setFilters({ ...filters, age: newValue })}
          valueLabelDisplay="auto"
          min={0}
          max={15}
        />
      </div>
      <div>
        <h3 className="font-semibold mb-2">Size</h3>
        {sizes.map((size) => (
          <FormControlLabel key={size} control={<Checkbox />} label={size} />
        ))}
      </div>
      <Button
        variant="contained"
        fullWidth
        sx={{
          borderRadius: "12px",
          background: "linear-gradient(to right, #00bcd4, #ff7043)",
          textTransform: "none",
        }}
      >
        Apply Filters
      </Button>
    </div>
  );

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <div className="hidden lg:block">{sidebarContent}</div>
        <Drawer
          anchor="left"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        >
          {sidebarContent}
        </Drawer>

        <div className="flex-1 p-6  lg:mt-0">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
            {/* Left: Mobile Hamburger + Title */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <IconButton
                className="lg:hidden"
                onClick={() => setOpenDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <h2 className="text-2xl font-bold">Search Results</h2>
            </div>

            {/* Middle: Search Bar */}
            <div className="flex-1 w-full lg:mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search pets"
                  className="w-full border border-gray-300 rounded-full px-4 py-2 pr-14 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-cyan-400 to-orange-400 hover:from-cyan-500 hover:to-orange-500 text-white px-4 py-1.5 rounded-full shadow-md flex items-center justify-center"
                >
                  <SearchIcon />
                </button>
              </div>
            </div>

            {/* Right: + Post Pet Button */}
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
                onClick={() => navigate("/postpet")}
              >
                + Post Pet
              </Button>
            </div>
          </div>

          {/* Pets Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>

          {/* Pagination + Count */}
          <div className="flex items-center justify-between mt-6 px-2">
            {/* Pagination centered */}
            <div className="flex-1 flex justify-center">
              <Pagination
                count={Math.ceil(pets.length / petsPerPage)}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                shape="rounded"
                size="large"
              />
            </div>

            {/* Count aligned to right */}
            <div className="flex-shrink-0 text-gray-600 text-sm">
              {pets.length} pets found
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchPage;
