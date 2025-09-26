import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Chip,
  Box,
  Avatar,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useNavigate } from "react-router-dom";
import catImg from "../assets/cat1.png";
import { useState } from "react";

// Default dummy pet
const defaultPet = {
  id: 0,
  name: "Charlie",
  breed: "Golden Retriever",
  size: "Large",
  gender: "Male",
  age: 2,
  location: "San Francisco, CA",
  rating: 4.8,
  description:
    "Charlie is a friendly and energetic golden retriever who loves playing fetch and swimming. He's great with kids...",
  image: catImg,
};

function PetCard({ pet = defaultPet }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = pet.photo || []; // array of image filenames
  const videos = pet.video ? [pet.video] : []; // array with one video if exists
  const mediaFiles = [...images, ...videos]; // combined

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? mediaFiles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === mediaFiles.length - 1 ? 0 : prev + 1));
  };

  return (
    <Card className="flex flex-col justify-between p-2 gap-3">
      {/* Media Carousel */}
      <Box sx={{ position: "relative" }}>
        {mediaFiles.length > 0 && (
          <>
            {mediaFiles[currentIndex].endsWith(".mp4") ? (
              <video
                src={`http://localhost:3000/uploads/${mediaFiles[currentIndex]}`}
                controls
                className="w-full rounded-lg bg-gray-100 cursor-pointer"
                style={{ height: 250, objectFit: "cover" }} // fixed height
                onClick={() => navigate(`/petdetails/${pet._id}`)}
              />
            ) : (
              <CardMedia
                component="img"
                alt={pet.name}
                image={`http://localhost:3000/uploads/${mediaFiles[currentIndex]}`}
                className="w-full rounded-lg bg-gray-100 cursor-pointer"
                style={{ height: 250, objectFit: "cover" }} // fixed height
                onClick={() => navigate(`/petdetails/${pet._id}`)}
              />
            )}

            {/* Left Arrow */}
            {currentIndex > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  px: 1,
                  backgroundColor: "rgba(0,0,0,0.3)",
                  borderRadius: "50%",
                }}
                onClick={handlePrev}
              >
                ❮
              </Box>
            )}

            {/* Right Arrow */}
            {currentIndex < mediaFiles.length - 1 && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: 0,
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  px: 1,
                  backgroundColor: "rgba(0,0,0,0.3)",
                  borderRadius: "50%",
                }}
                onClick={handleNext}
              >
                ❯
              </Box>
            )}

            {/* Chips */}
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                left: 8,
                display: "flex",
                gap: 1,
              }}
            >
              <Chip
                label={pet.gender}
                size="small"
                sx={{ backgroundColor: "#e3dfdf" }}
              />
              <Chip
                label={pet.size}
                size="small"
                sx={{ backgroundColor: "#e3dfdf" }}
              />
            </Box>
          </>
        )}
      </Box>

      {/* Content */}
      <CardContent style={{ padding: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography gutterBottom variant="h6">
            {pet.name}
          </Typography>
          <Box
            sx={{
              top: 8,
              right: 8,
              bgcolor: "white",
              px: 1,
              py: 0.2,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: 14,
            }}
          >
            <StarIcon fontSize="small" sx={{ color: "orange" }} /> {pet.rating}
          </Box>
        </Box>

        <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
          {pet.breed}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            my: 1,
            color: "text.secondary",
            fontSize: 14,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarTodayIcon fontSize="small" /> {pet.age} years
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <LocationOnIcon fontSize="small" /> {pet.location}
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {pet.description}
        </Typography>
      </CardContent>

      {/* Buttons */}
      <CardActions
        sx={{
          display: " flex",
          flexDirection: "column",
          justifyContent: "space-between",
          WebkitAlignItems: "inherit",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            size="small"
            sx={{
              fontSize: { xs: "14px", sm: "12px", lg: "14px" },
              border: "2px solid transparent",
              background: "linear-gradient(to right, #00bcd4, #ff7043)",
              textTransform: "none",
              color: "transparent",
              WebkitBackgroundClip: "text",
            }}
          >
            Learn More
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{
              background: "linear-gradient(to right, #00bcd4, #ff7043)",
              textTransform: "none",
              fontSize: { xs: "14px", sm: "12px", lg: "14px" },
            }}
            onClick={() => navigate(`/chatpage`)}
          >
            Meet {pet.name}
          </Button>
        </Box>
        {/* Posted by */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 1, // margin top to separate from buttons
          }}
        >
          <Avatar
            src={pet.post_user?.avatar || "/default-avatar.png"} // fallback avatar
            alt={pet.post_user?.name}
            sx={{ width: 24, height: 24, fontSize: 12 }}
          />
          <Typography variant="body2" color="text.secondary">
            Posted by: {pet.post_user?.name || "Unknown"}
          </Typography>
        </Box>
      </CardActions>
    </Card>
  );
}

export default PetCard;
