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

function AdoppetsStatus() {
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
      console.log(data);

      if (data.status === "error" && data.message?.includes("Unauthorized")) {
        alert("❌ Session expired. Please login again.");
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
        return null;
      }
      // backend might return { status: 'success', data: [...] } or raw array
      setReviews(data.data ?? data);
    } catch (err) {
      console.error("fetchReviews error:", err);
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
        if (
          petData.status === "error" &&
          petData.message?.includes("Unauthorized")
        ) {
          alert("❌ Session expired. Please login again.");
          localStorage.removeItem("token");
          setUser(null);
          navigate("/login");
          return null;
        }

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
  }, [token, userId]);

  if (!user) return <p>Loading...</p>; // or a skeleton

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
      if (data.status === "error" && data.message?.includes("Unauthorized")) {
        alert("❌ Session expired. Please login again.");
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
        return null;
      }
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
      if (data.status === "error" && data.message?.includes("Unauthorized")) {
        alert("❌ Session expired. Please login again.");
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
        return null;
      }
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

    if (!token) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          adopter: item.petInfo.id,
          requestType: "adoption",
          comment: data.comment,
          rating: data.rating,
        }),
      });

      const result = await res.json();

      // 🛑 Token invalid or expired
      if (res.status === 401 || result?.message?.includes("Unauthorized")) {
        alert("❌ Session expired. Please login again.");
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
        return;
      }

      // ✅ On success, update local UI state
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

      // Clear input
      setReviewsInput((prev) => ({
        ...prev,
        [item._id]: { comment: "", rating: 0 },
      }));
    } catch (err) {
      console.error("Error submitting review:", err);
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
    <>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Adoption Requests
      </Typography>
      <Stack spacing={2} sx={{ mb: 4 }}>
        {pets.length > 0 ? (
          pets.map((pet) =>
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
    </>
  );
}

export default AdoppetsStatus;
