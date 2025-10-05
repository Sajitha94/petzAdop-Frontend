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
  const [adopRequestPets, setAdopRequestPets] = useState([]);
  const [editPet, setEditPet] = useState(null);
  const [user, setUser] = useState(null);
  const [fosterPets, setFosterPets] = useState([]);
  const [fosterRequestPets, setFosterRequestPets] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsInput, setReviewsInput] = useState({});
  const [fosterReviews, setFosterReviews] = useState({});
  const [submittedReviews, setSubmittedReviews] = useState({});

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  const userId = decoded.id;
  const userEmail = decoded.email;
  const limit = 10;

  const fetchReviews = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      // backend might return { status: 'success', data: [...] } or raw array
      setReviews(data.data ?? data);
    } catch (err) {
      console.error("fetchReviews error:", err);
    }
  };

  const fetchFosterPetsReviews = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/foster-reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === "success") {
        // Convert array of reviews into object keyed by petId
        const reviewsMap = {};
        data.reviews.forEach((rev) => {
          if (rev.fosterParentId === userId) {
            reviewsMap[rev.petId] = rev;
          }
        });
        setSubmittedReviews(reviewsMap);
      }
    } catch (err) {
      console.error(err);
    }
  };

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

        if (petData.status === "success") {
          const userPets = petData.pets.filter(
            (pet) => pet.post_user && pet.post_user._id === userId
          );
          setPets(userPets);

          const filteredRequests = petData.pets.flatMap(
            (pet) =>
              pet.requests
                ?.filter(
                  (req) =>
                    req.adopter_email?.trim().toLowerCase() ===
                    userEmail?.trim().toLowerCase()
                )
                .map((req) => ({
                  ...req,
                  petInfo: {
                    id: pet._id,
                    name: pet.name,
                    age: pet.age,
                    breed: pet.breed,
                    size: pet.size,
                    gender: pet.gender,
                    color: pet.color,
                    location: pet.location,
                    medical_history: pet.medical_history,
                    description: pet.description,
                    photo: pet.photo,
                    video: pet.video,
                    post_user: pet.post_user || null, // ✅ avoid crash
                  },
                })) || []
          );

          setAdopRequestPets(filteredRequests);
        }

        // Fetch foster pets if user is foster organization

        const fosterRes = await fetch(
          `${API_BASE_URL}/api/foster-pet/${userId}`
        );
        const fosterData = await fosterRes.json();
        if (fosterData.status === "success") setFosterPets(fosterData.data);

        const fosterRequestTrack = await fetch(
          `${API_BASE_URL}/api/foster-pet`
        );
        const fosterrequest = await fosterRequestTrack.json();

        const myRequests = fosterrequest.data.filter((pet) =>
          pet.requests.some(
            (r) =>
              r.forster_parent_ID?._id === userId ||
              r.forster_parent_ID === userId
          )
        );
        setFosterRequestPets(myRequests);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    fetchReviews();
    fetchFosterPetsReviews();
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
  const handleUpdateRequestStatus = async (petId, requestId, status) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/foster-pet/request/${petId}/${requestId}`,
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
        // Update state locally
        setFosterPets((prev) =>
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
        console.error(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReview = async (item) => {
    const data = reviewsInput[item._id];
    if (!data?.comment || !data?.rating) return;

    try {
      // Call backend API
      await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // if needed
        },
        body: JSON.stringify({
          adopter: item.petInfo.id,
          requestType: "adoption",
          comment: data.comment,
          rating: data.rating,
        }),
      });
      // Update local state: add review to this item
      setAdopRequestPets((prev) =>
        prev.map((req) =>
          req._id === item._id
            ? {
                ...req,
                review: {
                  comment: data.comment,
                  rating: data.rating,
                  createdAt: new Date(),
                },
              }
            : req
        )
      );

      // Clear input for this card
      setReviewsInput((prev) => ({
        ...prev,
        [item._id]: { comment: "", rating: 0 },
      }));
    } catch (err) {
      console.error(err);
    }
  };
  const handleFosterReviewSubmit = async (petId) => {
    const { rating, comment } = fosterReviews[petId] || {};
    if (!rating || !comment) {
      alert("Please provide both rating and comment");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/api/foster-reviews`,
        { petId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 201) {
        // Store submitted review
        setSubmittedReviews((prev) => ({
          ...prev,
          [petId]: res.data.newReview,
        }));

        // Reset input
        setFosterReviews((prev) => ({
          ...prev,
          [petId]: { rating: 0, comment: "" },
        }));
      }
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "❌ Failed to submit foster review"
      );
    }
  };

  const CustomStepIcon = (props) => {
    const { active, completed, status } = props;

    if (status === "approved" || status === "accepted")
      return <CheckCircleIcon color="success" />;
    if (status === "rejected") return <CancelIcon color="error" />;
    return <RadioButtonUncheckedIcon color={active ? "primary" : "disabled"} />;
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
                  <Button
                    fullWidth={!!window.innerWidth < 600} // optional, dynamic full-width
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
                    onClick={() => navigate("/postpet", { state: { pet } })}
                  >
                    Edit
                  </Button>
                  <Button
                    fullWidth={!!window.innerWidth < 600}
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
        Foster Pets Requests
      </Typography>

      <Stack spacing={2} sx={{ mb: 4 }}>
        {fosterPets.length > 0 ? (
          fosterPets.map((pet) => (
            <Card
              key={pet._id}
              sx={{
                borderRadius: 3,
                border: "1px solid #ddd",
                p: { xs: 1.5, sm: 2 },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {/* 🐾 Pet Info */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 2,
                  }}
                >
                  <Box
                    component="img"
                    src={`${API_BASE_URL}/uploads/${pet.photos[0]}`}
                    alt={pet.name}
                    sx={{
                      width: { xs: "100%", sm: 80 },
                      height: { xs: 180, sm: 80 },
                      objectFit: "cover",
                      borderRadius: 2,
                    }}
                  />

                  <Box sx={{ width: "100%" }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
                    >
                      {pet.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                    >
                      {pet.breed} • {pet.age} • {pet.gender}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                    >
                      Location: {pet.location}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Start:{" "}
                      {pet.start_date
                        ? new Date(pet.start_date).toLocaleDateString()
                        : "N/A"}{" "}
                      | End:{" "}
                      {pet.end_date
                        ? new Date(pet.end_date).toLocaleDateString()
                        : "N/A"}
                    </Typography>
                  </Box>
                </Box>

                {/* 📬 Requests */}
                {pet.requests?.length > 0 && (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "0.95rem", sm: "1rem" },
                      }}
                    >
                      Foster Requests:
                    </Typography>

                    {pet.requests.map((req) => (
                      <Box
                        key={req._id}
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                          justifyContent: "space-between",
                          gap: { xs: 1.5, sm: 1 },
                          p: { xs: 1.5, sm: 1 },
                          borderRadius: 2,
                          backgroundColor: { xs: "#f9f9f9", sm: "transparent" },
                        }}
                      >
                        {/* Left Section - Request Info */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: { xs: 0.5, sm: 1 },
                            width: "100%",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: { xs: "0.9rem", sm: "1rem" },
                              fontWeight: "bold",
                            }}
                          >
                            {req.forster_parent_email}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                          >
                            Status:{" "}
                            <span
                              style={{
                                color:
                                  req.status === "accepted"
                                    ? "green"
                                    : req.status === "rejected"
                                    ? "red"
                                    : "orange",
                                fontWeight: "bold",
                              }}
                            >
                              {req.status}
                            </span>
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                          >
                            {req.status === "accepted" ? (
                              <>
                                Accepted At:{" "}
                                {req.updatedAt
                                  ? new Date(req.updatedAt).toLocaleString()
                                  : "N/A"}
                              </>
                            ) : (
                              <>
                                Requested At:{" "}
                                {req.createdAt
                                  ? new Date(req.createdAt).toLocaleString()
                                  : "N/A"}
                              </>
                            )}
                          </Typography>
                        </Box>

                        {/* Right Section - Actions or Status */}
                        {req.status === "pending" ? (
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                            sx={{
                              width: { xs: "100%", sm: "auto" },
                              mt: { xs: 1, sm: 0 },
                            }}
                          >
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              fullWidth={true}
                              onClick={() =>
                                handleUpdateRequestStatus(
                                  pet._id,
                                  req._id,
                                  "accepted"
                                )
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              fullWidth={true}
                              onClick={() =>
                                handleUpdateRequestStatus(
                                  pet._id,
                                  req._id,
                                  "rejected"
                                )
                              }
                            >
                              Reject
                            </Button>
                          </Stack>
                        ) : (
                          <Typography
                            sx={{
                              color:
                                req.status === "accepted" ? "green" : "red",
                              fontWeight: "bold",
                              textAlign: { xs: "center", sm: "left" },
                              width: "100%",
                            }}
                          >
                            {req.status === "accepted"
                              ? "Approved"
                              : "Rejected"}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
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
                  sx={{
                    borderRadius: 3,
                    border: "1px solid #ddd",
                    p: { xs: 1.5, sm: 2 },
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-between",
                      alignItems: { xs: "flex-start", sm: "center" },
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    {/* Pet Info Section */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        gap: 2,
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      <Box
                        component="img"
                        src={
                          pet.photo[0]
                            ? `${API_BASE_URL}/uploads/${pet.photo[0]}`
                            : ""
                        }
                        alt={pet.name}
                        sx={{
                          width: { xs: "100%", sm: 80 },
                          height: { xs: 180, sm: 80 },
                          objectFit: "cover",
                          borderRadius: 2,
                        }}
                      />

                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
                        >
                          {pet.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                        >
                          {req.adopter_email} wants to adopt
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                        >
                          Status:{" "}
                          <span
                            style={{
                              color:
                                req.status === "approved"
                                  ? "green"
                                  : req.status === "rejected"
                                  ? "red"
                                  : "orange",
                              fontWeight: "bold",
                            }}
                          >
                            {req.status}
                          </span>
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {req.status === "approved" ? (
                            <>
                              Accepted At:{" "}
                              {req.updatedAt
                                ? new Date(req.updatedAt).toLocaleString()
                                : "N/A"}
                            </>
                          ) : (
                            <>
                              Requested At:{" "}
                              {req.createdAt
                                ? new Date(req.createdAt).toLocaleString()
                                : "N/A"}
                            </>
                          )}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Action Buttons / Status */}
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                      {req.status === "pending" &&
                      !pet.requests.some((r) => r.status !== "pending") ? (
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            fullWidth={true}
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
                            fullWidth={true}
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
                            textAlign: { xs: "center", sm: "left" },
                            width: "100%",
                          }}
                        >
                          {req.status === "approved" ? "Adopted" : "Rejected"}
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>

                  {/* Review Section */}
                  {req.status === "approved" && req.review && (
                    <Box
                      sx={{
                        mt: 2,
                        bgcolor: "#f9f9f9",
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          gap: 1,
                          alignItems: { xs: "flex-start", sm: "center" },
                          mt: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: "bold",
                            fontSize: { xs: "0.9rem" },
                          }}
                        >
                          Review:
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: { xs: "0.9rem" } }}
                        >
                          {req.adopter_email}
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{ fontSize: { xs: "0.9rem" }, mt: 1 }}
                      >
                        {req.review.comment}
                      </Typography>

                      <Rating
                        value={req.review.rating}
                        readOnly
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  )}
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

      {/* Tracking Requests - Notification */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Adoption Requests Tracking status
      </Typography>
      <Stack spacing={2} sx={{ mb: 4 }}>
        {adopRequestPets.length > 0 ? (
          adopRequestPets.map((item) => (
            <Card
              key={item._id}
              sx={{
                borderRadius: 3,
                border: "1px solid #ddd",
                p: { xs: 2, sm: 2.5 },
                boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 2, sm: 3 },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                }}
              >
                {/* Pet Info */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 1.5, sm: 2 },
                    alignItems: { xs: "flex-start", sm: "center" },
                    width: "100%",
                  }}
                >
                  <Box
                    component="img"
                    src={
                      item.petInfo.photo[0]
                        ? `${API_BASE_URL}/uploads/${item.petInfo.photo[0]}`
                        : ""
                    }
                    alt={item.petInfo.name}
                    sx={{
                      width: { xs: "100%", sm: 80 },
                      height: { xs: 180, sm: 80 },
                      objectFit: "cover",
                      borderRadius: 2,
                    }}
                  />

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
                    >
                      {item.petInfo.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
                    >
                      Request sent to {item.petInfo.post_user.email}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
                    >
                      Requested: {new Date(item.createdAt).toLocaleString()}
                    </Typography>
                    {item.status !== "pending" && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
                      >
                        {item.status === "approved"
                          ? `Accepted: ${new Date(
                              item.updatedAt
                            ).toLocaleString()}`
                          : `Rejected: ${new Date(
                              item.updatedAt
                            ).toLocaleString()}`}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Stepper (sm & above only) */}
                <Box
                  sx={{
                    width: { xs: "100%", sm: "50%" },
                    mt: { xs: 1.5, sm: 0 },
                  }}
                >
                  <Stepper
                    activeStep={item.status === "pending" ? 0 : 1}
                    alternativeLabel
                    sx={{
                      display: { xs: "none", sm: "flex" },
                    }}
                  >
                    <Step>
                      <StepLabel
                        StepIconComponent={(props) => (
                          <CustomStepIcon {...props} status="pending" />
                        )}
                      >
                        Pending
                      </StepLabel>
                    </Step>
                    <Step>
                      <StepLabel
                        StepIconComponent={(props) => (
                          <CustomStepIcon {...props} status={item.status} />
                        )}
                      >
                        {item.status === "approved" ? "Accepted" : "Rejected"}
                      </StepLabel>
                    </Step>
                  </Stepper>

                  {/* Mobile Status Tag */}
                  <Box
                    sx={{
                      display: { xs: "flex", sm: "none" },
                      justifyContent: "center",
                      mt: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "bold",
                        color:
                          item.status === "approved"
                            ? "green"
                            : item.status === "rejected"
                            ? "red"
                            : "gray",
                      }}
                    >
                      Status: {item.status.toUpperCase()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              {/* Review Section */}
              {item.review ? (
                <Box sx={{ mt: 2, bgcolor: "#f9f9f9", p: 2, borderRadius: 2 }}>
                  <Typography variant="body2" fontWeight="bold">
                    Your Review:
                  </Typography>
                  <Typography variant="body2">{item.review.comment}</Typography>
                  <Rating value={item.review.rating} readOnly sx={{ mt: 1 }} />
                </Box>
              ) : (
                item.status === "approved" && (
                  <Box
                    sx={{
                      mt: 2,
                      bgcolor: "#fafafa",
                      p: 2,
                      borderRadius: 2,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ mb: 1, color: "#333" }}
                    >
                      Write a Review
                    </Typography>

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      alignItems={{ xs: "stretch", sm: "center" }}
                    >
                      <TextField
                        label="Write a review"
                        fullWidth
                        multiline
                        minRows={1}
                        value={reviewsInput[item._id]?.comment || ""}
                        onChange={(e) =>
                          setReviewsInput((prev) => ({
                            ...prev,
                            [item._id]: {
                              ...prev[item._id],
                              comment: e.target.value,
                            },
                          }))
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />

                      <Rating
                        name={`rating-${item._id}`}
                        value={reviewsInput[item._id]?.rating || 0}
                        onChange={(e, newValue) =>
                          setReviewsInput((prev) => ({
                            ...prev,
                            [item._id]: {
                              ...prev[item._id],
                              rating: newValue,
                            },
                          }))
                        }
                        sx={{
                          "& .MuiRating-iconFilled": { color: "#ff7043" },
                          alignSelf: { xs: "flex-start", sm: "center" },
                        }}
                      />

                      <Button
                        variant="contained"
                        onClick={() => handleSubmitReview(item)}
                        sx={{
                          background:
                            "linear-gradient(to right, #00bcd4, #ff7043)",
                          textTransform: "none",
                          borderRadius: 2,
                          fontWeight: "bold",
                          px: 3,
                          py: 1,
                          fontSize: "0.9rem",
                          width: { xs: "100%", sm: "auto" },
                          "&:hover": {
                            background:
                              "linear-gradient(to right, #0097a7, #f4511e)",
                          },
                        }}
                      >
                        Submit
                      </Button>
                    </Stack>
                  </Box>
                )
              )}
            </Card>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No adoption requests yet.
          </Typography>
        )}
      </Stack>

      {/* Foster Tracking Requests - Notification */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Foster Requests Tracking Status
      </Typography>

      <Stack spacing={2} sx={{ mb: 4 }}>
        {fosterRequestPets.length > 0 ? (
          fosterRequestPets.map((item) => {
            const userRequest = item.requests.find(
              (r) =>
                r.forster_parent_ID?._id === userId ||
                r.forster_parent_ID === userId
            );

            return (
              <Card
                key={item._id}
                sx={{
                  borderRadius: 3,
                  border: "1px solid #ddd",
                  p: { xs: 2, sm: 2.5 },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 2, sm: 3 },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                  }}
                >
                  {/* Pet Info */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: { xs: 1.5, sm: 2 },
                      alignItems: { xs: "flex-start", sm: "center" },
                      width: "100%",
                    }}
                  >
                    <Box
                      component="img"
                      src={
                        item.photos[0]
                          ? `${API_BASE_URL}/uploads/${item.photos[0]}`
                          : ""
                      }
                      alt={item.name}
                      sx={{
                        width: { xs: "100%", sm: 80 },
                        height: { xs: 180, sm: 80 },
                        objectFit: "cover",
                        borderRadius: 2,
                      }}
                    />

                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
                      >
                        Request sent to {item.fosterOrgId?.email}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
                      >
                        Requested At:{" "}
                        {userRequest?.createdAt
                          ? new Date(userRequest.createdAt).toLocaleString()
                          : "N/A"}
                      </Typography>
                      {(userRequest?.status === "accepted" ||
                        userRequest?.status === "rejected") && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
                        >
                          {userRequest.status === "accepted"
                            ? "Accepted At: "
                            : "Rejected At: "}
                          {userRequest?.updatedAt
                            ? new Date(userRequest.updatedAt).toLocaleString()
                            : "N/A"}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Stepper for desktop/tablet */}
                  <Box
                    sx={{
                      width: { xs: "100%", sm: "40%" },
                      mt: { xs: 1.5, sm: 0 },
                    }}
                  >
                    <Stepper
                      activeStep={userRequest?.status === "pending" ? 0 : 1}
                      alternativeLabel
                      sx={{ display: { xs: "none", sm: "flex" } }}
                    >
                      <Step>
                        <StepLabel
                          StepIconComponent={(props) => (
                            <CustomStepIcon {...props} status="pending" />
                          )}
                        >
                          Pending
                        </StepLabel>
                      </Step>
                      <Step>
                        <StepLabel
                          StepIconComponent={(props) => (
                            <CustomStepIcon
                              {...props}
                              status={userRequest?.status}
                            />
                          )}
                        >
                          {userRequest?.status === "accepted"
                            ? "Accepted"
                            : "Rejected"}
                        </StepLabel>
                      </Step>
                    </Stepper>

                    {/* Mobile Status Text */}
                    <Box
                      sx={{
                        display: { xs: "flex", sm: "none" },
                        justifyContent: "center",
                        mt: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "bold",
                          color:
                            userRequest?.status === "accepted"
                              ? "green"
                              : userRequest?.status === "rejected"
                              ? "red"
                              : "gray",
                        }}
                      >
                        Status:{" "}
                        {userRequest?.status?.toUpperCase() || "PENDING"}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                {/* Review Section */}
                {userRequest?.status === "accepted" && (
                  <Box
                    sx={{
                      mt: 1,
                      bgcolor: "#fafafa",
                      p: 2,
                      borderRadius: 2,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    }}
                  >
                    {!submittedReviews[item._id] ? (
                      <>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          sx={{ mb: 1, color: "#333" }}
                        >
                          Leave a Review
                        </Typography>

                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={2}
                          alignItems={{ xs: "stretch", sm: "center" }}
                        >
                          <TextField
                            label="Write your comment..."
                            multiline
                            minRows={1}
                            value={fosterReviews[item._id]?.comment || ""}
                            onChange={(e) =>
                              setFosterReviews((prev) => ({
                                ...prev,
                                [item._id]: {
                                  ...prev[item._id],
                                  comment: e.target.value,
                                },
                              }))
                            }
                            sx={{
                              flexGrow: { xs: 1, sm: 2 },
                              "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
                          />

                          <Rating
                            name={`foster-rating-${item._id}`}
                            value={fosterReviews[item._id]?.rating || 0}
                            onChange={(e, newValue) =>
                              setFosterReviews((prev) => ({
                                ...prev,
                                [item._id]: {
                                  ...prev[item._id],
                                  rating: newValue,
                                },
                              }))
                            }
                            sx={{
                              "& .MuiRating-iconFilled": { color: "#ff7043" },
                            }}
                          />

                          <Button
                            variant="contained"
                            onClick={() => handleFosterReviewSubmit(item._id)}
                            sx={{
                              background:
                                "linear-gradient(to right, #00bcd4, #ff7043)",
                              textTransform: "none",
                              borderRadius: 2,
                              fontWeight: "bold",
                              px: 3,
                              py: 1,
                              width: { xs: "100%", sm: "auto" },
                              "&:hover": {
                                background:
                                  "linear-gradient(to right, #0097a7, #f4511e)",
                              },
                            }}
                          >
                            Submit Review
                          </Button>
                        </Stack>
                      </>
                    ) : (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Your Review
                        </Typography>
                        <Rating
                          name={`submitted-rating-${item._id}`}
                          value={submittedReviews[item._id].rating}
                          readOnly
                        />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {submittedReviews[item._id].comment}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Card>
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No foster requests for your pets.
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

export default ProfilePage;
