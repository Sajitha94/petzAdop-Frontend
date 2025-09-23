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
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useNavigate } from "react-router-dom";
import catImg from "../assets/cat1.png";

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

  return (
    <Card className="flex flex-col justify-between p-2 gap-3">
      {/* Image */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          alt={pet.name}
          className="max-h-[250px] w-full rounded-lg object-contain bg-gray-100 cursor-pointer"
          image={pet.image}
          onClick={() => navigate(`/petdetails/${pet.id}`)}
        />
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
      <CardActions sx={{ justifyContent: "space-between" }}>
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
        >
          Meet {pet.name}
        </Button>
      </CardActions>
    </Card>
  );
}

export default PetCard;
