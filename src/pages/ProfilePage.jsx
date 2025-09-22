import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Button,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";

// Sample images for pets
import catImg from "../assets/login background.png";
import dogImg from "../assets/allpet.png";
import rabbitImg from "../assets/Kitten and Puppy.png";

function ProfilePage() {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      {/* User Info */}
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
            src="/static/images/avatar/1.jpg"
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              Jane Doe
            </Typography>
            <Typography variant="body2" color="text.secondary">
              jane.doe@example.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member since Jan 2025
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
          >
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* Saved / Favorite Pets */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Favorite Pets
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[catImg, dogImg, rabbitImg].map((img, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card sx={{ borderRadius: 3, border: "1px solid #ddd" }}>
              <CardContent sx={{ textAlign: "center", p: 1 }}>
                <Box
                  component="img"
                  src={img}
                  alt="pet"
                  sx={{
                    width: "100%",
                    height: 150, 
                    objectFit: "cover",
                    borderRadius: 2,
                    mb: 1,
                  }}
                />
                <Typography variant="subtitle1" fontWeight="bold">
                  {index === 0 ? "Luna" : index === 1 ? "Buddy" : "Coco"}
                </Typography>
                <Chip
                  label={index === 0 ? "Cats" : index === 1 ? "Dog" : "Rabbit"}
                  sx={{ mt: 1, backgroundColor: "#00bcd4", color: "white" }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Adoption Applications */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Adoption Applications
      </Typography>
      <Stack spacing={2} sx={{ mb: 4 }}>
        {[
          { pet: "Luna", status: "Pending" },
          { pet: "Buddy", status: "Approved" },
        ].map((app, index) => (
          <Card key={index} sx={{ borderRadius: 3, border: "1px solid #ddd" }}>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {app.pet}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {app.status}
                </Typography>
              </Box>
              <Button
                sx={{
                  background: "linear-gradient(to right, #00bcd4, #ff7043)",
                  color: "white",
                  fontWeight: "bold",
                  textTransform: "none",
                  borderRadius: 3,
                  px: 2,
                  "&:hover": {
                    background: "linear-gradient(to right, #00acc1, #f4511e)",
                  },
                }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* User Reviews */}
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
