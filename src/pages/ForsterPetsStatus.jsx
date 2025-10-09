import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Stepper,
  Step,
  StepLabel,
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

function ForsterPetsStatus() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [fosterPets, setFosterPets] = useState([]);
  const [fosterRequestPets, setFosterRequestPets] = useState([]);
  const [fosterReviews, setFosterReviews] = useState({});
  const [submittedReviews, setSubmittedReviews] = useState({});

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  const userId = decoded.id;
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
      {" "}
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
                              minWidth: { xs: "100%", sm: "auto" },
                              justifyContent: "flex-end",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
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
                              textAlign: { xs: "center", sm: "right" },
                              minWidth: { xs: "100%", sm: "120px" },
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

export default ForsterPetsStatus;
