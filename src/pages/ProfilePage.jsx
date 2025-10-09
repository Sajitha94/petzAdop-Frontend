import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Button,
  Dialog,
  Stack,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Chip,
  TextField,
  Rating,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { jwtDecode } from "jwt-decode"; // ✅ correct for v4
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

function ProfilePage() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  const userId = decoded.id;
  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        // Fetch user
        const userRes = await fetch(
          `${API_BASE_URL}/api/auth/profile/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const userData = await userRes.json();
        if (userData.status === "success") setUser(userData.data);

        // Fetch pets posted by the user
        const petRes = await fetch(
          `${API_BASE_URL}/api/postpet?limit=${limit}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const petData = await petRes.json();
        console.log(petData, "petda");

        if (petData.status === "success") {
          const userPets = petData.pets.filter(
            (pet) => pet.post_user && pet.post_user._id === userId
          );
          setPets(userPets);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [token, userId]);

  if (!user) return <p>Loading...</p>; // or a skeleton

  const handleDeletePet = async (petId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this pet?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/postpet/${petId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (
        result.status === "error" &&
        result.message?.includes("Unauthorized")
      ) {
        alert("❌ Session expired. Please login again.");
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
        return null;
      }
      if (response.ok) {
        alert("Pet deleted successfully ✅");
        // Update state so the UI removes the deleted pet
        setPets((prev) => prev.filter((p) => p._id !== petId));
      } else {
        alert(result.message || "Failed to delete ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Network error ❌");
    }
  };

  const handleDeletePhoto = async (petId, filename) => {
    const confirmDelete = window.confirm("Delete this photo?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/postpet/photo/${petId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ filename }),
        }
      );

      const result = await response.json();
      if (
        result.status === "error" &&
        result.message?.includes("Unauthorized")
      ) {
        alert("❌ Session expired. Please login again.");
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
        return null;
      }
      if (response.ok) {
        setPets((prev) =>
          prev.map((p) =>
            p._id === petId
              ? { ...p, photo: p.photo.filter((img) => img !== filename) }
              : p
          )
        );
      } else {
        alert(result.message || "Failed to delete photo ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Network error ❌");
    }
  };

  const handleDeleteVideo = async (petId, filename) => {
    const confirmDelete = window.confirm("Delete this video?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/postpet/video/${petId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ filename }),
        }
      );

      const result = await response.json();

      if (
        result.status === "error" &&
        result.message?.includes("Unauthorized")
      ) {
        alert("❌ Session expired. Please login again.");
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
        return null;
      }
      if (response.ok) {
        setPets((prev) =>
          prev.map((p) => (p._id === petId ? { ...p, video: null } : p))
        );
      } else {
        alert(result.message || "Failed to delete video ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Network error ❌");
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <Card sx={{ mb: 4, borderRadius: 3, border: "1px solid #ddd" }}>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            flexWrap: "wrap",
          }}
        >
          <Avatar
            sx={{ width: 100, height: 100 }}
            src={
              user?.profilePictures && user.profilePictures.length > 0
                ? `${API_BASE_URL}/uploads/${user.profilePictures[0]}`
                : "/static/images/avatar/1.jpg"
            }
          />

          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member since {user.createdAt?.slice(0, 10)}
            </Typography>
          </Box>
          <Button
            sx={{
              background: "linear-gradient(to right, #00bcd4, #ff7043)",
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: 3,
              px: 3,
              "&:hover": {
                background: "linear-gradient(to right, #00acc1, #f4511e)",
              },
            }}
            onClick={() => navigate("/register", { state: { user } })}
          >
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* Favorite Pets */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Favorite Pets
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {user?.favorites?.filter((favPet) => favPet.petsStatus === 1)?.length >
        0 ? (
          user.favorites
            .filter((favPet) => favPet.petsStatus === 1)
            .map((favPet) => (
              <Grid item xs={12} sm={4} key={favPet._id}>
                <Card sx={{ borderRadius: 3, border: "1px solid #ddd" }}>
                  <CardContent sx={{ textAlign: "center", p: 1 }}>
                    <Box
                      component="img"
                      src={`${API_BASE_URL}/uploads/${favPet.photo[0]}`}
                      alt={favPet.name}
                      sx={{
                        width: 200, // fixed width
                        height: 200, // fixed height
                        objectFit: "cover", // crop without distortion
                        borderRadius: 2,
                        mb: 1,
                      }}
                    />
                    <Typography variant="subtitle1" fontWeight="bold">
                      {favPet.name}
                    </Typography>
                    <Chip
                      label={favPet.breed}
                      sx={{ mt: 1, backgroundColor: "#00bcd4", color: "white" }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No favorites yet.
          </Typography>
        )}
      </Grid>

      {/* Your Pet Poster */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Your pet Poster
      </Typography>
      <Stack spacing={2} sx={{ mb: 4 }}>
        {pets.length > 0 ? (
          pets.map((pet) => (
            <Card
              key={pet._id}
              sx={{
                borderRadius: 3,
                border: "1px solid #ddd",
                overflow: "hidden",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" }, // ✅ stack on mobile
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 2,
                }}
              >
                {/* Left Section — Images + Info */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" }, // ✅ stack images + text on mobile
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 2,
                    width: "100%",
                  }}
                >
                  {/* Images */}
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    {[
                      ...(pet.photo || []),
                      ...(pet.video ? [pet.video] : []),
                    ].map((file, index) => {
                      const isVideo =
                        file.endsWith(".mp4") ||
                        file.endsWith(".webm") ||
                        file.endsWith(".ogg");

                      return (
                        <Box key={index} sx={{ position: "relative" }}>
                          {isVideo ? (
                            <Box
                              component="video"
                              src={`${API_BASE_URL}/uploads/${file}`}
                              controls
                              sx={{
                                width: { xs: 100, sm: 80 },
                                height: { xs: 100, sm: 80 },
                                borderRadius: 2,
                                objectFit: "cover",
                                backgroundColor: "#000",
                              }}
                            />
                          ) : (
                            <Box
                              component="img"
                              src={`${API_BASE_URL}/uploads/${file}`}
                              alt={`${pet.name}-${index}`}
                              sx={{
                                width: { xs: 100, sm: 80 },
                                height: { xs: 100, sm: 80 },
                                objectFit: "cover",
                                borderRadius: 2,
                              }}
                            />
                          )}

                          <Button
                            size="small"
                            onClick={() =>
                              isVideo
                                ? handleDeleteVideo(pet._id, file)
                                : handleDeletePhoto(pet._id, file)
                            }
                            sx={{
                              position: "absolute",
                              top: -8,
                              right: -8,
                              minWidth: 0,
                              padding: "2px 6px",
                              borderRadius: "50%",
                              backgroundColor: "gray",
                              color: "white",
                              fontWeight: "bold",
                              lineHeight: 1,
                            }}
                          >
                            ×
                          </Button>
                        </Box>
                      );
                    })}
                  </Box>

                  {/* Pet Info */}
                  <Box sx={{ mt: { xs: 1, sm: 0 } }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {pet.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {pet.breed} • {pet.age} • {pet.gender}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Location: {pet.location}
                    </Typography>
                  </Box>
                </Box>

                {/* Right Section — Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    width: { xs: "100%", sm: "auto" }, // ✅ buttons full-width on mobile
                    justifyContent: { xs: "flex-end", sm: "flex-start" },
                    flexWrap: "wrap",
                  }}
                >
                  {pet.petsStatus === 1 ? (
                    <>
                      {/* ✅ Edit Button */}
                      <Button
                        fullWidth={!!window.innerWidth < 600} // optional, dynamic full-width
                        sx={{
                          background:
                            "linear-gradient(to right, #00bcd4, #ff7043)",
                          color: "white",
                          fontWeight: "bold",
                          textTransform: "none",
                          borderRadius: 3,
                          px: 2,
                          "&:hover": {
                            background:
                              "linear-gradient(to right, #00acc1, #f4511e)",
                          },
                        }}
                        onClick={() => navigate("/postpet", { state: { pet } })}
                      >
                        Edit
                      </Button>

                      {/* ✅ Delete Button */}
                      <Button
                        fullWidth={!!window.innerWidth < 600}
                        sx={{
                          background:
                            "linear-gradient(to right, #00bcd4, #ff7043)",
                          color: "white",
                          fontWeight: "bold",
                          textTransform: "none",
                          borderRadius: 3,
                          px: 2,
                          "&:hover": {
                            background:
                              "linear-gradient(to right, #00acc1, #f4511e)",
                          },
                        }}
                        onClick={() => handleDeletePet(pet._id)}
                      >
                        Delete
                      </Button>
                    </>
                  ) : (
                    /* 🔵 Show Connect Adopted Button */
                    <Button
                      fullWidth={!!window.innerWidth < 600}
                      sx={{
                        background:
                          "linear-gradient(to right, #43a047, #66bb6a)",
                        color: "white",
                        fontWeight: "bold",
                        textTransform: "none",
                        borderRadius: 3,
                        px: 2,
                        "&:hover": {
                          background:
                            "linear-gradient(to right, #388e3c, #43a047)",
                        },
                      }}
                      onClick={() => navigate("/adopted-pets-status")}
                    >
                      Adopted
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No pets posted yet.
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

export default ProfilePage;
