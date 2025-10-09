import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
  MenuItem,
} from "@mui/material";
import backgroundImg from "../assets/login background.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { API_BASE_URL } from "../config";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/useContext";

function RegisterPage() {
  const navigate = useNavigate();
  const editUser = location.state?.user;

  const [user, setUserRegister] = useState(editUser || null);
  const [isEdit, setIsEdit] = useState(!!editUser);
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: editUser?.name || "",
    email: editUser?.email || "",
    password: "",
    confirmPassword: "",
    phonenumber: editUser?.phonenumber || "",
    location: editUser?.location || "",
    usertype: editUser?.usertype || "adopter",
    profilePictures: [],
  });

  useEffect(() => {
    if (!editUser && window.location.pathname.includes("/register")) {
      const fetchUser = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;
          const decoded = jwtDecode(token);
          const userId = decoded.id;
          const res = await fetch(
            `${API_BASE_URL}/api/auth/profile/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = await res.json();
          if (data.status === "success") {
            setFormData({
              name: data.data.name || "",
              email: data.data.email || "",
              password: "",
              confirmPassword: "",
              phonenumber: data.data.phonenumber || "",
              location: data.data.location || "",
              usertype: data.data.usertype || "adopter",
              profilePictures: data.data.profilePictures || [],
            });
            setUserRegister(data.data); // <-- store the fetched user
            setIsEdit(true);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchUser();
    }
  }, [editUser]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{10,15}$/; // 10-15 digits
    return re.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      password,
      confirmPassword,
      phonenumber,
      location,
      usertype,
      profilePictures,
    } = formData;

    // ✅ Validation
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !phonenumber ||
      !location ||
      !usertype
    ) {
      setMessage("❌ Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    if (password.length < 6 || password.length > 16) {
      setMessage("❌ Password must be between 6 and 16 characters");
      return;
    }

    if (!validateEmail(email)) {
      setMessage("❌ Please enter a valid email address");
      return;
    }

    if (!validatePhone(phonenumber)) {
      setMessage("❌ Please enter a valid phone number (10–15 digits)");
      return;
    }

    setLoading(true);
    setMessage("");

    // ✅ Prepare FormData for backend
    const formDataToSend = new FormData();
    formDataToSend.append("name", name);
    formDataToSend.append("email", email);
    formDataToSend.append("password", password);
    formDataToSend.append("phonenumber", phonenumber);
    formDataToSend.append("location", location);
    formDataToSend.append("usertype", usertype);

    profilePictures.forEach((file) => {
      formDataToSend.append("profilePictures", file);
    });

    const token = localStorage.getItem("token");
    const url = isEdit
      ? `${API_BASE_URL}/api/auth/update/${user?._id}`
      : `${API_BASE_URL}/api/auth/register`;

    try {
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        body: formDataToSend,
        headers: {
          ...(isEdit && token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      if (data.status === "error" && data.message?.includes("Unauthorized")) {
        alert("❌ Session expired. Please login again.");
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
        return null;
      }
      if (res.ok) {
        // ✅ If backend returns a new token (for registration or update)
        if (data.token) {
          localStorage.setItem("token", data.token);
          const decoded = jwtDecode(data.token);
          setUser(decoded);
        }

        setMessage(
          isEdit
            ? "✅ Profile updated successfully!"
            : "✅ Registration successful!"
        );

        // Redirect after short delay
        setTimeout(() => navigate("/"), 1000);
      } else {
        setMessage(`❌ ${data.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(255,255,255,0.75)",
          zIndex: 1,
        }}
      />

      {/* Registration Card */}
      <Card
        sx={{
          position: "relative",
          zIndex: 2,
          maxWidth: 600,
          width: "100%",
          borderRadius: 4,
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          backgroundColor: "rgba(255,255,255,0.95)",
        }}
      >
        <CardContent sx={{ px: { xs: 3, sm: 5 }, py: { xs: 4, sm: 5 } }}>
          {/* Title */}
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
            sx={{ color: "#ff7043", mb: 1 }}
          >
            {isEdit ? "Edit Your Profile" : "Create Your Account"}
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ mb: 4, color: "#555" }}
          >
            Sign up to adopt or foster your favorite pets
          </Typography>

          {/* Registration Form */}
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Grid
              container
              spacing={2}
              sx={{ alignItems: "center", justifyContent: "center" }}
            >
              {/* Full Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  fullWidth
                  name="name"
                  variant="outlined"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  type="email"
                  name="email"
                  fullWidth
                  variant="outlined"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>

              {/* Password */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Password"
                  type="password"
                  name="password"
                  fullWidth
                  variant="outlined"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>

              {/* Confirm Password */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  fullWidth
                  variant="outlined"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </Grid>

              {/* Phone */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  type="tel"
                  name="phonenumber"
                  fullWidth
                  variant="outlined"
                  value={formData.phonenumber}
                  onChange={handleChange}
                />
              </Grid>

              {/* City */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  fullWidth
                  name="location"
                  variant="outlined"
                  value={formData.location}
                  onChange={handleChange}
                />
              </Grid>

              {/* Optional: Shelter/Organization */}
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ minWidth: { sm: "40%", xs: "60vw" } }}
              >
                <TextField
                  select
                  label="User Type"
                  name="usertype"
                  fullWidth
                  variant="outlined"
                  value={formData.usertype}
                  onChange={handleChange}
                  className="px-6"
                  sx={{ padding: "10px !important" }}
                >
                  <MenuItem value="adopter">Adopter</MenuItem>
                  <MenuItem value="shelter">Shelter</MenuItem>
                  <MenuItem value="foster organization">
                    Foster Organization
                  </MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ borderRadius: 3 }}
                >
                  Upload Profile Pictures
                  <input
                    type="file"
                    name="profilePictures"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profilePictures: [...e.target.files],
                      })
                    }
                  />
                </Button>

                {formData.profilePictures.length > 0 && (
                  <Box mt={2} display="flex" flexDirection="column" gap={1}>
                    {Array.from(formData.profilePictures).map((pic, index) => (
                      <span
                        key={index}
                        style={{ fontSize: "14px", color: "#555" }}
                      >
                        {typeof pic === "string" ? pic : pic.name}
                      </span>
                    ))}
                  </Box>
                )}
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} sm={6} mx={3}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      backgroundColor: "#ff7043",
                      color: "white",
                      fontWeight: "bold",
                      textTransform: "none",
                      py: 1.5, // vertical padding
                      px: 6, // horizontal padding
                      borderRadius: 3,
                      fontSize: "16px",
                      "&:hover": {
                        backgroundColor: "#e85d30",
                      },
                    }}
                  >
                    {loading
                      ? isEdit
                        ? "Updating..."
                        : "Signing Up..."
                      : isEdit
                      ? "Update Profile"
                      : "Sign Up"}
                  </Button>
                </Box>
              </Grid>

              {/* Extra Links */}
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  textAlign="center"
                  sx={{ mt: 2, color: "#555" }}
                >
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    underline="hover"
                    sx={{ color: "#ff7043" }}
                  >
                    Login
                  </Link>
                </Typography>
              </Grid>
            </Grid>
            {/* Message */}
            {message && (
              <Typography
                textAlign="center"
                sx={{
                  mt: 2,
                  color: message.startsWith("✅") ? "green" : "red",
                }}
              >
                {message}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default RegisterPage;
