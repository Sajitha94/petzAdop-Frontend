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
function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative", // needed for overlay
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
          bgcolor: "rgba(255, 255, 255, 0.7)", // semi-transparent overlay
          zIndex: 1,
        }}
      />

      {/* Login Card */}
      <Card
        sx={{
          position: "relative",
          zIndex: 2, // above overlay
          maxWidth: 400,
          width: "100%",
          borderRadius: 4,
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          backgroundColor: "rgba(255, 255, 255, 0.95)", // card transparency
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
          <Box component="form" noValidate>
            <TextField
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              sx={{ mb: 1 }}
            />

            {/* Forgot Password */}
            <Box sx={{ textAlign: "right", mb: 2 }}>
              <Link
                href="/forgot-password"
                underline="hover"
                sx={{ color: "#ff7043", fontSize: "14px" }}
              >
                Forgot Password?
              </Link>
            </Box>

            {/* Login Button */}
            <Button
              fullWidth
              variant="contained"
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
              Login
            </Button>

            {/* Extra Links */}
            <Typography
              variant="body2"
              textAlign="center"
              sx={{ mt: 2, color: "#555" }}
            >
              Don’t have an account?{" "}
              <span style={{ color: "#ff7043", cursor: "pointer" }}>
                Sign Up
              </span>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;
