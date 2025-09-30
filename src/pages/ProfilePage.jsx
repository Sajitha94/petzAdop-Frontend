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
import { API_BASE_URL } from "../config";
import { jwtDecode } from "jwt-decode"; // ✅ correct for v4

function ProfilePage() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [editPet, setEditPet] = useState(null);
  const [user, setUser] = useState(null);
  const [fosterPets, setFosterPets] = useState([]);

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  const userId = decoded.id;
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
        const petRes = await fetch(`${API_BASE_URL}/api/postpet`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const petData = await petRes.json();
        if (petData.status === "success") {
          const userPets = petData.pets.filter(
            (pet) => pet.post_user._id === userId
          );
          setPets(userPets);
        }

        // Fetch foster pets if user is foster organization
        if (userData.data.usertype === "foster organization") {
          const fosterRes = await fetch(
            `${API_BASE_URL}/api/foster-pet/${userId}`
          );
          const fosterData = await fosterRes.json();
          if (fosterData.status === "success") setFosterPets(fosterData.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [token, userId]);

  if (!user) return <p>Loading...</p>; // or a skeleton

  // useEffect(() => {
  //   const fetchFosterPets = async () => {
  //     if (!user) return;

  //     // Only fetch if user is a foster organization
  //     if (user.usertype !== "foster organization") return;

  //     try {
  //       const res = await fetch(`${API_BASE_URL}/api/foster-pet/${user._id}`);
  //       const data = await res.json();

  //       if (data.status === "success") {
  //         setFosterPets(data.data);
  //       } else {
  //         setFosterPets([]);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching foster pets:", err);
  //       setFosterPets([]);
  //     }
  //   };

  //   fetchFosterPets();
  // }, [user]);

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

  const handleRequestStatus = async (petId, requestId, status) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/postpet/request/${petId}/${requestId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        // Refresh pets to update the requests' status
        setPets((prev) =>
          prev.map((pet) =>
            pet._id === petId
              ? {
                  ...pet,
                  requests: pet.requests.map((r) =>
                    r._id === requestId ? { ...r, status } : r
                  ),
                }
              : pet
          )
        );
      } else {
        alert(data.message || "Failed to update request");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
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
        {user?.favorites?.length > 0 ? (
          user.favorites.map((favPet) => (
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
        Foster Pets
      </Typography>

      <Stack spacing={2} sx={{ mb: 4 }}>
        {fosterPets.length > 0 ? (
          fosterPets.map((pet) => (
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
                    src={`${API_BASE_URL}/uploads/${pet.photos[0]}`}
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
                  onClick={() => console.log("View details", pet._id)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No foster pets found.
          </Typography>
        )}
      </Stack>

      {/* Adoption Requests - Notification */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Adoption Requests
      </Typography>
      <Stack spacing={2} sx={{ mb: 4 }}>
        {pets.length > 0 ? (
          pets.map((pet) =>
            pet.requests.length > 0 ? (
              pet.requests.map((req) => (
                <Card
                  key={req._id}
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
                        src={
                          pet.photo[0]
                            ? `${API_BASE_URL}/uploads/${pet.photo[0]}`
                            : ""
                        }
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
                          {req.adopter_email} wants to adopt
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Status: {req.status}
                        </Typography>
                      </Box>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      {req.status === "pending" ? (
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() =>
                              handleRequestStatus(pet._id, req._id, "approved")
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() =>
                              handleRequestStatus(pet._id, req._id, "rejected")
                            }
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Typography
                          sx={{
                            color: req.status === "approved" ? "green" : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {req.status === "approved" ? "Adopted" : "Rejected"}
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography key={pet._id} variant="body2" color="text.secondary">
                No adoption requests for {pet.name}
              </Typography>
            )
          )
        ) : (
          <Typography variant="body2" color="text.secondary">
            No pets posted yet.
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
