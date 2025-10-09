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
  IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState } from "react";
import { API_BASE_URL } from "../config";
import { useEffect } from "react";
import { useAuth } from "../context/useContext";

function PetCard({ pet = defaultPet, type = "pet", userFavorites = [] }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user, setUser } = useAuth();
  const images = pet.photo || []; // array of image filenames
  const videos = pet.video ? [pet.video] : []; // array with one video if exists
  const mediaFiles = [...images, ...videos]; // combined

  const [rating, setRating] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? mediaFiles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === mediaFiles.length - 1 ? 0 : prev + 1));
  };
  const handleClick = () => {
    if (type === "foster") {
      navigate(`/petdetails/${pet._id}`, {
        state: { pageType: "fosterDetails" }, // ✅ better to send an object
      });
    } else {
      navigate(`/petdetails/${pet._id}`, {
        state: { pageType: "petDetails" },
      });
    }
  };

  useEffect(() => {
    const fetchRating = async () => {
      if (!pet.post_user?._id) return; // safety check

      try {
        const token = localStorage.getItem("token"); // if your endpoint needs auth
        const res = await fetch(
          `${API_BASE_URL}/api/user-count/${pet.post_user._id}/rating`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const data = await res.json();

        if (res.ok) {
          setRating(data.averageRating || 0);
          setReviewsCount(data.totalReviews || 0);
        }
      } catch (err) {
        console.error("Error fetching rating:", err);
      }
    };

    fetchRating();
  }, [pet.post_user?._id]);

  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return navigate("/login");
      const res = await fetch(`${API_BASE_URL}/api/auth/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ petId: pet._id }),
      });

      const data = await res.json();

      if (data.status === "error" && data.message.includes("Unauthorized")) {
        alert("❌ Session expired. Please login again.");

        localStorage.removeItem("token");

        setUser(null);
        navigate("/login");
        return;
      }

      if (data.status === "error" && data.message.includes("Unauthorized")) {
        alert("❌ Session expired. Please login again.");

        // 🚨 Clear token from localStorage
        localStorage.removeItem("token");

        // Redirect to login
        navigate("/login");
        return;
      }

      if (res.ok) {
        setIsFavorite(!isFavorite);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Favorite error:", err);
    }
  };

  return (
    <Card
      className="flex flex-col justify-between p-2 gap-3"
      sx={{
        width: 300, // fixed width
        height: 500, // fixed height
        maxWidth: 300,
        maxHeight: 500,
        minWidth: 300,
        minHeight: 500,
        mx: "auto",
      }}
    >
      {/* Media Carousel */}
      <Box sx={{ position: "relative", width: "100%", height: "50%" }}>
        {mediaFiles.length > 0 && (
          <>
            {mediaFiles[currentIndex].endsWith(".mp4") ? (
              <video
                src={`${API_BASE_URL}/uploads/${mediaFiles[currentIndex]}`}
                controls
                className="rounded-lg bg-gray-100 cursor-pointer"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onClick={handleClick}
              />
            ) : (
              <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                <CardMedia
                  component="img"
                  alt={pet.name}
                  image={`${API_BASE_URL}/uploads/${mediaFiles[currentIndex]}`}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onClick={handleClick}
                />
                {type === "pet" && (
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: isFavorite ? "#ff7043" : "white",
                      backgroundColor: "rgba(0,0,0,0.4)",
                      p: 1,
                    }}
                    onClick={toggleFavorite}
                  >
                    {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                )}
              </Box>
            )}

            {/* Left Arrow */}
            {currentIndex > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: 8,
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  p: 1,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: "50%",
                  fontSize: 24,
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
                  right: 8,
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  p: 1,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: "50%",
                  fontSize: 24,
                }}
                onClick={handleNext}
              >
                ❯
              </Box>
            )}

            {/* Chips */}
            {(pet.gender || pet.size) && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  display: "flex",
                  gap: 1,
                }}
              >
                {pet.gender && (
                  <Chip
                    label={pet.gender}
                    size="small"
                    sx={{ backgroundColor: "#e3dfdf" }}
                  />
                )}
                {pet.size && (
                  <Chip
                    label={pet.size}
                    size="small"
                    sx={{ backgroundColor: "#e3dfdf" }}
                  />
                )}
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Content */}
      <CardContent sx={{ padding: 1, height: "35%", overflow: "hidden" }}>
        {/* Name + Rating */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            gutterBottom
            variant="h6"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 200,
            }}
          >
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
            {reviewsCount > 0 && <p>⭐ {reviewsCount}</p>}
          </Box>
        </Box>

        {/* Breed */}
        {pet.breed && (
          <Typography
            variant="subtitle2"
            sx={{ color: "text.secondary", fontSize: 12 }}
          >
            {pet.breed}
          </Typography>
        )}

        {/* Age + Location */}
        {(pet.age || pet.location) && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              mt: 0.5,
              color: "text.secondary",
              fontSize: 12,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 0.5,
                color: "text.secondary",
                fontSize: 12,
              }}
            >
              {pet.age && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CalendarTodayIcon fontSize="small" /> {pet.age} years
                </Box>
              )}
              {pet.location && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocationOnIcon fontSize="small" /> {pet.location}
                </Box>
              )}
            </Box>
            {user && pet.post_user?.name === user.name && (
              <Typography
                variant="body2"
                color="green"
                sx={{ fontSize: 12, fontWeight: "bold" }}
              >
                Own Post
              </Typography>
            )}
          </Box>
        )}

        {/* Description */}
        {pet.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              whiteSpace: "normal",
              fontSize: 12,
              mt: 0.5,
            }}
          >
            {pet.description}
          </Typography>
        )}
      </CardContent>

      {/* Buttons + Posted By */}
      <CardActions
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "15%",
        }}
      >
        {/* Meet Button */}
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            const token = localStorage.getItem("token");
            if (!token) navigate("/login");
            else
              navigate("/chat", {
                state: {
                  petId: pet._id,
                  petName: pet.name,
                  receiverId: pet.post_user?._id,
                  receiverName: pet.post_user?.name,
                },
              });
          }}
          sx={{
            background: "linear-gradient(to right, #00bcd4, #ff7043)",
            textTransform: "none",
            fontSize: 12,
            width: "100%",
          }}
        >
          Meet {pet.name?.split(" ")[0]}
        </Button>

        {/* Posted By */}
        {pet.post_user?.name && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <Avatar
              src={pet.post_user?.avatar || "/default-avatar.png"}
              alt={pet.post_user?.name}
              sx={{ width: 20, height: 20, fontSize: 10 }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: 10 }}
            >
              Posted by: {pet.post_user?.name}
            </Typography>
          </Box>
        )}
      </CardActions>
    </Card>
  );
}

export default PetCard;
