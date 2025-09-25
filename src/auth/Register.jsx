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
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";
function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phonenumber: "",
    location: "",
    usertype: "adopter", // default
  });
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
    } = formData;
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

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    if (password.length < 6 || password.length > 8) {
      setMessage("❌ Password must be between 6 and 8 characters");
      return;
    }
    if (!validateEmail(email)) {
      setMessage("❌ Please enter a valid email address");
      return;
    }

    // 4. Phone number format
    if (!validatePhone(phonenumber)) {
      setMessage("❌ Please enter a valid phone number (10-15 digits)");
      return;
    }

    setLoading(true);
    setMessage("");

    const { ok, data } = await apiRequest("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phonenumber: formData.phonenumber,
        location: formData.location,
        usertype: formData.usertype,
      }),
    });

    if (ok) {
      setMessage("✅ Registration successful!");
      console.log("Registered User:", data);
      navigate("/");
    } else {
      setMessage(`❌ ${data.message || "Something went wrong"}`);
    }

    setLoading(false);
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
            Create Your Account
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
                    {loading ? "Signing Up..." : "Sign Up"}
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
