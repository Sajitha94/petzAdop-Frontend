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
  Stepper,
  Step,
  StepLabel,
  Chip,
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

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  const adopRequestPetsSteps = ["pending", "final"];
  const userId = decoded.id;
  const userEmail = decoded.email;
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

        if (petData.status === "success") {
          console.log(petData, "petData");

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
        if (userData.data.usertype === "foster organization") {
          const fosterRes = await fetch(
            `${API_BASE_URL}/api/foster-pet/${userId}`
          );
          const fosterData = await fosterRes.json();
          if (fosterData.status === "success") setFosterPets(fosterData.data);

          const fosterRequestTrack = await fetch(
            `${API_BASE_URL}/api/foster-pet`
          );
          const fosterrequest = await fosterRequestTrack.json();
          console.log(fosterrequest, "fosterData");

          const myRequests = fosterrequest.data.filter((pet) =>
            pet.requests.some(
              (r) =>
                r.forster_parent_ID?._id === userId ||
                r.forster_parent_ID === userId
            )
          );
          setFosterRequestPets(myRequests);
          console.log(myRequests, "myRequests");
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
        Foster Pets Requests
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
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {/* Pet Info */}
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

                {/* Requests */}
                {pet.requests?.length > 0 && (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography variant="subtitle2">
                      Adoption Requests:
                    </Typography>
                    {pet.requests.map((req) => (
                      <Box
                        key={req._id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 1,
                        }}
                      >
                        <Box sx={{ display: "flex", gap: "5px" }}>
                          <Typography variant="body2">
                            {req.forster_parent_email} ||
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            Status: {req.status} ||
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
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
                        {req.status === "pending" && (
                          <Box sx={{ display: "flex", gap: "5px" }}>
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
                          </Box>
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

      {/* Tracking Requests - Notification */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Adoption Requests Tracking status
      </Typography>
      <Stack spacing={2} sx={{ mb: 4 }}>
        {adopRequestPets.length > 0 ? (
          adopRequestPets.map((item) => (
            <Card
              key={item._id}
              sx={{ borderRadius: 3, border: "1px solid #ddd" }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "15px",
                    justifyContent: "center",
                    alignItems: "center",
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
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 2,
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {item.petInfo.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Request sent to {item.petInfo.post_user.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Requested At: {new Date(item.createdAt).toLocaleString()}
                    </Typography>
                    {item.status === "approved" && (
                      <Typography variant="body2" color="text.secondary">
                        Accepted At: {new Date(item.updatedAt).toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Stepper */}
                <Box sx={{ width: "50%" }}>
                  <Stepper
                    activeStep={item.status === "pending" ? 0 : 1}
                    alternativeLabel
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
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No adoption requests for your pets.
          </Typography>
        )}
      </Stack>
      {/* Foster Tracking Requests - Notification */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Foster Requests Tracking status
      </Typography>
      <Stack spacing={2} sx={{ mb: 4 }}>
        {fosterRequestPets.length > 0 ? (
          fosterRequestPets.map((item) => {
            // Find the request for the logged-in user
            const userRequest = item.requests.find(
              (r) =>
                r.forster_parent_ID?._id === userId ||
                r.forster_parent_ID === userId
            );

            return (
              <Card
                key={item._id}
                sx={{ borderRadius: 3, border: "1px solid #ddd" }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Box
                      component="img"
                      src={
                        item.photos[0]
                          ? `${API_BASE_URL}/uploads/${item.photos[0]}`
                          : ""
                      }
                      alt={item.name}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 2,
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Request sent to {item.fosterOrgId?.email}
                      </Typography>

                      {/* Show requestedAt and updatedAt */}
                      <Typography variant="body2" color="text.secondary">
                        Requested At:{" "}
                        {userRequest?.createdAt
                          ? new Date(userRequest.createdAt).toLocaleString()
                          : "N/A"}
                      </Typography>
                      {userRequest?.status === "accepted" && (
                        <Typography variant="body2" color="text.secondary">
                          Accepted At:{" "}
                          {userRequest?.updatedAt
                            ? new Date(userRequest.updatedAt).toLocaleString()
                            : "N/A"}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Stepper */}
                  <Box sx={{ width: "50%" }}>
                    <Stepper
                      activeStep={userRequest?.status === "pending" ? 0 : 1}
                      alternativeLabel
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
                  </Box>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary">
            No foster requests for your pets.
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
