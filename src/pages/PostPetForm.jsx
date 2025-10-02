import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Button,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

export default function PostPetForm({
  initialData,
  onClose,
  fosterForm = false,
  fosterOrgId,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const pet = location.state?.pet || initialData || null;
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      age: "",
      breed: "",
      size: "Medium",
      gender: "Female",
      color: "",
      location: "",
      medical_history: "",
      description: "",
    }
  );
  const [photoFiles, setPhotoFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || "",
        age: pet.age || "",
        breed: pet.breed || "",
        size: pet.size
          ? pet.size.charAt(0).toUpperCase() + pet.size.slice(1).toLowerCase()
          : "Medium",
        gender: pet.gender
          ? pet.gender.charAt(0).toUpperCase() +
            pet.gender.slice(1).toLowerCase()
          : "Female",
        color: pet.color || "",
        location: pet.location || "",
        medical_history: pet.medical_history || "",
        description: pet.description || "",
      });
    }
  }, [pet]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    setPhotoFiles(Array.from(e.target.files));
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Use FormData for file upload
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    photoFiles.forEach((file, idx) => {
      data.append("photos", file); // backend should accept 'photos' as array
    });

    if (videoFile) {
      data.append("video", videoFile);
    }
    if (fosterForm) {
      // Foster pet submission
      data.append("fosterOrgId", fosterOrgId);

      try {
        const response = await fetch(`${API_BASE_URL}/api/foster-pet/`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        });
        const result = await response.json();
        if (response.ok) {
          setMessage("Foster pet posted successfully ✅");

          if (onClose) onClose();
        } else {
          setMessage(result.message || "Something went wrong ❌");
        }
      } catch (err) {
        console.error(err);
        setMessage("Network error ❌");
      }
    } else {
      try {
        const url = pet
          ? `${API_BASE_URL}/api/postpet/${pet._id}`
          : `${API_BASE_URL}/api/postpet/`;

        const method = pet ? "PUT" : "POST";
        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        });

        const result = await response.json();

        if (response.ok) {
          setMessage(
            initialData
              ? "Pet updated successfully ✅"
              : "Pet posted successfully ✅"
          );
          navigate("/");
          if (onClose) onClose(); // 👈 close dialog after submit
        } else {
          setMessage(result.message || "Something went wrong ❌");
        }
      } catch (error) {
        console.error(error);
        setMessage("Network error ❌");
      }
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: { xs: 2, sm: 4 },
        py: 6,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 800 }}>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            border: "1px solid #eee",
          }}
        >
          <CardContent sx={{ px: { xs: 2, sm: 4 }, py: { xs: 3, sm: 4 } }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: "linear-gradient(to right, #00bcd4, #ff7043)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 3,
              }}
            >
              {pet ? "Edit Pet" : "Post a New Pet"}
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3.5}>
                {/* Text Fields */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="name"
                    label="Pet Name"
                    fullWidth
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="age"
                    label="Age"
                    fullWidth
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 2 years"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="breed"
                    label="Breed"
                    fullWidth
                    value={formData.breed}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="size"
                    label="Size"
                    fullWidth
                    select
                    value={formData.size || "Medium"}
                    onChange={handleChange}
                  >
                    <MenuItem value="Small">Small</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Large">Large</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="gender"
                    label="Gender"
                    fullWidth
                    select
                    value={formData.gender || "Female"}
                    onChange={handleChange}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="color"
                    label="Color"
                    fullWidth
                    value={formData.color}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="location"
                    label="Location"
                    fullWidth
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="medical_history"
                    label="Medical History"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.medical_history}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="description"
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell adopters about the pet’s personality, behavior, and needs"
                  />
                </Grid>

                {/* Photo Upload */}
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{
                      border: "2px dashed #ccc",
                      color: "gray",
                      textTransform: "none",
                      py: 2,
                    }}
                  >
                    Upload Photos
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </Button>
                  {photoFiles.length > 0 && (
                    <Typography mt={1}>
                      {photoFiles.length} photo(s) selected
                    </Typography>
                  )}
                </Grid>

                {/* Video Upload */}
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{
                      border: "2px dashed #ccc",
                      color: "gray",
                      textTransform: "none",
                      py: 2,
                    }}
                  >
                    Upload Video
                    <input
                      type="file"
                      hidden
                      accept="video/*"
                      onChange={handleVideoChange}
                    />
                  </Button>
                  {videoFile && (
                    <Typography mt={1}>{videoFile.name} selected</Typography>
                  )}
                </Grid>
                {fosterForm && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="start_date"
                        label="Start Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={formData.start_date || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="end_date"
                        label="End Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={formData.end_date || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                  </>
                )}

                {/* Submit */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                      background: "linear-gradient(to right, #00bcd4, #ff7043)",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: "bold",
                      borderRadius: 3,
                      py: 1.5,
                    }}
                  >
                    {loading
                      ? pet
                        ? "Updating..."
                        : "Posting..."
                      : pet
                      ? "Update Pet"
                      : "Post Pet for Adoption"}
                  </Button>
                </Grid>

                {message && (
                  <Grid item xs={12}>
                    <Typography
                      align="center"
                      color={message.includes("success") ? "green" : "red"}
                    >
                      {message}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
