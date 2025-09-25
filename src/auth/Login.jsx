import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
} from "@mui/material";
import backgroundImg from "../assets/login background.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/useContext";
function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;
    // Basic validation
    if (!email || !password) {
      setMessage("❌ Please fill in all fields");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const { ok, data } = await apiRequest("api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (ok) {
        setMessage("✅ Login successful!");
        console.log("User data:", data);
        const decoded = jwtDecode(data.data.token);
        setUser({ name: decoded.name, role: decoded.role });
        // Save token to localStorage or context
        localStorage.setItem("token", data.data.token);

        // Navigate to dashboard or home page
        navigate("/");
      } else {
        setMessage(`❌ ${data.message || "Login failed"}`);
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
          bgcolor: "rgba(255, 255, 255, 0.7)",
          zIndex: 1,
        }}
      />

      {/* Login Card */}
      <Card
        sx={{
          position: "relative",
          zIndex: 2,
          maxWidth: 400,
          width: "100%",
          borderRadius: 4,
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Title */}
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
            sx={{ color: "#ff7043" }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body2"
            textAlign="center"
            sx={{ mb: 3, color: "gray" }}
          >
            Please login to continue
          </Typography>

          {/* Login Form */}
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              name="email"
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              fullWidth
              variant="outlined"
              sx={{ mb: 1 }}
              value={formData.password}
              onChange={handleChange}
              required
            />

            {/* Forgot Password */}
            <Box sx={{ textAlign: "right", mb: 2 }}>
              <Link
                href="/forgotpage"
                underline="hover"
                sx={{ color: "#ff7043", fontSize: "14px" }}
              >
                Forgot Password?
              </Link>
            </Box>

            {/* Login Button */}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#ff7043",
                color: "white",
                fontWeight: "bold",
                textTransform: "none",
                py: 1.5,
                borderRadius: 3,
                fontSize: "16px",
                "&:hover": {
                  backgroundColor: "#e85d30",
                },
              }}
            >
              {loading ? "Logging In..." : "Login"}
            </Button>

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
            {/* Extra Links */}
            <Typography
              variant="body2"
              textAlign="center"
              sx={{ mt: 2, color: "#555" }}
              href="/register"
            >
              Don’t have an account?{" "}
              <Link
                href="/register"
                underline="hover"
                sx={{ color: "#ff7043" }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;
