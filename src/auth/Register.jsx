import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
} from "@mui/material";
import backgroundImg from "../assets/login background.png";
function RegisterPage() {
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
          <Box component="form" noValidate>
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
                  variant="outlined"
                  required
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>

              {/* Password */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>

              {/* Confirm Password */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>

              {/* Phone */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  type="tel"
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              {/* City */}
              <Grid item xs={12} sm={6}>
                <TextField label="City" fullWidth variant="outlined" />
              </Grid>

              {/* Optional: Shelter/Organization */}
              <Grid item xs={12} sm={6} mx={3}>
                <TextField
                  label="Organization (if any)"
                  fullWidth
                  variant="outlined"
                  placeholder="Optional for shelters/foster organizations"
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} sm={6} mx={3}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
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
                    Sign Up
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
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default RegisterPage;
