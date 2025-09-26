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
import { API_BASE_URL } from "../config";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=verify, 3=set password
  const [formData, setFormData] = useState({
    email: "",
    token: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: send reset code
  const sendResetCode = async () => {
    const { email } = formData;
    if (!email) {
      setMessage("❌ Please enter your email");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgotPassword1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Reset code sent! Check your email.");
        setStep(2);
      } else {
        setMessage(`❌ ${data.message || "Something went wrong"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: verify code
  const verifyToken = async () => {
    const { email, token } = formData;
    if (!token) {
      setMessage("❌ Please enter the verification code");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      const data = await res.json();
      if (ok) {
        setMessage("✅ Code verified! Set your new password.");
        setStep(3);
      } else {
        setMessage(`❌ ${data.message || "Invalid code"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: set new password
  const setNewPassword = async () => {
    const { email, token, password, confirmPassword } = formData;
    if (!password || !confirmPassword) {
      setMessage("❌ Please enter all fields");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }
    if (password.length < 6 || password.length > 8) {
      setMessage("❌ Password must be 6-8 characters");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}api/auth/setPassword1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });
      const data = await res.json();
      if (ok) {
        setMessage("✅ Password reset successfully! You can login now.");
        navigate("/");
        setFormData({
          email: "",
          token: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        setMessage(`❌ ${data.message || "Failed to reset password"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error. Try again later.");
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
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(255,255,255,0.75)",
          zIndex: 1,
        }}
      />
      <Card
        sx={{
          position: "relative",
          zIndex: 2,
          maxWidth: 400,
          width: "100%",
          borderRadius: 4,
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          backgroundColor: "rgba(255,255,255,0.95)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
            sx={{ color: "#ff7043" }}
          >
            Forgot Password
          </Typography>
          <Typography
            variant="body2"
            textAlign="center"
            sx={{ mb: 3, color: "gray" }}
          >
            {step === 1 && "Enter your email to receive a reset code."}
            {step === 2 && "Enter the verification code sent to your email."}
            {step === 3 && "Set your new password."}
          </Typography>

          <Box component="form" noValidate>
            {step >= 1 && (
              <TextField
                label="Email"
                type="email"
                name="email"
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                value={formData.email}
                onChange={handleChange}
                disabled={step > 1} // lock email after sending code
              />
            )}

            {step === 2 && (
              <TextField
                label="Verification Code"
                name="token"
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                value={formData.token}
                onChange={handleChange}
              />
            )}

            {step === 3 && (
              <>
                <TextField
                  label="New Password"
                  type="password"
                  name="password"
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={formData.password}
                  onChange={handleChange}
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </>
            )}

            <Button
              fullWidth
              type="button"
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
                "&:hover": { backgroundColor: "#e85d30" },
              }}
              onClick={
                step === 1
                  ? sendResetCode
                  : step === 2
                  ? verifyToken
                  : setNewPassword
              }
            >
              {loading
                ? "Processing..."
                : step === 1
                ? "Send Code"
                : step === 2
                ? "Verify Code"
                : "Set Password"}
            </Button>

            <Typography
              variant="body2"
              textAlign="center"
              sx={{ mt: 2, color: "#555" }}
            >
              Remember your password?{" "}
              <Link href="/login" sx={{ color: "#ff7043" }}>
                Login
              </Link>
            </Typography>

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

export default ForgotPasswordPage;
