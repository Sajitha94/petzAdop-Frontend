import React, { useEffect, useState } from "react";
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
  Chip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
// Sample images for pets
import catImg from "../assets/login background.png";
import dogImg from "../assets/allpet.png";
import rabbitImg from "../assets/Kitten and Puppy.png";
import PostPetForm from "./PostPetForm";
import { API_BASE_URL } from "../config";
import { jwtDecode } from "jwt-decode"; // ✅ correct for v4

function ProfilePage() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [editPet, setEditPet] = useState(null);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  const userId = decoded.id;
  // Fetch pets from API
  useEffect(() => {
    const fetchPets = async () => {
      try {
        // 👈 get token
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/api/postpet`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // 👈 send token
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (data.status === "success") {
          setPets(data.pets);
        }
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
  }, []);
  // Inside your ProfilePage component
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${API_BASE_URL}/api/auth/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.status === "success") setUser(data.data);
        console.log(user, "user123");
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchUser();
  }, []);

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
                ? `${API_BASE_URL}${user.profilePictures[0]}`
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
        {[catImg, dogImg, rabbitImg].map((img, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card sx={{ borderRadius: 3, border: "1px solid #ddd" }}>
              <CardContent sx={{ textAlign: "center", p: 1 }}>
                <Box
                  component="img"
                  src={img}
                  alt="pet"
                  sx={{
                    width: "100%",
                    height: 150,
                    objectFit: "cover",
                    borderRadius: 2,
                    mb: 1,
                  }}
                />
                <Typography variant="subtitle1" fontWeight="bold">
                  {index === 0 ? "Luna" : index === 1 ? "Buddy" : "Coco"}
                </Typography>
                <Chip
                  label={index === 0 ? "Cats" : index === 1 ? "Dog" : "Rabbit"}
                  sx={{ mt: 1, backgroundColor: "#00bcd4", color: "white" }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
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
              sx={{ borderRadius: 3, border: "1px solid #ddd" }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {[
                    ...(pet.photo || []),
                    ...(pet.video ? [pet.video] : []),
                  ].map((file, index) => {
                    const isVideo =
                      file.endsWith(".mp4") ||
                      file.endsWith(".webm") ||
                      file.endsWith(".ogg");

                    return (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                          display: "inline-block",
                          mr: 1,
                        }}
                      >
                        {isVideo ? (
                          <Box
                            component="video"
                            src={`${API_BASE_URL}/uploads/${file}`}
                            controls
                            sx={{
                              width: 80,
                              height: 80,
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
                              width: 80,
                              height: 80,
                              objectFit: "cover",
                              borderRadius: 2,
                            }}
                          />
                        )}

                        <Button
                          size="small"
                          onClick={() =>
                            isVideo
                              ? handleDeleteVideo(pet._id, file) // 👈 you need a delete handler for videos too
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
                          }}
                        >
                          X
                        </Button>
                      </Box>
                    );
                  })}

                  <Box>
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

                <Box sx={{ display: "flex", gap: "5px" }}>
                  <Button
                    sx={{
                      background: "linear-gradient(to right, #00bcd4, #ff7043)",
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
                    onClick={() => navigate("/postpet", { state: { pet } })} // 👈 open dialog with pet data
                  >
                    Edit
                  </Button>
                  <Button
                    sx={{
                      background: "linear-gradient(to right, #00bcd4, #ff7043)",
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

      {/* Adoption Applications - Dynamic */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Adoption Applications
      </Typography>
      <Stack spacing={2} sx={{ mb: 4 }}>
        {pets.length > 0 ? (
          pets.map((pet) => (
            <Card
              key={pet._id}
              sx={{ borderRadius: 3, border: "1px solid #ddd" }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    component="img"
                    src={pet.photo[0]}
                    alt={pet.name}
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 2,
                    }}
                  />
                  <Box>
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
                <Button
                  sx={{
                    background: "linear-gradient(to right, #00bcd4, #ff7043)",
                    color: "white",
                    fontWeight: "bold",
                    textTransform: "none",
                    borderRadius: 3,
                    px: 2,
                    "&:hover": {
                      background: "linear-gradient(to right, #00acc1, #f4511e)",
                    },
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No adoption applications found.
          </Typography>
        )}
      </Stack>
      {/* My Reviews */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        My Reviews
      </Typography>
      <Stack spacing={2} sx={{ mb: 4 }}>
        {[
          {
            shelter: "Berkeley Cat Sanctuary",
            rating: 5,
            comment: "Amazing experience!",
          },
          {
            shelter: "Happy Dog Shelter",
            rating: 4,
            comment: "Friendly staff and well-cared pets.",
          },
        ].map((review, index) => (
          <Card key={index} sx={{ borderRadius: 3, border: "1px solid #ddd" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ flex: 1 }}
                >
                  {review.shelter}
                </Typography>
                <Stack direction="row" spacing={0.5}>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <StarIcon key={i} color="warning" fontSize="small" />
                  ))}
                </Stack>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="body2">{review.comment}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

export default ProfilePage;
