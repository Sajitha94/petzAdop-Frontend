import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Grid,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

function PetDetailsPage() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/postpet/${id}`);
        const data = await res.json();
        if (res.ok) {
          setPet(data.pet);
          console.log(data.pet.post_user._id, "pet"); // ✅ use data.pet, not pet

          // merge photos + video into one array
          const files = [...(data.pet.photo || [])];
          if (data.pet.video) files.push(data.pet.video);
          setMediaFiles(files);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPet();
  }, [id]);
  useEffect(() => {
    if (!pet) return; // don't run until pet is loaded

    const fetchUser = async () => {
      try {
        console.log(pet.post_user._id, "saji");

        const token = localStorage.getItem("token");
        const res = await fetch(
          `${API_BASE_URL}/api/auth/profile/${pet.post_user._id}`, // ✅ use slash, not colon
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (data.status === "success") {
          setUser(data.data);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUser();
  }, [pet]); // ✅ run when pet is available

  if (!user) return null;

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev < mediaFiles.length - 1 ? prev + 1 : prev));

  if (!pet) return <p>Loading...</p>;

  return (
    <Box
      sx={{ p: { xs: 2, sm: 4 }, display: "flex", justifyContent: "center" }}
    >
      <Box sx={{ width: "100%", maxWidth: 900 }}>
        {/* Top Section with Carousel */}
        <Card
          sx={{
            borderRadius: 3,
            mb: 3,
            border: "1px solid #ddd",
            position: "relative",
          }}
        >
          {mediaFiles.length > 0 && (
            <>
              {mediaFiles[currentIndex].endsWith(".mp4") ? (
                <video
                  src={`${API_BASE_URL}/uploads/${mediaFiles[currentIndex]}`}
                  controls
                  className="w-full rounded-lg bg-gray-100"
                  style={{ height: 400, objectFit: "cover" }}
                />
              ) : (
                <CardMedia
                  component="img"
                  image={`${API_BASE_URL}/uploads/${mediaFiles[currentIndex]}`}
                  alt={pet.name}
                  sx={{
                    height: 400,
                    objectFit: "cover",
                    borderRadius: "12px 12px 0 0",
                  }}
                />
              )}

              {/* Left Arrow */}
              {currentIndex > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: 10,
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    px: 1,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    borderRadius: "50%",
                    color: "white",
                  }}
                  onClick={handlePrev}
                >
                  ❮
                </Box>
              )}

              {/* Right Arrow */}
              {currentIndex < mediaFiles.length - 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: 10,
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    px: 1,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    borderRadius: "50%",
                    color: "white",
                  }}
                  onClick={handleNext}
                >
                  ❯
                </Box>
              )}
            </>
          )}

          <CardContent>
            <Typography variant="h4" fontWeight="bold">
              {pet.name}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {pet.breed}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
              <Chip label={pet.gender} size="small" />
              <Chip label={pet.size} size="small" />
              <Chip label={`${pet.age} years`} size="small" />
              <Chip label={pet.color} size="small" />
            </Stack>

            <Typography
              variant="body2"
              sx={{ mt: 2, display: "flex", alignItems: "center" }}
            >
              <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
              {pet.location}
            </Typography>
          </CardContent>
        </Card>

        {/* Adoption Information Section */}
        <Card sx={{ borderRadius: 3, mb: 3, border: "1px solid #ddd" }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Adoption Information
            </Typography>

            {/* Description */}
            <Box sx={{ display: "flex", alignItems: "flex-start", mt: 2 }}>
              <Typography
                sx={{
                  mr: 1.5,
                  color: "#00bcd4",
                  fontSize: 20,
                  lineHeight: "24px",
                }}
              >
                📝
              </Typography>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Description
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {pet.description || "No description available"}
                </Typography>
              </Box>
            </Box>

            {/* Medical History */}
            <Box sx={{ display: "flex", alignItems: "flex-start", mt: 2 }}>
              <Typography
                sx={{
                  mr: 1.5,
                  color: "#ff7043",
                  fontSize: 20,
                  lineHeight: "24px",
                }}
              >
                🩺
              </Typography>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Medical History
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {pet.medical_history || "No medical history provided"}
                </Typography>
              </Box>
            </Box>

            {/* Buttons with Gradient */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 3 }}
            >
              <Button
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: "bold",
                  background: "linear-gradient(to right, #00bcd4, #ff7043)",
                  color: "white",
                  textTransform: "none",
                  "&:hover": {
                    background: "linear-gradient(to right, #00acc1, #f4511e)",
                  },
                }}
              >
                Apply to Adopt {pet.name}
              </Button>
              <Button
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: "bold",
                  background: "linear-gradient(to right, #00bcd4, #ff7043)",
                  color: "white",
                  textTransform: "none",
                  "&:hover": {
                    background: "linear-gradient(to right, #00acc1, #f4511e)",
                  },
                }}
              >
                Schedule a Meet & Greet
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Shelter Information Section */}
        <Card sx={{ borderRadius: 3, mb: 3, border: "1px solid #ddd" }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Shelter Information
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {user.location}
            </Typography>

            <Stack spacing={1}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: 1,
                  borderColor: "grey.300",
                  p: 1,
                  borderRadius: 1,
                }}
              >
                <PhoneIcon sx={{ mr: 1, color: "text.secondary" }} />
                <Typography variant="body2">{user.phonenumber}</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: 1,
                  borderColor: "grey.300",
                  p: 1,
                  borderRadius: 1,
                }}
              >
                <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />
                <Typography variant="body2">{user.email}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StarIcon color="warning" sx={{ mr: 0.5 }} />
                <Typography variant="body2">4.9 Shelter Rating</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default PetDetailsPage;
